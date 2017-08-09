import React, { Component } from 'react'
import { connect } from 'react-redux'
import { resetErrorMessage } from '../../actions'
import { Menu, Icon } from 'antd';

const { SubMenu, ItemGroup } = Menu;

class Nav extends Component {

  state = {
    current: null
  }

  componentWillMount() {
    this.setState({
      current: this.props.location !== null ? this.props.location.pathname.substring(1) : 'index',
    });
  }

  menuChange = (e) => {
    const menuKey = e.key;
    this.setState({
      current: menuKey,
    });
    this.props.onChange(menuKey);
  }

  render() {
    return (
      <Menu
        onClick={this.menuChange}
        selectedKeys={[this.state.current]}
        defaultSelectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.Item key="index">
          <Icon type="appstore" />首页
        </Menu.Item>
        <Menu.Item key="dataManage">
          <Icon type="mail" />数据管理
        </Menu.Item>
        <Menu.Item key="dataDev">
          <Icon type="appstore" />数据开发
        </Menu.Item>
        <SubMenu title={<span><Icon type="setting" />数据查询</span>}>
          <ItemGroup title="Item 1">
            <Menu.Item key="dataQuery:1">Option 1</Menu.Item>
            <Menu.Item key="dataQuery:2">Option 2</Menu.Item>
          </ItemGroup>
          <ItemGroup title="Item 2">
            <Menu.Item key="dataQuery:3">Option 3</Menu.Item>
            <Menu.Item key="dataQuery:4">Option 4</Menu.Item>
          </ItemGroup>
        </SubMenu>
        <Menu.Item key="opsMonitor">
          <Icon type="appstore" />运维监控
        </Menu.Item>
      </Menu>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  errorMessage: state.errorMessage,
  location: state.routerReducer.location
})

const mapDispatchToProps = {
  resetErrorMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)