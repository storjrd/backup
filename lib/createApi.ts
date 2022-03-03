import fs from "fs";
import { BrowserWindow, shell, dialog } from "electron";

import { createRestic, Restic, BackupEvent } from "../lib/createRestic";
// import customRestore from "../lib/customRestore";
import * as config from "../lib/config";

import { Api } from "../src/api";

function requireInitializedRestic(
	restic: Restic | undefined
): asserts restic is Restic {
	if (restic === undefined) {
		throw new Error("Restic not initialized");
	}
}

type CreateApi = (arg0: { mainWindow: BrowserWindow }) => Api;

const createApi: CreateApi = ({ mainWindow }) => {
	let restic: Restic | undefined = undefined;

	const backupEvents: BackupEvent[] = [];

	return {
		setup: async ({
			endpoint,
			bucket,
			accessKey,
			secretKey,
			resticPassphrase
		}) => {
			const credentials = {
				endpoint,
				bucket,
				accessKey,
				secretKey
			};

			if (
				typeof resticPassphrase !== "string" ||
				resticPassphrase.length <= 3
			) {
				return {
					success: false,
					error: "Password needs to be longer than three characters."
				};
			}

			restic = createRestic({
				...credentials,
				password: resticPassphrase
			});

			try {
				await restic.init();
			} catch (err) {
				const isAlreadyInitialized = () =>
					typeof err.stderr === "string" &&
					err.stderr.includes(
						"repository master key and config already initialized"
					);

				// if any error except being already initialized
				if (!isAlreadyInitialized()) {
					console.log(err);

					restic = undefined;

					return {
						success: false,
						error: "Failed to initialized Restic. Likely bad credentials."
					};
				}
			}

			try {
				await config.set({
					credentials,
					resticPassphrase
				});
			} catch (err) {
				return {
					success: false,
					error: "Failed to set credentials"
				};
			}

			return {
				success: true
			};
		},

		snapshots: async () => {
			requireInitializedRestic(restic);

			return restic.snapshots();
		},

		backup: async ({ directories }) => {
			requireInitializedRestic(restic);

			if (directories.length < 1) {
				throw new Error("Directory not specified");
			}

			for await (const event of restic.backup(directories[0])) {
				backupEvents.push(event);
			}
		},

		"get-backup-events": () => backupEvents.splice(0),

		restore: async ({ snapshot, target }) => {
			requireInitializedRestic(restic);

			const output = await restic.restore(snapshot.id, target);
			console.log({ output });
		},

		openSignup: () => {
			shell.openExternal("https://storj.io");
		},

		openUpgradePlan: () => {
			shell.openExternal("https://storj.io/pricing");
		},

		openGetStarted: () => {
			shell.openExternal("https://universe.storj.io/#/start");
		},

		loginStatus: () => restic !== undefined,

		getEndpoint: async () => {
			const { credentials } = await config.get();

			if (typeof credentials !== "object") {
				throw new Error("credentials undefined");
			}

			return credentials.endpoint;
		},

		"get-directory": async () => {
			return dialog.showOpenDialog(mainWindow, {
				properties: ["openDirectory"]
			});
		},

		getBucketName: async () => {
			const { credentials } = await config.get();

			if (typeof credentials !== "object") {
				throw new Error("credentials undefined");
			}

			return credentials.bucket;
		},

		logout: async () => {
			await config.set({
				credentials: undefined,
				resticPassphrase: undefined
			});
		},

		getTotalUsage: () => {},

		"get-file-count": async ({
			path
		}: {
			path: string;
		}): Promise<number> => {
			const getAllDirFilesCount = function (
				dirPath: string,
				count: number
			) {
				const files = fs.readdirSync(dirPath);

				count = count || 0;

				files.forEach(function (file) {
					if (fs.statSync(dirPath + "/" + file).isDirectory()) {
						count = getAllDirFilesCount(
							dirPath + "/" + file,
							count
						);
					} else {
						count += 1;
					}
				});

				return count;
			};

			try {
				return getAllDirFilesCount(path, 0);
			} catch {
				return 0;
			}
		}
	};
};

export default createApi;
