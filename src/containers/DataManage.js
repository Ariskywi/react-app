import React, { Component } from 'react'
import { connect } from 'react-redux'

class DataManage extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div>数据管理页面</div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    location: state.routerReducer.location
})

const mapDispatchToProps = {
    // navigate
}

export default connect(mapStateToProps, mapDispatchToProps)(DataManage)
