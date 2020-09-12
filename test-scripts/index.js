#!/usr/bin/env node

const fs = require("fs");
const {run} = require("jest-cli");
const {exec, execSync} = require("child_process");
// const

if (process.argv.length < 3)
    throw new Error("Invalid number of parameters!");

const cmd = process.argv[2];
const dir = process.cwd();

console.log(`COMMAND ${cmd}`);

switch (cmd) {
    case "start":
        // look for and launch backend server
        // launch webpack dev server
        // watch code to rebuild
        console.log("START");
        // execSync("npm run test");
        // execSync("npx react-scripts start");
        execSync("node_modules/.bin/react-scripts start");

        console.log("DONE EXEC??");
        break;
    case "build":
        // prod build
        exec("npx react-scripts build");
        break;
    case "create":
        // // create default empty project
        // if (process.argv.length < 4)
        //     throw new Error("Invalid number of parameters! Please specify a directory!");
        // const dir = process.argv[3];
        // exec(`mkdir ${dir}`)
        // exec("npm init -y");
        break;
    case "lib":
        // add opencircuits library submodule
        if (process.argv.length < 4)
            throw new Error("Invalid number of parameters! Need to know what library to add!");
        const lib = process.argv[3];
        const dir = (process.argv[4] || "lib")
        exec(`git submodule add https://github.com/kingdolphin-test-organization/${lib} ${dir}/${lib}`);
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
