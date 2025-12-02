// karma.conf.js
const webpack = require('webpack');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    files: [
      'src/components/Test/**/*.test.js'
    ],
    preprocessors: {
      'src/components/Test/**/*.test.js': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            "process": "process/browser"
        },
        fallback: { 
            "process": require.resolve("process/browser") 
        } 
      },
      plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
      ]
    },
    browsers: ['Chrome'],
    reporters: ['progress'],
    singleRun: false,
    autoWatch: true
  });
};