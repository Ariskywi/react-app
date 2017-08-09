import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import rootReducer from '../reducers'

import { routerMiddleware } from 'react-router-redux'
import { HashHistory } from '../router/history'

const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(HashHistory)
const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware, routeMiddleware)
  )

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}

export default configureStore
