'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const manifest = require('../public/manifest_vendor.json');
const vendor = '/public/' + manifest.name.replace('_', '.') + '.js';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const paths = {
  appPublic: resolveApp('public'),
  appHtml: resolveApp('config/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
}

process.env.BABEL_ENV = process.env.NODE_ENV = 'production';
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

const envRaw = Object.keys(process.env)
.filter(key => /^REACT*/i.test(key))
  .reduce(
    (env, key) => {
      env[key] = process.env[key];
      return env;
    },
    {
      VENDOR: vendor
    }
  );

const envStringified = {
  'process.env': Object.keys(envRaw).reduce((env, key) => {
    env[key] = JSON.stringify(envRaw[key]);
    return env;
  }, {}),
};

const cssFilename = 'css/[name].[contenthash:8].css';
// 如果使用相对路径
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = false;
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ?
    { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {};

module.exports = {
  bail: true,
  // devtool: 'source-map',
  entry: {
    app: [
      require.resolve('./polyfills'),
      paths.appIndexJs
  ]},
  output: {
    path: paths.appPublic,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
    publicPath: '/public/',
    devtoolModuleFilenameTemplate: info =>
      path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.js', '.json','.jsx'],
    // plugins: [
    //   new ModuleScopePlugin(paths.appSrc),
    // ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.less$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
        ],
        loader: require.resolve('file-loader'),
        options: {
          name: 'media/[name].[hash:8].[ext]',
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [
            ['import', { libraryName: 'antd', style: 'css' }]
          ],
          compact: true,
        },
      },
      {
        test: /\.css|less$/,
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: require.resolve('style-loader'),
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 2,
                    minimize: true
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        browsers: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9',
                        ],
                        flexbox: 'no-2009',
                      }),
                    ],
                  },
                },
                {
                  loader: require.resolve('less-loader'),
                  options: {
                    modifyVars: { "@primary-color": "#8cc7f8" },
                  },
                },
              ],
            },
            extractTextPluginOptions
          )
        ),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(envStringified),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: manifest,
    }),
    new InterpolateHtmlPlugin(envRaw),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      vendor: vendor
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
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
        /index\.html$/,
        /\.map$/,
        // /\.css$/,
        /\.svg$/,
        /\.eot$/
      ],
    }),
    new webpack.ProgressPlugin({ profile: false }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
