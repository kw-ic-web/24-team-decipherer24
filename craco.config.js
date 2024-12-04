const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        assert: require.resolve("assert/"),
        buffer: require.resolve("buffer/"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        zlib: require.resolve("browserify-zlib"),
        path: require.resolve("path-browserify"),
        timers: require.resolve("timers-browserify"),
        url: require.resolve("url/"),
        util: require.resolve("util/"),
        querystring: require.resolve("querystring-es3"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        vm: require.resolve("vm-browserify"), // 추가된 부분
        async_hooks: false, // 브라우저에서 지원하지 않음
        fs: false,
        net: false,
      };

      webpackConfig.plugins = [
        ...(webpackConfig.plugins || []),
        new webpack.ProvidePlugin({
          process: "process/browser",
        }),
      ];

      return webpackConfig;
    },
  },
};