const path = require("path");
// const getPublicUrlOrPath = require("react-dev-utils/getPublicUrlOrPath");

const defaultNames = {
    entry: "src",
    public: "public",
    output: "build",
    mainHtml: "index.html",
    bundleName: "bundle.js"
};

module.exports = function getConfig(mode, names) {
    names = {...defaultNames, ...names};

    const cwd = process.cwd();

    // const publicUrlOrPath = getPublicUrlOrPath(
    //     mode == "development",
    //     names.public
    // )

    return {
        mode,
        ...names,
        appPath: cwd,
        nodeModulesPath: path.join(cwd, "node_modules"),
        entryPath: path.join(cwd, names.entry),
        publicPath: path.join(cwd, names.public),
        outputPath: path.join(cwd, names.output),
        lint: false,
        shouldUseSourceMap: false
    };
}
