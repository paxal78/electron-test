const electron = require('electron')
	// Module to control application life.
const app = electron.app
const os = require('os');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const autoUpdater = require("electron-updater").autoUpdater
const {
	dialog
} = require('electron')



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	})

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	// Open the DevTools.
	mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	});
	autoUpdater.addListener("update-available", function(event) {
		dialog.showMessageBox({
			type: 'info',
			title: 'Found Updates',
			message: 'Found updates, do you want update now?',
			buttons: ['Sure', 'No']
		}, (buttonIndex) => {
			if (buttonIndex === 0) {
				autoUpdater.downloadUpdate()
			} else {
				updater.enabled = true
				updater = null
			}
		})

	});
	autoUpdater.addListener("update-downloaded", function(event, releaseNotes, releaseName, releaseDate, updateURL) {
		dialog.showMessageBox({
			title: 'Install Updates',
			message: 'Updates downloaded, application will be quit for update...'
		}, () => {
			autoUpdater.quitAndInstall();
		});
	});
	autoUpdater.addListener("error", function(error) {
		console.error(error);
	});

	autoUpdater.addListener("update-not-available", function(event) {
		dialog.showMessageBox({
			title: 'No Updates',
			message: 'Current version is up-to-date.'
		})
	});

	autoUpdater.setFeedURL('http://0.0.0.0:8080');


	autoUpdater.checkForUpdates();

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
