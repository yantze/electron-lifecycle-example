// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
import { ipcRenderer } from 'electron'

function log(...args: any[]) {
  console.log(...args)
  ipcRenderer.send('logger-event', ...args)
}

function handler(event: Event) {
  log(event.type)
}

window.onload = handler
window.onunload = handler
window.onbeforeunload = (event: Event) => {
  handler(event)
  // event.returnValue = true
}

document.addEventListener('DOMContentLoaded', handler)

document.addEventListener('visibilitychange', (event: Event) => {
  log('visibilitychange', document.visibilityState)
})