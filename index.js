const os = require("os");
const net = require("net");
const { app, BrowserWindow, ipcMain } = require("electron");
const serve = require("electron-serve");
const createRestic = require("./lib/createRestic");

const loadURL = serve({ directory: "dist" });

let mainWindow;

(async () => {
	const restic = createRestic({
		repository: `${os.homedir()}/storj-backup-test`,
		password: "a"
	});

	try {
		await restic.init();
	} catch (err) {
		console.warn(err);
	}

	ipcMain.handle("snapshots", async () => restic.snapshots());

	ipcMain.handle("backup", async (dir) => {
		for await (const event of restic.backup(dir)) {
			ipcMain.send("backup-status", event);
		}
	});

	console.log("ready");

	await app.whenReady();

	mainWindow = new BrowserWindow({
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

	if (process.env.STORJ_BACKUP_DEV !== "true") {
		// load from directory
		await loadURL(mainWindow);

		await mainWindow.loadURL("app://-");
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
		mainWindow.loadURL(`http://127.0.0.1:${vueServePort}`);
		mainWindow.webContents.openDevTools();
	}
})();
