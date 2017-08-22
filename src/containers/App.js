import React, { Component } from 'react'
import { connect } from 'react-redux'
import MainRoutes from '../router/routes'
import Nav from '../components/widget/Nav'
import {HashHistory} from '../router/history'

class App extends Component {

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {

    }

    handleChange(menuKey) {
        HashHistory.push(`/${menuKey}`)
    }

    render() {
        return (
            <div id="App">
                <Nav onChange = {this.handleChange} />
                { MainRoutes }
            </div>
        )
    }
}

export default connect()(App)
