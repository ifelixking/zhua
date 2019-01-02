const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Z_INDEX_BASE = (2147483647 - 2000)

module.exports = {
	entry: {
		admin: './src/web/app/admin/index.js',
		home: './src/web/app/home/index.js',
		injection: './src/web/app/injection/index.js'
	},
	output: {
		path: __dirname + '/bin/web',
		filename: '[name]/js/index.js',
		publicPath: '/'
	},
	plugins: [
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
			'/api/*': {
				target:"http://localhost:8080",
				pathRewrite:{'^/api/': '/'}
			}
		},
		historyApiFallback: {
			index: '/home/index.html',
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

							// ["import", {
							// 	"libraryName": "antd",
							// 	"libraryDirectory": "es",
							// 	"style": "css" // `style: true` 会加载 less 文件
							// }]
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
				test: /\.less?$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader' },
					{
						loader: 'less-loader',
						options: {
							modifyVars: {
								// z-index list
								'zindex-affix'           : Z_INDEX_BASE + 10,
								'zindex-back-top'        : Z_INDEX_BASE + 10,
								'zindex-modal-mask'      : Z_INDEX_BASE + 1000,
								'zindex-modal'           : Z_INDEX_BASE + 1000,
								'zindex-notification'    : Z_INDEX_BASE + 1010,
								'zindex-message'         : Z_INDEX_BASE + 1010,
								'zindex-popover'         : Z_INDEX_BASE + 1030,
								'zindex-picker'          : Z_INDEX_BASE + 1050,
								'zindex-dropdown'        : Z_INDEX_BASE + 1050,
								'zindex-tooltip'         : Z_INDEX_BASE + 1060,

							},
							javascriptEnabled: true,
							sourceMap: true
						},
					},
				],
				// loaders: [
				// 	'style-loader',
				// 	'css-loader',
				// 	'less-loader?{"sourceMap":true,"javascriptEnabled":true}'
				// ],
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