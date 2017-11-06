import React, { Component, PropTypes } from 'react'
import WebView from 'react-electron-web-view'
import { connect } from 'react-redux'
import { remote } from 'electron'

// Actions
import {
  setBandcampWebviewNode,
  initialiseBandcampWebview,
  setBandcampWebviewSrc,
  downloadBandcampTracks,
} from '../actions/bandcamp'

// Styles
import styles from './Home.css'

class Home extends Component {

  state = {
    url: '',
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    const webviewNode = document.querySelector('webview') || null
    dispatch(setBandcampWebviewNode(webviewNode))
    dispatch(initialiseBandcampWebview())
  }

  handleFetch = () => {
    const { dispatch } = this.props
    const { url } = this.state
    dispatch(setBandcampWebviewSrc(url))
  }

  handleDownload = () => this.props.dispatch(downloadBandcampTracks())

  render() {

    const { bandcamp } = this.props

    // Determine UI message state
    const messageIsDisplayed = bandcamp.error ||
      bandcamp.awaitingBandcampData ||
      bandcamp.message ||
      bandcamp.downloadInProgress ||
      bandcamp.downloadSuccess

    let messageClassName = `pt-callout ${styles.message}`
    let messageTitle = null
    let messageContent = null

    if (bandcamp.error) {
      messageTitle = 'Error'
      messageContent = bandcamp.error
      messageClassName += ' pt-intent-warning pt-icon-error'

    } else if (bandcamp.awaitingBandcampData) {
      messageTitle = 'Contacting Bandcamp'
      messageContent = 'Please wait...'
      messageClassName += ' pt-icon-exchange'

    } else if (bandcamp.message) {
      messageTitle = 'Heads up'
      messageContent = bandcamp.message
      messageClassName += ' pt-icon-issue-new'

    } else if (bandcamp.downloadInProgress) {
      messageTitle = 'Downloading'
      messageContent = `In progress - ${bandcamp.currentlyDownloading}`
      messageClassName += ' pt-icon-download'

    } else if (bandcamp.downloadSuccess) {
      messageTitle = 'Success'
      messageContent = `Your tracks have been downloaded to: ${remote.app.getPath('downloads')}`
      messageClassName += ' pt-icon-saved'
    }

    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h1>Music Rocket</h1>
          <WebView
            className={styles.webview}
            src={bandcamp.bandcampWebviewSrc || ''}
            preload="utils/bandcamp/bandcampWebviewInjection.js"
          />
          <div>
            <input
              type="text"
              className={`pt-input pt-large ${styles.input}`}
              placeholder="Enter a url"
              value={this.state.url}
              onChange={e => this.setState({ url: e.target.value })}
              id="url-input"
            />
            <button
              onClick={this.handleFetch}
              className={`pt-button pt-large ${styles.button}`}
              id="download-button"
            >
              Download
            </button>
            {messageIsDisplayed ?
              <div className={messageClassName}>
                <h5>{messageTitle}:</h5>
                {messageContent}
                {bandcamp.manualAction === 'DOWNLOAD' &&
                  <div>
                    <button
                      onClick={this.handleDownload}
                      className="pt-button pt-small"
                    >
                      Download anyway
                    </button>
                  </div>
                }
              </div>
              :
              <div className={styles.messagePlaceholder} />
            }
          </div>
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  bandcamp: PropTypes.object.isRequired,
}

export default connect(state => ({
  bandcamp: state.bandcamp,
}))(Home)
