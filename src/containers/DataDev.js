import React, { Component } from 'react'
import { connect } from 'react-redux'

class DataDev extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div>数据开发</div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    location: state.location
})

const mapDispatchToProps = {
    // navigate
}

export default connect(mapStateToProps, mapDispatchToProps)(DataDev)
