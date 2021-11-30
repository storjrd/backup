const fs = require("fs/promises");
const path = require("path");
const { app } = require("electron");

const whenAvailable = (() => {
	let tail = Promise.resolve();

	return (fn) => {
		tail = tail.then(fn);

		return tail;
	};
})();

const configDirectory = path.join(app.getPath("appData"), "storj-backup");
const configFile = path.join(configDirectory, "config.json");

const tryAccess = async (path) => {
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

const get = () =>
	whenAvailable(async () => JSON.parse(await fs.readFile(configFile)));

const set = (params) =>
	whenAvailable(async () => {
		const config = JSON.parse(await fs.readFile(configFile));

		await fs.writeFile(
			configFile,
			JSON.stringify({
				...config,
				...params
			})
		);
	});

module.exports = { get, set };
