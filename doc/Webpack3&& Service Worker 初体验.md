# Webpack 3 探坑 与 Service Worker 强缓存应用

>*Aris*


webpack 已经出到了3.4.1版本，我们在项目上使用1.x依然很欢脱。
然鹅紧随时代潮流是前端宝宝们的基本特质之一。在构建新的项目的时候，
我义无反顾的采用了webpack 3。


PS:不知道有多少同学像我一样，在看到新的轮子时候忧喜交加。忧的是
可用来DOTA的时间又少了，喜的是多了一些幸好没有学系列~:)


根据官方的说法，3.0版本其实可以认为是2.x版本，之所以升级大版本号是因为：
>*We marked this as a Major change because of internal breaking changes that could affect some plugins.*


OK,闲言少叙，让我们来看看webpack3都有哪些新特性吧。

##1. **Scope Hoisting-作用域提升**

>One of webpack’s trade-offs when bundling was that each module in your bundle would be wrapped in individual function closures. These wrapper functions made it slower for your JavaScript to execute in the browser.

>*之前版本的 webpack 在打包时的一个妥协是包里面的每个模块都会被包装到一个独立的函数闭包中。
这些包装函数使你在浏览器中执行的 JavaScript 代码变得更慢。*

webpack 3 可以使用插件进行作用域提升。如下：
```javascript
module.exports = {
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
```

So easy ? 我毫不犹豫的开启了，然而：
>ERROR in chunk app [entry]
 dist/js/[name].js
 Cannot get final name for export "put" in "delegated ../node_modules/redux-saga/es/effects.js 
 from dll-reference vendor_224e936b4df1e1e09091" (known exports: true, known reexports: )

