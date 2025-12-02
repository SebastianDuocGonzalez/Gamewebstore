// karma.conf.js (Ejemplo de configuración necesaria para React)
const webpackConfig = require('./webpack.config.js'); // Tu config de webpack existente

module.exports = function(config) {
  config.set({
     
    // Framework: Usamos Jasmine
    frameworks: ['jasmine','webpack'],

    files: [
      'src/components/Test/**/*.test.js'
    ],

    preprocessors: {
      // Le decimos a Karma que pase los archivos por Webpack primero
      'src/components/Test/**/*.test.js': ['webpack']
    },
      
    webpack: webpackConfig, // Pasamos la configuración para que entienda JSX/React
    
    browsers: ['ChromeHeadless'], 
    singleRun: true
  });
};