import React from 'react'
import { Switch, Route } from 'react-router'
import { HashRouter, Redirect } from 'react-router-dom'
import Bundle from '../components/widget/LazyLoading'
import Index from '../containers/Index'

const DataManage = (props) => (
    <Bundle load={() => import(/* webpackChunkName: "DataManage" */ '../containers/DataManage')}>
        { (DataManage) => DataManage ? <DataManage {...props} /> : null }
    </Bundle> )

const DataDev = (props) => (
    <Bundle load={() => import(/* webpackChunkName: "DataDev" */ '../containers/DataDev')}>
        { (DataDev) => DataDev ? <DataDev {...props} /> : null }
    </Bundle> )

const NoMatch = ({ location }) => (
    <div>
        <h3>没有找到您需要的页面 <code>{location.pathname}</code></h3>
    </div>
)

const MainRoutes = (
    <HashRouter>
        <Switch>
            <Route exact path="/" render={() => (
                <Redirect to="/index" />
            )}/>
            <Route path="/index" component={Index} />
            <Route path="/dataManage" component={DataManage} />
            <Route path="/dataDev" component={DataDev}/>
            <Route component={NoMatch}/>
        </Switch>
    </HashRouter>
)

export default MainRoutes
