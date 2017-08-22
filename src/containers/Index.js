import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon } from 'antd';
import { stdRequest } from '../actions'

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

class Index extends Component {

    componentDidMount() {
        this.props.stdRequest({
            url: '/api/getData',
            args: {}
        });
    }

    render() {
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                            <Menu.Item key="1">option1</Menu.Item>
                            <Menu.Item key="2">option2</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                            <Menu.Item key="5">option5</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
                            <Menu.Item key="9">option9</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        Content: {this.props.stdRequest}
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

function mapStateToProps(state) {
    const { userInfo } = state
    const {
        pagination: { stdRequest }
    } = state

    return {
        userId: 'Admin',
        userInfo,
        stdRequest
    }
}

const mapDispatchToProps = {
    stdRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
