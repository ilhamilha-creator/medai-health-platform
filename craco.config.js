module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const fallback = webpackConfig.resolve.fallback || {};
      
      Object.assign(fallback, {
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url/'),
        assert: require.resolve('assert/'),
        vm: require.resolve('vm-browserify'),
        'process/browser': require.resolve('process/browser'),
      });
      
      webpackConfig.resolve.fallback = fallback;
      
      // Add plugin for buffer
      webpackConfig.plugins = webpackConfig.plugins || [];
      webpackConfig.plugins.push(
        new (require('webpack')).ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
      
      // Completely ignore canvg module
      webpackConfig.externals = webpackConfig.externals || {};
      webpackConfig.externals['canvg'] = 'commonjs canvg';
      
      return webpackConfig;
    },
  },
  eslint: {
    enable: false
  }
};
