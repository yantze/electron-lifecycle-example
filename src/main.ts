import { app, BrowserWindow, Event, ipcMain, Session, WebContents, IpcMainEvent } from 'electron';
import * as path from 'path';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    // show: false,
    webPreferences: {
      // contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('close', (event: Event) => {
    // will abort window close.
    // event.preventDefault();
    log(`==> window-event: close <===`)
  })

  mainWindow.on('closed', () => {
    log(`==> window-event: closed <===`)
  })

  mainWindow.on('ready-to-show', () => {
    log(`==> window-event: ready-to-show <===`)
  })
}

function log(...args: any[]) {
  console.log(...args)
  // const path = require('path')
  // const os = require('os')
  // const fs = require('fs')
  // fs.writeFileSync(path.resolve(os.homedir(), 'e.log'), `${JSON.stringify(args)}\n`, { flag: 'w+' })
}

// for electron-test://abc?query1=value1
app.setAsDefaultProtocolClient('electron-test')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  log(`==> app-event: ready0 <===`)
  createWindow();

  app.on('activate', (event: Event, hasVisibleWindows: boolean) => {
    log(`==> app-event: activate <===`)

    if (hasVisibleWindows) {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      createWindow();
    }
  })
});

app.on('ready', (event: Event, launchInfo: Record<string, any>) => {
  log(`==> app-event: ready1 <===`)
  log('launchInfo:', launchInfo)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  log(`==> app-event: window-all-closed <===`)

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-finish-launching', (event: Event) => {
  log(`==> app-event: will-finish-launching <===`)

  app.on('open-file', (event: Event, path: string) => {
    event.preventDefault()
    log(`==> app-event: open-file <===`, path)
  })

  app.on('open-url', (event: Event, url: string) => {
    log(`==> app-event: open-url <===`, url)
  })
})

app.on('before-quit', (event: Event) => {
  log(`==> app-event: before-quit <===`)
  // event.preventDefault();
})

app.on('will-quit', (event: Event) => {
  log(`==> app-event: will-quit <===`)
  // event.preventDefault();
})

app.on('quit', (event: Event, exitCode: number) => {
  log(`==> app-event: quit ${exitCode} <===`)
})

app.on('did-become-active', (event: Event) => {
  log(`==> app-event: did-become-active <===`)
})

app.on('browser-window-created', (event: Event, window: BrowserWindow) => {
  log(`==> app-event: browser-window-created <===`)
})

app.on('web-contents-created', (event: Event, webContents: WebContents) => {
  log(`==> app-event: web-contents-created <===`)
})

app.on('browser-window-focus', (event: Event, window: BrowserWindow) => {
  // log(`==> app-event: browser-window-focus <===`)
})

app.on('session-created', (session: Session) => {
  log(`==> app-event: session-created <===`)
})

app.on('second-instance', (event: Event, argv: string[], workingDirectory: string) => {
  log(`==> app-event: second-instance <===`)
})

ipcMain.on('logger-event', (event: IpcMainEvent, ...args) => {
  // Renderer Logger:
  log(`==> html-event: ${args[0]} <===`)
  if (args.length > 1) {
    log(...args.slice(1))
  }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
log(`current process: ${process.pid}`)
