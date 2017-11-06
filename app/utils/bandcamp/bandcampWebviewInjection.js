/*
  This is a simple preload injection script that will
  add an eventlistener to the ipcRenderer for Bandcamp pages.
  This listener will respond to 'requestTrackData' by sending
  an object on the window scope, TralbumData.
*/

const { ipcRenderer } = require('electron')

ipcRenderer.on('requestTrackData', () => {
  ipcRenderer.sendToHost(window.TralbumData)
})
