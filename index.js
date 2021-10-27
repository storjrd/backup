const { app, BrowserWindow } = require("electron");
const serve = require("electron-serve");

const loadURL = serve({ directory: "dist" });

let mainWindow;

(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow({
		width: 700,
		height: 500,
		minWidth: 700,
		minHeight: 500,
		maxWidth: 700,
		maxHeight: 500
	});

	await loadURL(mainWindow);

	// The above is equivalent to this:
	await mainWindow.loadURL("app://-");
	// The `-` is just the required hostname
})();
