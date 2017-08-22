import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

import App from '../containers/App'
import DevTools from './DevTools'

const Root = ({ store, history }) => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <App />
                <DevTools />
            </div>
        </ConnectedRouter>
    </Provider>
)

export default Root
