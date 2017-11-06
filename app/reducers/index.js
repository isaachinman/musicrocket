import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import bandcamp from './bandcamp'

const rootReducer = combineReducers({
  bandcamp,
  router,
})

export default rootReducer
