const {alias, configPaths} = require('react-app-rewire-alias');

module.exports = function override(config, _) {
    const cwd = process.cwd();

    alias({
        ...configPaths(`${cwd}/tsconfig.paths.json`)
    })(config);

    return config;
}