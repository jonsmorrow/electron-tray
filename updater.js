/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

let updater
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['Yes', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    }
    else {
      updater.enabled = true
      updater = null
    }
  })
})

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  })
  updater.enabled = true
  updater = null
})

autoUpdater.on('update-downloaded', () => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
  // dialog.showMessageBox({
  //   title: 'Install Updates',
  //   message: 'Updates downloaded, application will be quit for update...'
  // }, () => {
  //   setTimeout(function () {
  //       autoUpdater.quitAndInstall();
  //   }, 1000);
  // })
})

// export this to MenuItem click callback
function checkForUpdates (menuItem, focusedWindow, event) {
  console.log(menuItem)
  updater = menuItem
  updater.enabled = false
  autoUpdater.checkForUpdates()
}
module.exports.checkForUpdates = checkForUpdates
