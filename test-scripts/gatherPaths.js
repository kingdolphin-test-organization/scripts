const fs = require("fs");

module.exports = function() {
    const cwd = process.cwd();

    let maps = {};

    const config = (fs.readFileSync(`${cwd}/tsconfig.paths.json`) || fs.readFileSync(`${cwd}/tsconfig.json`) || "{}")
    const tsconfig = JSON.parse(config || "{}");
    if (tsconfig["compilerOptions"] && tsconfig["compilerOptions"]["paths"]) {
        const paths = tsconfig["compilerOptions"]["paths"];
        Object.entries(paths).forEach(([name, [path]]) => {
            maps[name] = path;
        });
    }

    return maps;
}