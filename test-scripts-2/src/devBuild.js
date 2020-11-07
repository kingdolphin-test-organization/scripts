const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const openBrowser = require("react-dev-utils/openBrowser");
const getConfig = require("./config");

module.exports = function devBuild(args) {
    // Do this as the first thing so that any code reading it knows the right env.
    process.env.BABEL_ENV = "development";
    process.env.NODE_ENV = "development";

    const config = getConfig("development");
    const webpackConfig = require("./webpack.config.js")(config);

    const options = {
        contentBase: config.publicPath,
        publicPath: "/",
        hot: true,
        inline: true,
        stats: { colors: true },
        port: 8080
    };

    const server = new WebpackDevServer(webpack(webpackConfig), options);

    server.listen(8080, "localhost", (err) => {
        if (err)
            console.error(err);
        console.log("WebpackDevServer listening at localhost:8080");

        openBrowser("http://localhost:8080/");
    })
}