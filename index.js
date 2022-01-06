const os = require("os");
const net = require("net");
const { app, dialog, BrowserWindow, ipcMain, shell } = require("electron");
const serve = require("electron-serve");

const config = require("./lib/config");
const createRestic = require("./lib/createRestic");

const loadURL = serve({ directory: `${__dirname}/dist` });

(async () => {
	const handleRestic = async (restic) => {
		try {
			await restic.init();
		} catch (err) {
			// console.warn(err);
		}

		ipcMain.handle("snapshots", async () => restic.snapshots());

		const backupEvents = [];

		ipcMain.handle("backup", async (event, { directories }) => {
			console.log({ directories });

			for await (const event of restic.backup(directories[0])) {
				backupEvents.push(event);
			}
		});

		ipcMain.handle("get-backup-events", () => backupEvents.splice(0));

		ipcMain.handle("restore", async (event, { snapshotId, target }) => {
			console.log({ snapshotId, target });
			const output = await restic.restore(snapshotId, target);
			console.log({ output });

			return output;
		});
	};

	ipcMain.handle("openSignup", async () => {
		shell.openExternal("https://storj.io");
	});

	ipcMain.handle("openUpgradePlan", async () => {
		shell.openExternal("https://storj.io/pricing");
	});

	const { credentials } = await config.get();

	console.log({ credentials });

	let loginStatus = false;
	ipcMain.handle("loginStatus", () => loginStatus);

	ipcMain.handle("getBucketName", async () => {
		const { credentials } = await config.get();

		if (typeof credentials !== "object") {
			return null;
		}

		return credentials.bucket;
	});

	const handleSetup = () =>
		ipcMain.handle(
			"setup",
			async function (event, { endpoint, bucket, accessKey, secretKey }) {
				console.log("setup()", ...arguments);

				const credentials = {
					endpoint,
					bucket,
					accessKey,
					secretKey
				};

				const resticPassphrase = "a";

				const restic = createRestic({
					...credentials,
					password: resticPassphrase
				});

				config.set({
					credentials,
					resticPassphrase
				});

				await handleRestic(restic);
				loginStatus = true;
			}
		);

	// auto login
	if (typeof credentials === "object") {
		const resticPassphrase = "a";

		const restic = createRestic({
			...credentials,
			password: resticPassphrase
		});

		await handleRestic(restic);
		loginStatus = true;
	} else {
		handleSetup();
	}

	ipcMain.handle("logout", async () => {
		ipcMain.removeHandler("snapshots");
		ipcMain.removeHandler("backup");
		ipcMain.removeHandler("get-backup-events");
		ipcMain.removeHandler("restore");

		await config.set({
			credentials: undefined,
			resticPassphrase: undefined
		});

		handleSetup();
	});

	await app.whenReady();

	const mainWindow = new BrowserWindow({
		width: 700,
		height: 500,
		minWidth: 700,
		minHeight: 500,
		maxWidth: 700,
		maxHeight: 500,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: false,
			preload: `${__dirname}/preload.js`
		}
	});

	ipcMain.handle("get-directory", async () => {
		return dialog.showOpenDialog(mainWindow, {
			properties: ["openDirectory"]
		});
	});

	if (process.env.STORJ_BACKUP_DEV !== "true") {
		// load from directory
		await loadURL(mainWindow);

		await mainWindow.loadURL("app://-");
		await mainWindow.focus();
	} else {
		const vueServePort = 8080;

		// wait for dev server to start
		for (;;) {
			const ready = await new Promise((resolve) => {
				const socket = net.createConnection({
					port: vueServePort
				});

				socket.on("connect", () => {
					resolve(true);
				});

				socket.on("error", () => {
					resolve(false);
				});
			});

			if (ready === true) {
				break;
			}

			await new Promise((resolve) => setTimeout(resolve, 500));
		}

		// load from vue serve
		await mainWindow.loadURL(`http://127.0.0.1:${vueServePort}`);
		await mainWindow.focus();

		mainWindow.webContents.openDevTools();
	}
})();
