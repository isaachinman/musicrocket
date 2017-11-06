import validUrl from 'valid-url'

export default function validateBandcampData(albumData) {
  return new Promise((resolve, reject) => {

    // General validation to ensure data is in the shape we expect
    if (typeof albumData.artist !== 'string' || !validUrl.isWebUri(albumData.url) || !Array.isArray(albumData.trackinfo)) {
      reject({
        feedbackType: 'ERROR',
        content: 'Data retrieved from Bandcamp is not in a recognised format',
      })
    }

    // Determine number of downloadable tracks
    const tracks = albumData.trackinfo
    const tracksAvailableToDownload = tracks.filter(track =>
      track.file && track.file['mp3-128']
    )

    // If one or more tracks are not downloadable, trigger UI warning
    if (tracksAvailableToDownload.length !== tracks.length) {
      if (tracksAvailableToDownload.length > 0) {
        reject({
          feedbackType: 'MESSAGE',
          content: `Only ${tracksAvailableToDownload.length} songs are available to download. The artist has set one or more tracks as private.`,
          manualAction: 'DOWNLOAD',
        })
      } else {
        reject({
          feedbackType: 'ERROR',
          content: 'No tracks are available to download. The artist has set all tracks as private.',
        })
      }
    }

    resolve()

  })
}
