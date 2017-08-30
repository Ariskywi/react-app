import React from 'react';
import ReactDOM from 'react-dom';

// var HelloMessage = React.createClass({
//     render: function () {
//         return <div>hello {this.props.name}</div>;
//     }
// })
// ReactDOM.render(
//     <HelloMessage name="huangXiaoRan"/>,
//     document.getElementById('root')
// );
var NodesList = React.createClass({
    render:function () {
        return (
        <ol>
            {
                React.Children.map(this.props.children,function(child){
                    return <li>{child}</li>
                })
            }
        </ol>)
    }
})
var MyTitle = React.createClass({
    propTypes:{
        title:React.PropTypes.string.isRequired,
    },
    getDefaultProps:function () {
        return {
            title:"244"
        }
    },
    render:function () {
        return <h1>{this.props.title}</h1>
    }
})
// var data = 123;
// ReactDOM.render(
//     <MyTitle />,
//     document.getElementById("root")
// );
var MyComponent = React.createClass({
    onHandlerButton:function () {
        this.refs.myText.focus();
    },
    render:function () {
        return (
            <div>
                <input type="text" ref="myText"/>
                <input type="button" value="聚焦" onClick={this.onHandlerButton}/>
            </div>
        )
    }
})
// ReactDOM.render(
//     <MyComponent />,
//     document.getElementById("root")
// );

var LikeButton = React.createClass({
    getInitialState:function () {
        return {liked:false}
    },
    handlerClick:function () {
        this.setState({liked:!this.state.liked})
    },
    render:function () {
        var text = this.state.liked?'like':'haven\'t liked';
        return (
            <p onClick={this.handlerClick}>
                your {text} this,Click to toggle;
            </p>
        )
    }
})
// ReactDOM.render(
//     <LikeButton />,
//     document.getElementById("root")
// );

var Input = React.createClass({
    getInitialState:function () {
        return {
            value:'Hello'
        }
    },
    handlerChange:function (event) {
        console.log(event)
        this.setState({value:event.target.value});
    },
    render:function () {
        var value = this.state.value;
        return (
            <div>
                <input type="text" value={value} onChange={this.handlerChange}/>
                <p>{value}</p>
            </div>
        )
    }
})
// ReactDOM.render(
//      <Input />,
//      document.getElementById("root")
// );
var Hello = React.createClass({
    getInitialState:function () {
        return {
            opacity:1.0
        }
    },
    componentDidMount:function () {
        this.timer = setInterval(function(){
            let opacity = this.state.opacity;
            opacity -=0.05;
            if(opacity<0.1){
                opacity = 1.0;
            }
            this.setState({
                opacity:opacity
            })
        }.bind(this),1000)
    },
    render:function () {
        return(
            <div style={{opacity:this.state.opacity}}>
                Hello {this.props.name}
            </div>
        )
    }
})
// ReactDOM.render(
//     <Hello name="world" />,
//     document.getElementById("root")
// );
var UserGist = React.createClass({
    getInitialState:function () {
        return {
            username:'',
            lastGistUrl:''
        }
    },
    componentDidMount:function () {
        jQuery.get(this.props.source,function (result) {
            var lastGist = result[0];
            if(this.isMounted()){
                this.setState({
                    username: lastGist.owner.login,
                    lastGistUrl: lastGist.html_url
                })
            }
        }.bind(this))
    },
    render:function () {
        return (
            <div>
                {this.state.username}'s last Gist is
                <a href={this.state.lastGistUrl}>here</a>
            </div>
        )
    }
})
// ReactDOM.render(
//     <UserGist source="https://api.github.com/users/octocat/gists" />,
//     document.getElementById("root")
// );
var RepoList = React.createClass({
    getInitialState:function () {
        return {
            loading:true,error:null,data:null
        }
    },
    componentDidMount() {
        this.props.promise.then(
            value => this.setState({loading: false, data: value}),
            error => this.setState({loading: false, error: error}));
    },
    render:function () {
        if(this.state.loading){
            <span>Loading...</span>
        }else if(this.state.error !=null){
            return <span>Error:{this.state.error.message}</span>
        }else {
            var repos = this.state.data.items;
            var repoList = repos.map(function (repo) {
                return (
                    <li>
                        <a href={repo.html_url}>{repo.name}</a> ({repo.stargazers_count} stars) <br/> {repo.description}
                    </li>
                );
            })
            return (
                <main>
                    <h1>Most Popular JavaScript Projects in Github</h1>
                    <ol>{repoList}</ol>
                </main>
            )
        }
    }
})
// ReactDOM.render(
//     <RepoList
//         promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars')}
//     />,
//     document.getElementById("root")
// );
function timeout(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve,ms,1,2,3);
    })
}
timeout(100).then(function (value) {
    console.log([value]);
})

