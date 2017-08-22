import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import merge from 'lodash/merge'
import * as actions from '../actions'
import paginate from './paginate'

// Updates an entity cache in response to any action with response.entities.
// state must have default data
const entities = (state = {}, action) => {
    if (action.response && action.response.entities) {
        return merge({}, state, action.response.entities)
    }
    return state
}

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
    const { type, error } = action

    if (type === actions.RESET_ERROR_MESSAGE) {
        return null
    } else if (error) {
        return error
    }

    return state
}

// Updates the pagination data for different actions.
const pagination = combineReducers({
    stdRequest: paginate({
        mapActionToKey: action => action.options.url, // 指定store中的key
        types: [
            actions.STANDARD['REQUEST'],
            actions.STANDARD['SUCCESS'],
            actions.STANDARD['FAILURE']
        ]
    })
})

const rootReducer = combineReducers({
    entities,
    errorMessage,
    pagination,
    routerReducer
})

export default rootReducer
