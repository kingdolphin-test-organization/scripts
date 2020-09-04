#!/usr/bin/env node

const jest = require("jest");
const fs = require("fs");

if (process.argv.length < 3)
    throw new Error("Invalid number of parameters!");

const cmd = process.argv[2];
const dir = process.cwd();

switch (cmd) {
    case "build":

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

        jest.runCLI({
            collectCoverage: false,
            testEnvironment: "jsdom",
            setupFiles: ["core-js"],
            moduleFileExtensions: ["ts", "js"],
            transform: {
                "\\.(ts)$": "ts-jest"
            },
            testRegex: "/tests/.*\\.(test.ts)$",
            moduleNameMapper: maps
        });

        break;
    default:
        throw new Error(`Unknown command ${cmd}!`);
}
