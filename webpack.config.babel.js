import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import glob from 'glob';
const mainPath = path.join(__dirname, 'src/main');
const mainFilePath = 'profitList/*.js';
const srcPath = path.join(__dirname,'src');
import HappyPack from 'happypack';

function getHtmlPlugins() {
  return glob.sync(mainFilePath,{cwd:mainPath}).map((file)=>{

    const name = file.substr(0, file.length - 3);
    console.log('name=========>'+name);
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,//相对于output.path而言
      template: 'public/index.html',//本地模板文件
      title:'aaa',
      chunks: [name],
      minify: {minifyJS: true, collapseWhitespace: true},//压缩
      inject: true//注入静态资源，true所有JavaScript资源插入到body元素的底部
    });
  });
}

const plugins =  getHtmlPlugins();

plugins.push(
    new webpack.HotModuleReplacementPlugin(),//代码热替换
    new webpack.NamedModulesPlugin()
);

plugins.push(
    new HappyPack({
        loaders: ['babel-loader?cacheDirectory=true']
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV:  JSON.stringify('development'),
            // API: JSON.stringify(process.env.API),
            // REMOTEDEV_HOSTNAME: options.minimize ? null : JSON.stringify(getLocalIp()),
            // REMOTEDEV_PORT: options.minimize ? null : JSON.stringify(process.env.npm_package_remotedev_port)
        }
    })
);
// plugins.push(new webpack.NoEmitOnErrorsPlugin());

/*
入口文件
 */
function getEntry() {
  const entry = {};
  glob.sync(mainFilePath, {cwd: mainPath}).map((file) => {

    const name = file.substr(0, file.length - 3);
    const entries = ['babel-polyfill'];
    entries.push('webpack/hot/only-dev-server');
    entries.push(path.join(mainPath, name));

      entries.push('react-hot-loader/patch');

    // if (needMock) {
    //   entries.push(path.join(srcPath, 'mock', 'common'));
    //   if (fs.existsSync(path.join(srcPath, 'mock', `${name}.js`))) {
    //     entries.push(path.join(srcPath, 'mock', name));
    //   }
    // }
    entry[name] = entries;
  });
  return entry;
}

function extsToRegExp(exts) {
  const extsArr = exts.map(ext => ext.replace(/\./g, '\\.'));
  return new RegExp(`\\.(${extsArr.join('|')})$`);
}

function rulesByExtension(obj) {
  const rules = [];
  Object.keys(obj).forEach((key) => {
    const exts = key.split('|');
    const value = obj[key];
    const rule = {
      test: extsToRegExp(exts)
    };
    if (Array.isArray(value)) {
      rule.use = value;
    } else if (typeof value === 'string') {
      rule.use = [value];
    } else {
      Object.keys(value).forEach((valueKey) => {
        rule[valueKey] = value[valueKey];
      });
    }
    rules.push(rule);
  });
  return rules;
}

const loaders = {
  'js|jsx': {
    use: [
      {
        loader: 'happypack/loader'
      }
    ],
    include: srcPath
  },
  'png|jpg|jpeg|gif|svg': 'url-loader?limit=10000&name=images/[hash].[ext]',
  'woff|woff2': 'url-loader?limit=100000',
  'ttf|eot': 'file-loader'
};
loaders.html = 'html-loader';
const cssLoader = 'css-loader!postcss-loader';

const stylesheetLoaders = {
  css: cssLoader,
  'scss|sass': [cssLoader, 'sass-loader?outputStyle=expanded']
};

module.exports = {

  entry:getEntry(),//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/public",//打包后的文件存放的地方,用webpack-p执行
    filename: `[name].js`,//打包后输出文件的文件名
    publicPath:'/',//是webpack-dev-server的路径
    sourceMapFilename: '[file].map',
    crossOriginLoading: 'anonymous',//这个选项用于跨域加载chunks,允许跨域加载，用anonymous的时候，不会在请求发送证书。
    pathinfo: false,
  },
  target: 'web',
  resolve: {//用来配置文件路径的指向，可以定义文件跟模块的默认路径及后缀等，节省 webpack 搜索文件的时间、优化引用模块时的体验
    modules: [
      path.join(__dirname,'src'),
      'node_modules'
    ],
    extensions:['.js','.json']
  },
  bail: true,
  // module: {
  //   rules: rulesByExtension(loaders).concat(rulesByExtension(stylesheetLoaders))
  // },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                // loader: "babel-loader",
              loader:
                'babel-loader'

              ,
                exclude: /node_modules/,
                query: {
                  cacheDirectory: true,
                    // presets: ['es2015','react',"stage-0"]
                }
            },
          { test: /\.css$/, loader: "style-loader!css-loader",
            exclude: /node_modules/},
          { test: /\.scss$/, loader: "style-loader!css-loader!sass-loader",
            exclude: /node_modules/}
        ]
    },
  devtool: 'cheap-module-source-map',//7种SourceMap模式
  plugins,
  devServer:{//webpack-dev-server他将打包后的存在内存中，并没有在工作区生成一个文件。打包文件用，用webpack -p 命令。
    disableHostCheck: true,
    contentBase: 'src/main',
    publicPath:'/',
    historyApiFallback: true,
    port:2000,
    hot:true,
    proxy: {//外部代理,对于代理的请求可以通过提供一个函数来重写，这个函数可以查看或者改变http请求。下面的例子就会重写HTTP请求，其主要作用就是移除URL前面的/tj.gif部分。
      '/tj.gif': {
        // target: 'http://hybrid.dev.dongwei.com',
        secure: false,
        changeOrigin: true
      }
    },
    stats: {
      timings: true,
      chunks: false,
      children: false
    },
  }
}