const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/dist/sakai-ng/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// const { app, BrowserWindow } = require('electron')
// const url = require('url');
// const path = require('path');   
	
// // function onReady () {     
// // 	win = new BrowserWindow({width: 1080, height: 960})    
// // 	win.loadURL(url.format({      
// // 		pathname: path.join(
// // 			__dirname,
// // 			'/src/index.html'),       
// // 		protocol: 'file:',      
// // 		slashes: true     
// // 	}))   
// // } 

// // app.on('ready', onReady);

// let win;

// function createWindow () {

//     win = new BrowserWindow({
//         width: 1920,
//         height: 1080,
//         backgroundColor: '#f2f6gf',
//         icon: `file://$${__dirname}/src/assets/logo_whiteBackground.png`


//     })

//     win.loadURL(`file://${__dirname}/src/index.html`)

//     // win.webContents.openDevTools()

//     win.on('closed', function() {
//         win = null
//     })
// }

// app.on('ready', createWindow)

// app.on('window-all-closed', function() {

//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// })

// app.on('activate', function () {

//     if (win == null) {
//         createWindow()
//     }
// })