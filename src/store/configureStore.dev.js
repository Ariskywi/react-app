import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import rootReducer from '../reducers'
import { routerMiddleware } from 'react-router-redux'
import { HashHistory } from '../router/history'

import DevTools from '../containers/DevTools'

const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(HashHistory)
const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(sagaMiddleware, routeMiddleware),
      DevTools.instrument()
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

    store.runSaga = sagaMiddleware.run
    store.close = () => store.dispatch(END)
    return store
}

export default configureStore
