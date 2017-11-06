import {
  SET_BANDCAMP_WEBVIEW_NODE,
  INITIALISE_BANDCAMP_WEBVIEW,
  SET_BANDCAMP_WEBVIEW_SRC_SUCCESS,
  SET_BANDCAMP_WEBVIEW_SRC_FAIL,
  RECEIVE_BANDCAMP_DATA,
  DOWNLOAD_BANDCAMP_TRACKS_START,
  DOWNLOAD_BANDCAMP_TRACKS_SET_CURRENT_DOWNLOAD,
  DOWNLOAD_BANDCAMP_TRACKS_SUCCESS,
  DOWNLOAD_BANDCAMP_TRACKS_FAIL,
  SET_MESSAGE,
  SET_ERROR,
} from '../actions/bandcamp'

const initialState = {
  bandcampWebviewNode: null,
  bandcampWebviewInitialised: false,
  bandcampWebviewSrc: null,
  awaitingBandcampData: false,
  albumData: {},
  downloadInProgress: false,
  currentlyDownloading: null,
  downloadSuccess: false,
  downloadFail: false,
  manualAction: null,
  message: null,
  error: null,
}

export default function bandcamp(state = initialState, action) {
  switch (action.type) {
    case SET_BANDCAMP_WEBVIEW_NODE:
      return Object.assign({}, state, {
        bandcampWebviewNode: action.bandcampWebviewNode,
      })
    case INITIALISE_BANDCAMP_WEBVIEW:
      return Object.assign({}, state, {
        bandcampWebviewInitialised: action.success,
      })
    case SET_BANDCAMP_WEBVIEW_SRC_SUCCESS:
      return Object.assign({}, state, {
        bandcampWebviewSrc: action.bandcampWebviewSrc,
        awaitingBandcampData: true,
      })
    case SET_BANDCAMP_WEBVIEW_SRC_FAIL:
      return Object.assign({}, state, {
        error: action.error,
      })
    case RECEIVE_BANDCAMP_DATA:
      return Object.assign({}, state, {
        albumData: action.albumData,
        awaitingBandcampData: false,
      })
    case SET_MESSAGE:
      return Object.assign({}, state, {
        message: action.content,
        manualAction: action.manualAction,
      })
    case SET_ERROR:
      return Object.assign({}, state, {
        error: action.content,
      })
    case DOWNLOAD_BANDCAMP_TRACKS_START:
      return Object.assign({}, state, {
        downloadInProgress: true,
        message: null,
        manualAction: null,
      })
    case DOWNLOAD_BANDCAMP_TRACKS_SET_CURRENT_DOWNLOAD:
      return Object.assign({}, state, {
        currentlyDownloading: action.name,
      })
    case DOWNLOAD_BANDCAMP_TRACKS_SUCCESS:
      return Object.assign({}, state, {
        downloadInProgress: false,
        downloadSuccess: true,
      })
    case DOWNLOAD_BANDCAMP_TRACKS_FAIL:
      return Object.assign({}, state, {
        downloadInProgress: false,
        downloadSuccess: false,
        downloadFail: true,
        error: action.error,
      })
    default:
      return state
  }
}
