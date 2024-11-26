const webpack = require("webpack");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                buffer: require.resolve("buffer/"),
                stream: require.resolve("stream-browserify"),
                util: require.resolve("util/"),
                process: require.resolve("process/browser"),
            };
            return webpackConfig;
        },
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: ["buffer", "Buffer"],
                process: "process/browser",
            }),
        ],
    },
    resolve: {
    fallback: { crypto: false },
},
};
