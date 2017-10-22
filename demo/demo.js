import React from "react"
import ReactDom from "react-dom"


var originCreateElement = document.createElement;
document.createElement = function() {
    if (arguments[0] === 'span'){
        console.log('create span');
    }
   return originCreateElement.apply(document, arguments);
}

class HelloWorld extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message: "hello, world"
        }
    }

    componentWillMount(){
        console.log("component will mount");
    }

    componentWillUpdate(){
        console.log("component will update");
    }

    componentDidUpdate(){
        console.log("component did update");
    }

    componentDidMount(){
        console.log("componentDidMount");
    }

    render(){
        return <span className={this.state.message}>
            {this.state.message}
        </span>;
    }
}

ReactDom.render(<HelloWorld/>, document.getElementById('root'));