第一个坑粗线了。。。
####原因：
这是一个同时使用DllReferencePlugin和ModuleConcatenationPlugin才会出现的错误。
google到了新鲜的[答案](https://github.com/webpack/webpack/issues/5095)。
神马react-router和react-router-dom不能一起引用啊之类的，Too Native!!
这就是一个十分单纯的bug。。
####解决方法：
升级webpack 到3.4.1以上。

好，那么我们来测试一下开启作用域提升前后的速度差异吧。以demo的运行时间来测试，
在chrome测试了几十次，没截图。数据就不贴了，直接说结果：
#####没开启时：
*运行时间在360+ms - 380+ms间波动。大部分集中在370左右。*
#####开启后：
*运行时间在358+ms - 380+ms 间波动。考虑到358ms只有一次，可排除。大部分也在370左右。*

可能是由于我们的demo体量太小，难以体现出差异。由于手头没有复杂项目，也就没有进行测试。
不过由于模块化以及Code Splitting的存在，猜测即便是复杂项目，计算量也是分散在多个模块中的，作用域提升带来的速度优化也应该有限。



##2. **Magic Comment - 魔法注释**

这还得从Code Splitting说起。在1.x时代，require.ensure()给我们带来了便捷的应用体验。
时过境迁，require.ensure()因为不直接支持ES6的模块机制(当然，这可以通过babel等解决)，已经不再推荐使用。
取而代之的则是import()。然而在2.x时代，import()有一个明显的缺陷就是不能为bundle命名。
现在3.x完善了这个功能，就是Magic Comment。
用例如下：
```javascript
import(/* webpackChunkName: "chunk-name" */ 'module');
```

这个特性很简单，就不赘述。

动态加载(懒加载)还需更进一步：import()完成了code splitting，离懒加载还差一步。
如果import()在首屏要执行的代码中，分割的bundle依然会在首屏加载。我们要把import()放在首屏不执行的代码中。
譬如：webpack给的例子是放在点击事件中。而我们以前常用的router函数中。
当然，最简单有效的方式就是这样：
```javascript
const MyBundle = () => import(
    /* webpackChunkName: "chunk-name" */
    /* webpackMode: "lazy-once" */
    './MyBundle')
```
在React应用过程中遇到的麻烦在于：import()的返回值是一个Promise。
react-router需要的是一个函数，此函数的返回值是一个React节点。这就造成了二者不匹配。
于是，问题粗线了：直接像上面这样进行代码分割，会导致错误。
在稳定了几个版本之后，react-router进行了革命性升级。现在以组件形式来组织了。
如何以组件的形式进行代码分割？react-router官方文档给的方式是：
```javascript
<Bundle load={() => import('./something')}>
  {(mod) => (
      // do something with the module
  )}
</Bundle>
```
其中Bundle是一个封装组件，位于 [react-router-website](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-website) 
项目中，现在还未发布到npm。Bundle的[实现](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-website/modules/components/Bundle.js)
也很简单。按照文档中给出的用法使用遇到了坑2：不显示 or 报错。。

查看[Bundle源码](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-website/modules/components/Bundle.js)发现了一点小错误，修改如下：
```javascript
import React, { Component } from 'react'

class Bundle extends Component {
  state = {
    mod: null
  }

  componentWillMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    this.setState({
      mod: null
    })
    props.load().then((mod) => {
      this.setState({ mod: mod.default ? mod.default : mod })
    })
  }

  render() {
    return this.props.children(this.state.mod)
  }
}

export default Bundle
```

使用如下：
```javascript
const Mod = (props) => (
  <Bundle load={() => import(/* webpackChunkName: "Mod" */ './Mod')}>
      { (Mod) => Mod ? <Mod {...props} /> : null }
  </Bundle> )
```

React Router官方也提供了另外一种懒加载的方式：使用bundle-loader
```javascript
import loadSomething from 'bundle-loader?lazy!./Something'
```
按照官方的说法，好处是：第二次访问的时候同步回调，可以避免访问懒加载页面时闪烁的问题。
希望详细了解此方法可以直接阅读react-router的[文档](https://reacttraining.com/react-router/web/guides/code-splitting)


总结一下就是：
1. 不在乎是否直接支持ES6模块机制的，依然可以使用require.ensure()
2. 希望使用import()的，也完全支持require.ensure()的特性。在React上使用有时需要引入Bundle封装块
Bundle尚未发布在npm中，需要自行添加。

对于webpack 3，如果是由webpack 2.x升级，那么可以直接升级，不需要有太多顾虑。
如果是由webpack 1.x升级，那么与升级到webpack 2的成本几乎一致。

## 3. Service Worker

在使用react-create-app工具的时候，还发现了一个有趣的webpack插件：[SW Precache Webpack Plugin](https://github.com/goldhand/sw-precache-webpack-plugin)
(在此不禁感慨一下：后知后觉的好处就是————省了很多事儿~啊哈哈~O(∩_∩)O~)
向前翻可以看到宵哥的分享：**带你了解Progressive Web Apps** ,现在，我们已经可以开始使用一部分特性啦。
我们可以使用这个webpack插件，将缓存代码从业务代码中分离出来，该插件会将webpack打包出来的所有资源通过staticFileGlobsIgnorePatterns
进行一次过滤，得到需要缓存的文件路径，并写入precache默认缓存模板。需要注意的是：Service Worker只能由https承载(或者localhost)。

安装与使用：
```javascript
npm install --save-dev sw-precache-webpack-plugin
```
在webpack.config中配置：
```javascript
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

plugins: [
    new SWPrecacheWebpackPlugin({
      // 缓存名称
      cacheId: 'reactApp',
      // 与sw生成缓存的key相关。
      // 如果已经被webpack散列，就不用担心是否过期,所以不必缓存
      // dontCacheBustUrlsMatching: /\.\w{8}\./,
      dontCacheBustUrlsMatching: false,
      // 生成的文件名称
      filename: 'service-worker.js',
      // 压缩混淆service-worker
      minify: true,
      // 合并标志，控制 staticFileGlobs 和 stripPrefixMulti 选项是否合并webpack工作流
      // 资源合并webpack的生成流到Service Worker中,false将不包括webpack工作流
      mergeStaticsConfig: true,
      // 缓存非webpack打包的资源目录。忽略此选项，则包含所有webpack生成流的集合
      staticFileGlobs: [
        `.${vendor}`
      ],
      // 无效的url，回退到主页
      navigateFallback: '/public/index.html',
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      // 不缓存的文件。定义对staticFileGlobs项进行过滤的正则表达式
      staticFileGlobsIgnorePatterns: [
        // /index\.html$/,
        /\.map$/,
        // /\.css$/,
        /\.svg$/,
        /\.eot$/
      ],
    }),
]
```
即可生成service-worker.js。然后在app中注册：
```javascript
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
}
```

![缓存效果:]()
当我将webserver停掉以后，刷新页面依然可用。
![断网效果：]()


OK,本文总结了一下使用webpack 3 遇到的几个小问题，并对Service Worker进行了初步应用，希望对大家有所帮助。

参考资料：
[service worker初探：超级拦截器与预缓存](https://smallpath.me/post/service-worker-precache)
[Code Splitting](https://webpack.js.org/guides/code-splitting/)
[sw-precache-webpack-plugin](https://github.com/goldhand/sw-precache-webpack-plugin)
[react-router-code splitting](https://reacttraining.com/react-router/web/guides/code-splitting)