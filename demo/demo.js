import React , { Component }from 'react';
import ReactDOM from 'react-dom';
import ReactDOMFiberEntry from 'react-dom';
import '../assets/css/main.css';

//fiber,return 处理数组、字符数、数字
// class BlockList extends Component {
//     constructor(props){
//         super(props)
//     }
//     render(){
//         let numberOfBlock = this.props.numberOfBlock;
//         let displayNumber = this.props.displayNumber;
//         let divList = [];
//
//         for(let i=0,j=displayNumber;i<numberOfBlock;i++){
//             divList.push(<div key={i}>{j}</div>)
//         }
//         return (
//             <div className="divList">{divList}</div>
//         )
//     }
// }
//
// const NUMBER_OF_BLOCK = 100000;
//
// class ReactExample extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             timeOfButtonClicked:0
//         }
//     }
//     addTimesOfButtonClicked(){
//         const {timeOfButtonClicked} = this.state;
//         ReactDOMFiberEntry.unstable_deferredUpdates(() =>
//             this.setState({
//                 timeOfButtonClicked: timeOfButtonClicked + 1
//             })
//         );
//
//     }
//     render(){
//         // return [
//         //        <input type="text"/>,
//         //        <button onClick={this.addTimesOfButtonClicked.bind(this)}>
//         //            Click me
//         //        </button>,
//         //        <BlockList
//         //             displayNumber = {this.state.timeOfButtonClicked}
//         //             numberOfBlock = {NUMBER_OF_BLOCK}/>
//         // ]
//         return (
//             <div>
//                 <input type="text"/>
//                 <button onClick={this.addTimesOfButtonClicked.bind(this)}>
//                     Click me
//                 </button>
//                 <BlockList
//                     displayNumber = {this.state.timeOfButtonClicked}
//                     numberOfBlock = {NUMBER_OF_BLOCK}/>
//             </div>
//         )
//     }
// }
//
//
// ReactDOMFiberEntry.render(
//     <ReactExample />,
//     document.getElementById('root')
// );

//异常错误处理例子
class MyGoodView extends Component{
    render() {
        return <p data-id="123">Cool</p>;           //支持自定义DOM属性
    }
}

class MyBadView extends Component{
    render() {
        throw new Error('crap');
    }
}

try {
// 希望抛出错误
    ReactDOM.render(<MyBadView/>, document.body);
} catch (e) {
 //在之前，如上代码是无法执行到降级处理的，而在 V16中会允许降级处理，
    // 并且为我们提供完整可读的组件堆栈异常信息，这样我们就可以对渲染异常的错误进行捕获监控
    ReactDOM.render(<MyGoodView/>, document.body);
}

// class Model extends Component {
//     render() {
//         // React 会在你提供的 domNode 下渲染，而不是在当前组件所在的 DOM
//         return ReactDOM.createPortal(
//             <div>测试</div>,
//             document.body,
//         );
//     }
// }
// ReactDOM.render(<Model/>, document.getElementById('root'));
