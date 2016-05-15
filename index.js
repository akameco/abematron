'use strict';
const path = require('path');
const fs = require('fs');
const electron = require('electron');
const {app, BrowserWindow} = require('electron');
const storage = require('./storage');
const appMenu = require('./menu');
let mainWindow;

function createMainWindow() {
	const defaultWindowState = {
		title: 'abematron',
		width: 660,
		height: 520,
		webPreferences: {
			preload: path.join(__dirname, 'browser.js'),
			nodeIntegration: false,
			webSecurity: false,
			plugins: true
		}
	};

	const windowState = Object.assign({}, defaultWindowState, storage.get('windowState'));

	const win = new BrowserWindow(windowState);

	if (process.env.NODE_ENV === 'development') {
		win.openDevTools();
	}

	const lastURL = storage.get('lastURL') || 'https://abema.tv/';
	win.loadURL(lastURL);
	win.on('closed', () => {
		mainWindow = null;
	});

	electron.Menu.setApplicationMenu(appMenu());
	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();

	const page = mainWindow.webContents;

	page.on('dom-ready', () => {
		page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'));
		mainWindow.show();
	});

	page.on('new-window', (e, url) => {
		e.preventDefault();
		electron.shell.openExternal(url);
	});
});

app.on('before-quit', () => {
	const currentURL = mainWindow.webContents.getURL();
	storage.set('lastURL', currentURL);

	const opt = {
		alwaysOnTop: mainWindow.isAlwaysOnTop()
	};
	storage.set('windowState', Object.assign({}, mainWindow.getBounds(), opt));
});
