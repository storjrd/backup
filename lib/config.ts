import fs from "fs/promises";
import path from "path";
import { app } from "electron";

const whenAvailable = (() => {
	let tail: Promise<any> = Promise.resolve();

	return <Type>(fn: () => Promise<Type>): Promise<Type> => {
		tail = tail.then(fn);

		return tail;
	};
})();

const configDirectory = path.join(app.getPath("appData"), "storjrdbackup");
const configFile = path.join(configDirectory, "config.json");

const tryAccess = async (path: string) => {
	try {
		await fs.access(path);

		return true;
	} catch (err) {
		return false;
	}
};

whenAvailable(async () => {
	if (!(await tryAccess(configDirectory))) {
		console.log("creating config directory");

		await fs.mkdir(configDirectory);
	}

	if (!(await tryAccess(configFile))) {
		console.log("creating config file");

		await fs.writeFile(
			configFile,
			JSON.stringify({
				credentials: undefined,
				resticPassphrase: undefined
			})
		);
	}
});

export type Config = Partial<{
	credentials: {
		endpoint: string;
		bucket: string;
		accessKey: string;
		secretKey: string;
	};
	resticPassphrase: string;
}>;

export const get = (): Promise<Config> =>
	whenAvailable(
		async () => JSON.parse(await fs.readFile(configFile, "utf8")) as Config
	);

export const set = (params: Config): Promise<void> =>
	whenAvailable(async () => {
		const config = JSON.parse(
			await fs.readFile(configFile, "utf8")
		) as Config;

		await fs.writeFile(
			configFile,
			JSON.stringify({
				...config,
				...params
			})
		);
	});
