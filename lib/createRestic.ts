import os from "os";
import path from "path";
import assert from "assert";
import execa from "execa";
import { Readable } from "stream";

const binPath = path.join(
	process.env.STORJ_BACKUP_USE_RELATIVE_RESTIC === "true"
		? __dirname
		: path.join(process.resourcesPath, "resources"),
	"../restic"
);

const binaryPaths: Record<string, string> = {
	"win32-x64": path.join(binPath, "restic_0.12.1_windows_amd64.exe"),
	"linux-x64": path.join(binPath, "restic_0.12.1_linux_amd64"),
	"darwin-x64": path.join(binPath, "restic_0.12.1_darwin_amd64"),
	"darwin-arm64": path.join(binPath, "restic_0.12.1_darwin_arm64")
};

async function* parseJSONStream(stream: Readable) {
	let raw: string | undefined = "";

	for await (const chunk of stream) {
		assert(typeof raw === "string");

		raw += chunk;

		const rawObjects: string[] = raw.split("\n");

		raw = rawObjects.pop();

		for (const object of rawObjects) {
			yield JSON.parse(object);
		}
	}
}

export type Snapshot = {
	time: string;
	parent: string;
	tree: string;
	paths: string[];
	hostname: string;
	username: string;
	uid: Number;
	gid: Number;
	id: string;
	short_id: string;
};

export type BackupStatusEvent = {
	message_type: "status";
	bytes_done: number;
	files_done: number;
	percent_done: number;
	total_bytes: number;
	total_files: number;
	current_files: string[] | undefined;
};

export type BackupSummaryEvent = {
	message_type: "summary";
	data_added: number;
	data_blobs: number;
	dirs_changed: number;
	dirs_new: number;
	dirs_unmodified: number;
	files_changed: number;
	snapshot_id: string;
	total_bytes_processed: number;
	total_duration: number;
	total_files_processed: number;
	tree_blobs: number;
};

export type BackupEvent = BackupStatusEvent | BackupSummaryEvent;

export type Restic = {
	init: () => Promise<void>;
	snapshots: () => Promise<Snapshot[]>;
	backup: (dir: string) => AsyncIterable<BackupEvent>;
	restore: (snapshotId: string, dir: string) => Promise<void>;
};

type CreateRestic = (args: {
	endpoint: string;
	bucket: string;
	accessKey: string;
	secretKey: string;
	password: string;
}) => Restic;

const createRestic: CreateRestic = ({
	endpoint,
	bucket,
	accessKey,
	secretKey,
	password
}) => {
	const platformKey = `${os.platform()}-${os.arch()}`;

	const binaryPath =
		typeof binaryPaths[platformKey] === "string"
			? binaryPaths[platformKey]
			: "restic";

	console.log({ binaryPath });

	const runRestic = (...args: string[]) =>
		execa(binaryPath, [...args, "--json"], {
			env: {
				RESTIC_REPOSITORY: `s3:${endpoint}/${bucket}`,
				RESTIC_PASSWORD: password,
				AWS_ACCESS_KEY_ID: accessKey,
				AWS_SECRET_ACCESS_KEY: secretKey
			}
		});

	const runResticSingleOutput = async (...args: string[]) => {
		const { stdout, stderr } = await runRestic(...args);
		assert(stdout !== null);

		return JSON.parse(stdout);
	};

	const runResticStreamOutput = (...args: string[]) => {
		const { stdout, stderr } = runRestic(...args);
		assert(stdout !== null);

		return parseJSONStream(stdout);
	};

	const init = async () => {
		await runRestic("init");
	};

	const snapshots = async () =>
		runResticSingleOutput("snapshots") as Promise<Snapshot[]>;

	const backup = async function* (dir: string) {
		for await (const event of runResticStreamOutput("backup", dir)) {
			yield event as BackupEvent;
		}
	};

	const restore = async (snapshotId: string, dir: string) => {
		await runRestic("restore", "--target", dir, snapshotId);
	};

	return {
		init,
		snapshots,
		backup,
		restore
	};
};

export { createRestic };
