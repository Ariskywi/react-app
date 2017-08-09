const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

export const STANDARD_FETCH = 'STANDARD_FETCH'
export const STANDARD_ASYNC = 'STANDARD_ASYNC'
export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

function action(type, payload = {}) {
  return {type, ...payload}
}

function createRequestTypes(base) {
    return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
        acc[type] = `${base}_${type}`
        return acc
    }, {})
}

export const STANDARD = createRequestTypes('STANDARD')

export const fetchStd = {
    request: (options)           => action(STANDARD[REQUEST], {options}),
    success: (options, response) => action(STANDARD[SUCCESS], {options, response}),
    failure: (options, error)    => action(STANDARD[FAILURE], {options, error}),
}

// action creater
export const resetErrorMessage = ()         => action(RESET_ERROR_MESSAGE)
export const stdRequest       = (options)  => action(STANDARD_FETCH, { options })
