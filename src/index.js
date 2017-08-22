import React from 'react'
import { render } from 'react-dom'
import { HashHistory } from './router/history'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import rootSaga from './sagas'

import '../assets/css/main.css'

const store = configureStore();
store.runSaga(rootSaga);

if (process.env.NODE_ENV === 'production') {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
    }
}

render(
    <Root store={store} history={HashHistory} />,
    document.getElementById('root')
)
