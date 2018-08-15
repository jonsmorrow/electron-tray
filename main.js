const {app, Tray, Menu, BrowserWindow } = require('electron')
const path = require('path')
const updater = require('./updater.js')

const iconPath = path.join(__dirname, 'assets/icon.png');
let appIcon = null;
let aboutWindow = null;

try {
	require('electron-reloader')(module);
} catch (err) {}

app.dock.hide();
app.on('ready', function() {
  aboutWindow = new BrowserWindow({
    show: false,
    width: 510,
    height: 260,
    resizable: false,
    minimizable: false,
    maximizable: false
  });
  aboutWindow.loadURL(`file://${__dirname}/about.html`)
  aboutWindow.on('close', function (event) {
    if(!app.isQuiting){
      event.preventDefault();
      aboutWindow.hide();
    }
    return false;
  });

  appIcon = new Tray(iconPath);
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'About ' + app.getName(),
      click: () => aboutWindow.show()
    },
    {type: 'separator'},
    {
      label: 'Check for updates',
      accelerator: "Alt+Command+U",
      click: updater.checkForUpdates
    },
    {type: 'separator'},
    {
      label: 'Quit',
      accelerator: "Command+Q",
      click: function() {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  appIcon.setToolTip("electron-tray");
  appIcon.setContextMenu(contextMenu);
});
