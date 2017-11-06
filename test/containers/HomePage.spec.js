import { spy } from 'sinon'
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { ConnectedRouter } from 'react-router-redux'
import HomePage from '../../app/containers/HomePage'
import Home from '../../app/components/Home'
import { configureStore } from '../../app/store/configureStore'

function setup(initialState) {
  const store = configureStore(initialState)
  const history = createBrowserHistory()
  const actions = {
    handleFetch: spy(),
  }
  const app = mount(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <HomePage />
      </ConnectedRouter>
    </Provider>
  )
  return {
    actions,
    app,
    downloadButton: app.find('#download-button'),
    urlInput: app.find('#url-input'),
  }
}

describe('containers', () => {
  describe('App', () => {

    it('mounts', () => {
      const { app } = setup()
      expect(app.length).toBe(1)
    })

    it('contains <Home/> component', () => {
      const { app } = setup()
      expect(app.find(Home).length).toBe(1)
    })

    it('renders url input', () => {
      const { urlInput } = setup()
      expect(urlInput.length).toBe(1)
    })

    it('renders download button', () => {
      const { downloadButton } = setup()
      expect(downloadButton.length).toBe(1)
    })

  })
})

