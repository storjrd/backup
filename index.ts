import os from "os";
import net from "net";
import { app, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";

import type { Api } from "./src/api";
import createApi from "./lib/createApi";
import * as config from "./lib/config";

const addApiHandlers = (api: Api) => {
	for (const key in api) {
		// @ts-ignore
		ipcMain.handle(key, api[key]);
	}
};

const loadURL = serve({ directory: `${__dirname}/dist` });

(async () => {
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

	const api = createApi({
		mainWindow
	});

	const { credentials } = await config.get();

	if (typeof credentials === "object") {
		const resticPassphrase = "a";

		api.setup({
			...credentials,
			resticPassword: resticPassphrase
		});
	}

	addApiHandlers(api);

	await app.whenReady();

	app.setLoginItemSettings({
		openAtLogin: true
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
