const os = require("os");
const net = require("net");
const { app, BrowserWindow, ipcMain } = require("electron");
const serve = require("electron-serve");
const createRestic = require("./lib/createRestic");

const loadURL = serve({ directory: `${__dirname}/dist` });

let mainWindow;

(async () => {
	ipcMain.handle(
		"setup",
		async function (event, { endpoint, bucket, accessKey, secretKey }) {
			console.log("setup()", ...arguments);

			const restic = createRestic({
				endpoint,
				bucket,
				accessKey,
				secretKey,
				password: "a"
			});

			try {
				await restic.init();
			} catch (err) {
				console.warn(err);
			}

			ipcMain.handle("snapshots", async () => restic.snapshots());

			ipcMain.handle("backup", async (event, { directories }) => {
				console.log({ directories });

				for await (const event of restic.backup(directories[0])) {
					// ipcMain.send("backup-status", event);
					console.log({ event });
				}
			});
		}
	);

	await app.whenReady();

	mainWindow = new BrowserWindow({
		width: 700,
		height: 500,
		minWidth: 700,
		minHeight: 500,
		maxWidth: 700,
		maxHeight: 500,
		webPreferences: {
			nodeIntegration: false,
			preload: `${__dirname}/preload.js`
		}
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
