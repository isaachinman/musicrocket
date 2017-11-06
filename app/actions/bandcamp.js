import downloadMultiple from '../utils/downloadMultiple'
import validateBandcampUrl from '../utils/bandcamp/validateBandcampUrl'
import validateBandcampData from '../utils/bandcamp/validateBandcampData'

// Initialise reference to webview node
export const SET_BANDCAMP_WEBVIEW_NODE = 'musicrocket/SET_BANDCAMP_WEBVIEW_NODE'

// Set up ipc event listeners on webview
export const INITIALISE_BANDCAMP_WEBVIEW = 'musicrocket/INITIALISE_BANDCAMP_WEBVIEW'

// Set url for webview
export const SET_BANDCAMP_WEBVIEW_SRC_START = 'musicrocket/SET_BANDCAMP_WEBVIEW_SRC_START'
export const SET_BANDCAMP_WEBVIEW_SRC_SUCCESS = 'musicrocket/SET_BANDCAMP_WEBVIEW_SRC_SUCCESS'
export const SET_BANDCAMP_WEBVIEW_SRC_FAIL = 'musicrocket/SET_BANDCAMP_WEBVIEW_SRC_FAIL'

// Receive ipc message as action
export const RECEIVE_BANDCAMP_DATA = 'musicrocket/RECEIVE_BANDCAMP_DATA'

// Set a feedback message
export const SET_MESSAGE = 'musicrocket/SET_MESSAGE'
export const SET_ERROR = 'musicrocket/SET_ERROR'

// Download array of tracks
export const DOWNLOAD_BANDCAMP_TRACKS_START = 'musicrocket/DOWNLOAD_BANDCAMP_TRACKS_START'
export const DOWNLOAD_BANDCAMP_TRACKS_SET_CURRENT_DOWNLOAD = 'musicrocket/DOWNLOAD_BANDCAMP_TRACKS_SET_CURRENT_DOWNLOAD'
export const DOWNLOAD_BANDCAMP_TRACKS_SUCCESS = 'musicrocket/DOWNLOAD_BANDCAMP_TRACKS_SUCCESS'
export const DOWNLOAD_BANDCAMP_TRACKS_FAIL = 'musicrocket/DOWNLOAD_BANDCAMP_TRACKS_FAIL'

export const setBandcampWebviewNode = bandcampWebviewNode => ({
  type: SET_BANDCAMP_WEBVIEW_NODE,
  bandcampWebviewNode,
})

export const initialiseBandcampWebview = () =>
  (dispatch, getState) => {
    const webviewNode = getState().bandcamp.bandcampWebviewNode

    if (webviewNode) {
      // Add IPC return
      webviewNode.addEventListener('ipc-message', event => {
        dispatch(receiveBandcampData(event.channel))
      })
      // Add requestTrackData event on page load
      webviewNode.addEventListener('did-stop-loading', () => {
        webviewNode.send('requestTrackData')
      })
      dispatch({
        type: INITIALISE_BANDCAMP_WEBVIEW,
        success: true,
      })
    } else {
      dispatch({
        type: INITIALISE_BANDCAMP_WEBVIEW,
        success: false,
      })
    }
  }

export const setBandcampWebviewSrc = bandcampWebviewSrc =>
  dispatch => {

    // First dispatch start action
    dispatch({ type: SET_BANDCAMP_WEBVIEW_SRC_START })

    validateBandcampUrl(bandcampWebviewSrc)
      .then(() => dispatch({
        type: SET_BANDCAMP_WEBVIEW_SRC_SUCCESS,
        bandcampWebviewSrc,
      }))
      .catch(error => dispatch({
        type: SET_BANDCAMP_WEBVIEW_SRC_FAIL,
        error,
      }))
  }

export const receiveBandcampData = albumData =>
  dispatch => {

    // First dispatch received action
    dispatch({ type: RECEIVE_BANDCAMP_DATA, albumData })

    validateBandcampData(albumData)
      .then(() => dispatch(downloadBandcampTracks()))
      .catch(options => dispatch({
        type: `musicrocket/SET_${options.feedbackType}`,
        content: options.content,
        manualAction: options.manualAction || null,
      }))
  }

// Async action creator
export const downloadBandcampTracks = () =>
  async (dispatch, getState) => {

    // First dispatch start action
    dispatch({ type: DOWNLOAD_BANDCAMP_TRACKS_START })

    const albumData = getState().bandcamp.albumData
    const tracks = albumData.trackinfo
    const tracksAvailableToDownload = tracks.filter(track =>
      track.file && track.file['mp3-128']
    )

    if (tracksAvailableToDownload.length > 0) {

      // Process tracks
      const cleanedTrackData = tracksAvailableToDownload.map(track => ({
        url: track.file['mp3-128'],
        title: track.title,
        artist: albumData.artist,
      }))

      // Start download process
      downloadMultiple(cleanedTrackData, dispatch)
        .then(() => dispatch({ type: DOWNLOAD_BANDCAMP_TRACKS_SUCCESS }))
        .catch(error => dispatch({ type: DOWNLOAD_BANDCAMP_TRACKS_FAIL, error }))

    } else {

      dispatch({
        type: DOWNLOAD_BANDCAMP_TRACKS_FAIL,
        error: 'No tracks are available to download.',
      })

    }
  }

export const setBandcampCurrentDownload = name => ({
  type: DOWNLOAD_BANDCAMP_TRACKS_SET_CURRENT_DOWNLOAD,
  name,
})

