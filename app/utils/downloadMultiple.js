import { remote } from 'electron'
import fs from 'fs'
import request from 'request'
import { setBandcampCurrentDownload } from '../actions/bandcamp'

const downloadDir = remote ? remote.app.getPath('downloads') : null

export default function downloadMultiple(arrayOfTracks, dispatch) {

  // Check against input type
  if (!Array.isArray(arrayOfTracks)) {
    return Promise.reject(new Error('Download function expects an array input.'))
  }

  // Check against empty array
  if (arrayOfTracks.length < 1) {
    return Promise.reject(new Error('No tracks provided to download.'))
  }

  // Ensure artist is provided
  if (!arrayOfTracks[0].artist) {
    return Promise.reject(new Error('Artist not provided.'))
  }

  // Create output dir
  const outputDir = `${downloadDir}/${arrayOfTracks[0].artist}`
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

  // Parallel version
  // const downloadQueue = arrayOfTracks.map(track =>
  //   new Promise((resolve, reject) => {
  //     dispatch(setBandcampCurrentDownload(track.title))
  //     request
  //       .get(track.url)
  //       .on('end', () => resolve())
  //       .on('error', error => reject(error))
  //       .pipe(fs.createWriteStream(`${outputDir}/${track.title}.mp3`))
  //   })
  // )
  // return Promise.all(downloadQueue)

  // Sequential version
  async function processDownloadQueueSequentially(queue) {
    for (const track of queue) { // eslint-disable-line
      dispatch(setBandcampCurrentDownload(track.title))
      await new Promise((resolve, reject) => { // eslint-disable-line no-await-in-loop
        request
          .get(track.url)
          .on('end', () => resolve())
          .on('error', error => reject(error))
          .pipe(fs.createWriteStream(`${outputDir}/${track.title}.mp3`))
      })
    }
  }

  return processDownloadQueueSequentially(arrayOfTracks)

}
