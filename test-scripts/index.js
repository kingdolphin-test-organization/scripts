#!/usr/bin/env node

const fs = require("fs");
const {run} = require("jest-cli");
const {exec, spawn} = require("child_process");

if (process.argv.length < 3)
    throw new Error("Invalid number of parameters!");

const cmd = process.argv[2];
const cwd = process.cwd();

const cmds = new Map([
    ["start", start],
    ["build", build],
    ["create", create],
    ["lib", lib],
    ["update", update],
    ["test", test]
]);


if (!cmds.has(cmd))
    throw new Error(`Unknown command ${cmd}!`);

(cmds.get(cmd))(process.argv.slice(3));


function start() {
    // look for and launch backend server
    // launch webpack dev server
    // watch code to rebuild
    spawn("node_modules/.bin/react-app-rewired",
          ["start", "--config-overrides", "node_modules/kingdolphin-test-scripts/config-overrides.js"],
          { stdio: "inherit" });
}

function build() {
    // prod build
    spawn("node_modules/.bin/react-app-rewired", ["build"], { stdio: "inherit" });
}

function create() {
    // // create default empty project
    // if (process.argv.length < 4)
    //     throw new Error("Invalid number of parameters! Please specify a directory!");
    // const dir = process.argv[3];
    // exec(`mkdir ${dir}`)
    // exec("npm init -y");

}

function lib(args) {
    // add opencircuits library submodule
    if (args.length < 1)
        throw new Error("Invalid number of parameters! Need to know what library to add!");
    const lib = args[0];
    const dir = (args[1] || "lib")
    exec(`git submodule add https://github.com/kingdolphin-test-organization/${lib} ${dir}/${lib}`);

}

function update() {
    // pull and update submodules
    exec("git pull");
    exec("git submodule foreach git pull origin master");
}

function test() {
    let maps = {};

    const config = (fs.readFileSync(`${cwd}/tsconfig.paths.json`) || fs.readFileSync(`${cwd}/tsconfig.json`) || "{}")
    const tsconfig = JSON.parse(config || "{}");
    if (tsconfig["compilerOptions"] && tsconfig["compilerOptions"]["paths"]) {
        const paths = tsconfig["compilerOptions"]["paths"];
        Object.entries(paths).forEach(([name, [path]]) => {
            name = name.replace("*", "(.*)$");
            path = path.replace("*", "$1");
            maps[name] = `<rootDir>/${path}.ts`;
        });
    }

    run([
        "--collectCoverage", "false",
        "--testEnvironment", "jsdom",
        "--setupFiles", "core-js",
        "--moduleFileExtensions", "ts",
        "--moduleFileExtensions", "js",
        "--roots", "<rootDir>",
        "--transform", `{"^.+\\\\.[jt]sx?$":"ts-jest"}`,
        "--testRegex", `.*/tests/.*\\.(test.ts)$`,
        "--moduleNameMapper", JSON.stringify(maps)
    ], cwd);
}
