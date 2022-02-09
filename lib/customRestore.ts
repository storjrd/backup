import path from "path";
import fs from "fs-extra";
import { Restic, Snapshot } from "./createRestic";

interface RestoreInput {
	snapshot: Snapshot;
	directory: string;
}

const temporaryDirectoryName = "pending-restore";

const makePathWindowsSafe = (path: string) =>
	path
		.split("\\")
		.map((part) => (part.endsWith(":") ? part.slice(0, -1) : part))
		.join("\\");

export default async (
	restic: Restic,
	{ snapshot, directory }: RestoreInput
): Promise<void> => {
	if (snapshot.paths.length !== 1) {
		throw new Error("customRestore() can only restore one path");
	}

	// ".pending-restore"
	const restoreDirectory = path.join(directory, temporaryDirectoryName);
	// intended restore directory
	const deepRestoreDirectory = makePathWindowsSafe(
		path.join(restoreDirectory, snapshot.paths[0])
	);
	// final directory after move
	const finalDirectory = path.join(
		directory,
		path.basename(snapshot.paths[0])
	);

	console.log({
		restoreDirectory,
		deepRestoreDirectory,
		finalDirectory
	});

	if (await fs.pathExists(restoreDirectory)) {
		throw new Error("Pending restore already in progress");
	}

	await restic.restore(snapshot.id, restoreDirectory);
	await fs.move(deepRestoreDirectory, finalDirectory);
	await fs.remove(restoreDirectory);
};
