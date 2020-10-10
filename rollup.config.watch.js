/*
 * 将我们编写的源码与依赖的第三方库进行合并
 */
import resolve from 'rollup-plugin-node-resolve'; 
/* 
 * 默认情况下，rollup.js是无法识别CommonJS模块的，此时我们需要借助commonjs插件来解决这个问题。
 * CommonJS模块不能支持tree-shaking特性，所以建议大家使用rollup.js打包时，尽量使用ES模块，以获得更精简的代码。
 */
import commonjs from 'rollup-plugin-commonjs';
/* 
 * 解析ES6语法
 */
import babel from 'rollup-plugin-babel';
/* 
 * 默认情况下rollup.js不支持导入json模块，所以我们需要使用json插件来支持
 */
import json from 'rollup-plugin-json';
/* 
 * uglify插件可以帮助我们进一步压缩代码的体积
 */
import { uglify } from 'rollup-plugin-uglify';

/* 
 * serve插件可以帮助启用虚拟服务器
 */
import serve from 'rollup-plugin-serve';

const postcss = require('rollup-plugin-postcss');
const sass = require('node-sass');
const processSass = function(context, payload) {
  return new Promise(( resolve, reject ) => {
      sass.render({
          file: context
      }, function(err, result) {
          console.log(result);
          if( !err ) {
              resolve(result);
          } else {
              console.log(err);
              reject(err)
          }
      });
  })
};
/*
 * package.json
 * {
 *     "name": "sam-test-data",
 *     "version": "0.0.4",
 *     "description": "provide test data",
 *     "main": "dist/sam-test-data.js",
 *     "module": "dist/sam-test-data-es.js"
 * } 
 * 可以看到main属性指向dist/sam-test-data.js，这是一个UMD模块，但是module属性指向dist/sam-test-data-es.js，这是一个ES模块，
 * rollup.js默认情况下会优先寻找并加载module属性指向的模块。所以sam-test-data的ES模块被优先加载，从而能够支持tree-shaking特性。
 * 在 package.json 文件的 main 属性中指向当前编译的版本。如果你的 package.json 也具有 module 字段，像 Rollup 和 webpack 2 这样的 ES6 感知工具(ES6-aware tools)将会直接导入 ES6 模块版本。
 */
export default {
    /*
     * input:入口文件
     */
    input: 'src/main.js',
    /*
     * output: 输出文件设置，单文件为对象，多文件则为对象数组
     * output[file]: 导出文件路径
     * output[format]: 导出文件格式，值可为es, cjs, amd, umd
     * output[banner]: 文件头部添加的内容
     * output[footer]: 文件末尾添加的内容
     *  
     */
    output: { 
        file: 'dist/main.min.js',
        format: 'iife',
        sourceMap: 'inline',
        globals: {
            jquery: '$'
        }
    },
    /* 
     * 调用插件
     */
    plugins: [
        postcss({
            minimize: false,
            extensions:['css','scss'],
            process:processSass,

        }),
        resolve(),
        /* commonjs(), */
        json(),
        babel({
            exclude: 'node_modules/**',
          }),
        uglify(),
        serve({
            // Launch in browser (default: false)
            open: true,
          
            // Page to navigate to when opening the browser.
            // Will not do anything if open=false.
            // Remember to start with a slash.
            openPage: '/demo.html',
          
            // Show server address in console (default: true)
            verbose: false,
          
            // Folder to serve files from
            contentBase: '',
          
            // Multiple folders to serve from
            // contentBase: ['dist'],
          
            // Set to true to return index.html (200) instead of error page (404)
            historyApiFallback: false,
          
            // Path to fallback page
            historyApiFallback: '/200.html',
          
            // Options used in setting up server
            host: 'localhost',
            port: 10001,
          
            // By default server will be served over HTTP (https: false). It can optionally be served over HTTPS
            // https: {
            //   key: fs.readFileSync('/path/to/server.key'),
            //   cert: fs.readFileSync('/path/to/server.crt'),
            //   ca: fs.readFileSync('/path/to/ca.pem')
            // },
          
            //set headers
            headers: {
              'Access-Control-Allow-Origin': '*',
              foo: 'bar'
            }
          })
    ],
    /* 
     * 有些场景下，虽然我们使用了resolve插件，但我们仍然需要某些库保持外部引用状态，这时我们就需要使用external属性，告诉rollup.js哪些是外部的类库
     */
    external: ['jquery'],
};

/* 
 * rollup -监听
 * =====================
 * 命令行模式
 * --watch
 * watch模式支持监听代码变化，一旦修改代码后将自动执行打包
 * ======================
 * API模式
 * 在根目录创建以下文件，通过api来启动watch模式
 * rollup-watch-input-options.js：输入配置 
 * rollup-watch-output-options.js：输出配置 
 * rollup-watch-options.js：监听配置
 * rollup-watch.js：调用rollup.js的API启动watch模式
 * 让node能够执行我们的程序，所以采用上述文件CommonJS规范
 * 通过node直接启动监听：$ node rollup-watch.js 
 */

 /* 
 * rollup 命令行模式
 * --watch
 * watch模式支持监听代码变化，一旦修改代码后将自动执行打包
 */