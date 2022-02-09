import os from "os";
import fs from "fs";
import net from "net";
import { app, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";

import type { Api } from "./src/api";
import createApi from "./lib/createApi";
import * as config from "./lib/config";

const addApiHandlers = (api: Api) => {
	for (const key in api) {
		// get params, excluding first event variable
		// @ts-ignore
		ipcMain.handle(key, (...params: any[]) => api[key](...params.slice(1)));
	}
};

const loadURL = serve({ directory: `${__dirname}/dist` });

(async () => {
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

	const api = createApi({
		mainWindow
	});

	const { credentials, resticPassphrase } = await config.get();

	if (
		typeof credentials === "object" &&
		typeof resticPassphrase === "string"
	) {
		const response = await api.setup({
			...credentials,
			resticPassphrase
		});

		console.log("auto login response", response);
	}

	addApiHandlers(api);

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
