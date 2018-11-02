const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	entry:{
		index: './src/web/main/index.js'
	},
	output:{
		path: __dirname + '/bin/web/main',
		filename: 'asset/[name]-bundle.js',
		publicPath: '/'
	},
	plugins:[
		new HtmlWebpackPlugin({
			filename: 'index.html',
			chunks: ['index'],
			title: 'Welcom to zhua',
			template: 'src/web/res/index.tpl.html'
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
						presets: ['@babel/preset-react', ["@babel/preset-env", { "targets": { "esmodules": true } }]],
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