function loadImageUrl(url) {
    return new Promise(function (resolve,reject) {
        var image = new Image();

        image.onload = function () {
            resolve(image);
        }
        image.onerror = function () {
            reject(new Error('Could not load image at ' + url))
        }
        image.src = url;
    })
}

var getJson = function (url) {
    var promise =  new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET",url);
        xhr.onreadystatechange = handler;
        xhr.responseTypes = "json";
        xhr.setRequestHeader("Accept","application/json");
        xhr.send();
        
        function handler() {
            if(this.readyState !=4){
                return;
            }
            if(this.readyState == 200){
                resolve(this.response);
            }else{
                reject(new Error(this.statusText));
            }
        }
    })
    return promise;
}
// getJson("/get.json").then(function (json) {
//
// })

var promise = new Promise(function(resolve, reject) {
    throw new Error('It is test');
});
promise.catch(function(error) {
    console.log(error);
});
function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}

var hw = helloWorldGenerator();
console.log(hw.next())
console.log(hw.next())

console.log(hw.next())
console.log(hw.next())

class Welcome extends React.Component {
    render(){
        return <h1>{this.props.name}</h1>
    }
}
// const element = <Welcome name="Sara"/>
function App() {
    return(
        <div>
            <Welcome name="S"/>
            <Welcome name="A"/>
            <Welcome name="B"/>
        </div>
    )
}
// ReactDOM.render(
//     <App></App>,
//     document.getElementById('root')
// );
class Toggle extends React.Component {
    constructor(props){
        super(props)
        this.state = {isToggleOn: true};
        this.handlerClick = this.handlerClick.bind(this);
    }
    handlerClick(){
        this.setState(prevState=>({
            isToggleOn:!prevState.isToggleOn
        }))
    }
    render(){
        return(
            <button onClick={this.handlerClick}>
                {this.state.isToggleOn ? 'ON' : 'OFF'}
            </button>
        )
    }
}
// ReactDOM.render(
//     <Toggle></Toggle>,
//     document.getElementById('root')
// );

function UserGreeting(props) {
    return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
    return <h1>Please sign up.</h1>;
}
function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <UserGreeting />;
    }
    return <GuestGreeting />;
}
function LoginButton(props) {
    return (
        <button onClick={props.onClick}>
            Login
        </button>
    );
}

function LogoutButton(props) {
    return (
        <button onClick={props.onClick}>
            Logout
        </button>
    );
}
class LoginControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.state = {isLoggedIn: false};
    }

    handleLoginClick() {
        this.setState({isLoggedIn: true});
    }

    handleLogoutClick() {
        this.setState({isLoggedIn: false});
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;

        let button = null;
        if (isLoggedIn) {
            button = <LogoutButton onClick={this.handleLogoutClick} />;
        } else {
            button = <LoginButton onClick={this.handleLoginClick} />;
        }

        return (
            <div>
                <Greeting isLoggedIn={isLoggedIn} />
                {button}
            </div>
        );
    }
}

// ReactDOM.render(
//     <LoginControl />,
//     document.getElementById('root')
// );

function MainBox(props) {
    const unReadMessage = props.message;
    return(
        <div>
            <h1>Hello</h1>
            {
                unReadMessage.length>0 &&
                <h2>
                    you have {unReadMessage.length} unread;
                </h2>
            }
        </div>
    )
}
const messages = ["jhuang","xiao","ran"];
// ReactDOM.render(
//     <MainBox message={messages}/>,
//     document.getElementById('root')
// );
class FlavorForm extends React.Component{
    constructor(props){
        super(props);
        this.state={value:'2'};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        this.setState({value:event.target.value})
        console.log(event.target.type)
    }
    handleSubmit(event){
        event.preventDefault();
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <select value={this.state.value} onChange={this.handleChange}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <input type="checkbox"/>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}
ReactDOM.render(
    <FlavorForm />,
    document.getElementById('root')
);
