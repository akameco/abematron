'use strict';
const electron = require('electron');
const {Menu, app, shell} = electron;

module.exports = () => {
	const appName = app.getName();
	const tpl = [
		{
			label: appName,
			submenu: [
				{
					label: `${appName}について`,
					role: 'about'
				},
				{
					type: 'separator'
				},
				{
					label: 'サービス',
					role: 'services',
					submenu: []
				},
				{
					type: 'separator'
				},
				{
					label: `${appName}を隠す`,
					accelerator: 'Command+H',
					role: 'hide'
				},
				{
					label: '他を隠す',
					accelerator: 'Command+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'すべてを表示',
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: '終了',
					accelerator: 'Command+Q',
					click() {
						app.quit();
					}
				}
			]
		},
		{
			label: '表示',
			submenu: [
				{
					label: 'リロード',
					accelerator: 'CmdOrCtrl+R',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.reload();
						}
					}
				},
				{
					label: 'フルスクリーンにする',
					accelerator: (() => process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11')(),
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: '最前面にする',
					accelerator: 'CmdOrCtrl+T',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.setAlwaysOnTop(!focusedWindow.isAlwaysOnTop());
						}
					}
				}
			]
		},
		{
			label: 'オーディオ',
			role: 'window',
			submenu: [
				{
					label: '音量を上げる',
					accelerator: 'CmdOrCtrl+Right',
					click(item, focusedWindow) {
						if (focusedWindow) {
							const page = focusedWindow.webContents;
							page.send('volume-up');
						}
					}
				},
				{
					label: '音量を下げる',
					accelerator: 'CmdOrCtrl+Left',
					click(item, focusedWindow) {
						if (focusedWindow) {
							const page = focusedWindow.webContents;
							page.send('volume-down');
						}
					}
				},
				{
					label: 'ミュート',
					accelerator: 'CmdOrCtrl+S',
					click(item, focusedWindow) {
						if (focusedWindow) {
							const page = focusedWindow.webContents;
							page.setAudioMuted(!page.isAudioMuted());
						}
					}
				}
			]
		},
		{
			label: 'ウインドウ',
			role: 'window',
			submenu: [
				{
					label: '最小化',
					accelerator: 'CmdOrCtrl+M',
					role: 'minimize'
				}
			]
		},
		{
			label: 'ヘルプ',
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
					click() {
						shell.openExternal('https://github.com/akameco/abematron');
					}
				}
			]
		}
	];

	return Menu.buildFromTemplate(tpl);
};
