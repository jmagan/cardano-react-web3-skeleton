/* config-overrides.js */
const webpack = require('webpack');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(webpackConfig, env) {
    const wasmExtensionRegExp = /\.wasm$/;
    webpackConfig.resolve.extensions.push('.wasm');
    webpackConfig.experiments = {
        asyncWebAssembly: true,
        lazyCompilation: false,
        syncWebAssembly: true,
        topLevelAwait: true,
    };
    webpackConfig.resolve.fallback = {
        buffer: require.resolve('buffer/'),
        util: false,
        fs: false,
        path: false
    }
    webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
            if (oneOf.type === "asset/resource") {
                oneOf.exclude.push(wasmExtensionRegExp);
            }
        });
    });
    webpackConfig.plugins.push(new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        stream: require.resolve('readable-stream'),
    }));

    webpackConfig.plugins.push(new webpack.IgnorePlugin({resourceRegExp: /^\.\/wordlists\/(?!english)/, contextRegExp: /bip39\/src$/}),)

    webpackConfig.plugins.push(new webpack.NormalModuleReplacementPlugin(
        /@emurgo\/cardano-serialization-lib-nodejs/,
        '@emurgo/cardano-serialization-lib-browser'))

    webpackConfig.plugins.push(new webpack.NormalModuleReplacementPlugin(
        /@emurgo\/cardano-message-signing-nodejs/,
        '@emurgo/cardano-message-signing-browser'))

    webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));

    console.log(webpackConfig)

    webpackConfig.ignoreWarnings = [
        // Ignore warnings raised by source-map-loader.
        // some third party packages may ship miss-configured sourcemaps, that interrupts the build
        // See: https://github.com/facebook/create-react-app/discussions/11278#discussioncomment-1780169
        /**
         *
         * @param {import('webpack').WebpackError} warning
         * @returns {boolean}
         */
        function ignoreSourcemapsloaderWarnings(warning) {
            return (
                warning.module &&
                warning.module.resource.includes('node_modules') &&
                warning.details &&
                warning.details.includes('source-map-loader')
            );
        },
    ]

    return webpackConfig;
}