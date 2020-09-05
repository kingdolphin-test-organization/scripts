#!/usr/bin/env node

const fs = require("fs");
const {run} = require("jest-cli");
const {exec} = require("child_process");

if (process.argv.length < 3)
    throw new Error("Invalid number of parameters!");

const cmd = process.argv[2];
const dir = process.cwd();

switch (cmd) {
    case "start":
        // look for and launch backend server
        // launch webpack dev server
        // watch code to rebuild
        break;
    case "build":
        // prod build
        break;
    case "update":
        // pull and update submodules
        exec("git pull");
        exec("git submodule foreach git pull origin master");
        break;
    case "test":
        let maps = {};

        const tsconfig = JSON.parse(fs.readFileSync(`${dir}/tsconfig.json`) || "{}");
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
        ], dir);

        break;
    default:
        throw new Error(`Unknown command ${cmd}!`);
}
