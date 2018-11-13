const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	entry:{
		admin: './src/web/app/admin/index.js',
		home: './src/web/app/home/index.js',
		injection: './src/web/app/injection/index.js'
	},
	output:{
		path: __dirname + '/bin/web',
		filename: '[name]/js/index.js',
		publicPath: '/'
	},
	plugins:[
		new HtmlWebpackPlugin({
			filename: 'home/index.html',
			chunks: ['home'],
			title: 'Welcom to zhua',
			template: 'src/web/res/index.tpl.html'
		}),
		new HtmlWebpackPlugin({
			filename: 'injection/index.html',
			chunks: ['injection'],
			template: 'src/web/res/injection-test.tpl.html'
		}),
		new CopyWebpackPlugin([{ from: './src/web/static' }])
	],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				sourceMap: true
			})
		]
	},
	devServer: {
		port: 80,
		proxy: {
			'/api': "http://localhost/8080",
		},
		historyApiFallback: {
			index: '/index.html',
			rewrites: [
				{ from: /^\/admin/, to: '/admin.html' }
			],
		},
		// https: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				include: path.resolve(__dirname, 'src/web'),
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-react',											// 搞定 JSX 语法
							["@babel/preset-env", { "targets": { "esmodules": true } }]		// 搞定 ES6 语法
						],
						plugins: [
							// Stage 0
							// "@babel/plugin-proposal-function-bind",

							// Stage 1
							// "@babel/plugin-proposal-export-default-from",
							// "@babel/plugin-proposal-logical-assignment-operators",
							// ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
							// ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
							// ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
							// "@babel/plugin-proposal-do-expressions",

							// Stage 2
							// ["@babel/plugin-proposal-decorators", { "legacy": true }],
							// "@babel/plugin-proposal-function-sent",
							// "@babel/plugin-proposal-export-namespace-from",
							// "@babel/plugin-proposal-numeric-separator",
							// "@babel/plugin-proposal-throw-expressions",

							// Stage 3
							// "@babel/plugin-syntax-dynamic-import",
							// "@babel/plugin-syntax-import-meta",
							["@babel/plugin-proposal-class-properties", { "loose": false }],		// 搞定 提案:类静态方法 语法
							// "@babel/plugin-proposal-json-strings"
						]
					}
				}
			},
			{
				test: /\.css$/,
				loaders: [
					'style-loader?sourceMap',
					'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
				]
			},
			{
				test: /\.svg$/,
				use: [
					"babel-loader",
					{
						loader: "react-svg-loader",
						options: {
							svgo: {
								plugins: [
									{ removeTitle: false }
								],
								floatPrecision: 2
							}
						}
					}
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'asset/',
						}
					}
				]
			}
		]
	}
}