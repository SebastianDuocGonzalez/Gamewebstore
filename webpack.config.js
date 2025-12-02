const webpack = require('webpack'); // 1. Importamos webpack

module.exports = {
  mode: 'development', // Es bueno definir el modo para evitar warnings
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  // 2. Agregamos la sección de plugins
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // Aquí definimos las variables de entorno para que existan en el navegador
        REACT_APP_API_URL: JSON.stringify('http://localhost:8080/api/v1') 
      }
    })
  ]
};