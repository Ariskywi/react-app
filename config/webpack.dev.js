'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const manifest = require('../public/manifest_vendor.json');
const verdor = '/public/' + manifest.name.replace('_', '.') + '.js';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const paths = {
  demo: resolveApp('demo/demo'),
  appDemo: resolveApp('demo'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('config/index.html'),
  appIndexJs: resolveApp('src/index'),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
}

const publicPath = '/';
process.env.BABEL_ENV = process.env.NODE_ENV = 'development';
process.env.PUBLIC_URL = ''; // publicPath的无斜线版
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

const envRaw = Object.keys(process.env)
  // .filter(key => /^REACT*/i.test(key))
  .reduce(
    (env, key) => {
      env[key] = process.env[key];
      return env;
    },
    {
      VENDOR: verdor
    }
  );

const envStringified = {
  'process.env': Object.keys(envRaw).reduce((env, key) => {
    env[key] = JSON.stringify(envRaw[key]);
    return env;
  }, {}),
};

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    app: [
      // 更好的更新体验
      require.resolve('react-dev-utils/webpackHotDevClient'),
      require.resolve('./polyfills'),
      paths.demo
    ]
  },
  output: {
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    filename: 'dist/js/[name].js',
    chunkFilename: 'dist/js/[name].chunk.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: ['.js', '.json','.jsx'],
    // plugins: [
    //   // Prevents users from importing files from outside of src/ (or node_modules/).
    //   new ModuleScopePlugin(paths.appSrc)
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
              formatter: eslintFormatter
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
          /\.less$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
        ],
        loader: require.resolve('file-loader'),
        options: {
          name: 'dist/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'dist/media/[name].[hash:8].[ext]',
        },
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: [paths.appSrc, paths.appDemo],
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [
            ['import', { libraryName: 'antd', style: 'css' }]
          ],
          cacheDirectory: true,
        },
      },
      {
        test: /\.(css|less)$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
              // modules: true,
              // localIdentName: '[path][name]__[local]--[hash:base64:5]',
              // getLocalIdent: (context, localIdentName, localName, options) => {
              //   return 'sogou'
              // },
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
              modifyVars: { "@primary-color": "#adf8f3" },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Makes some environment variables available to the JS code
    new webpack.DefinePlugin(envStringified),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: manifest,
    }),
    // Makes some environment variables available in index.html.
    new InterpolateHtmlPlugin(envRaw),
    new HtmlWebpackPlugin({
      inject: 'body',
      showErrors: true,
      template: paths.appHtml,
      filename: 'index.html',
      vendor: verdor
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),    // 作用域提升
    new webpack.NamedModulesPlugin(),                    // 更新时返回文件名
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin({ profile: false }),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
  ],
  devServer: {
    host: '0.0.0.0',
    port: '3500',
    inline: true,
    hot: true,
    compress: true,
    clientLogLevel: 'warning',
    // quiet: true,
    // proxy: {
    //   '*.action': {
    //     target: '',
    //     bypass: function (req, res, proxyOptions) {
    //
    //     }
    //   }
    // },
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  performance: {
    hints: false,
  },
};