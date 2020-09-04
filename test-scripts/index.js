
if (process.argv.length < 3)
    throw new Error("Invalid number of parameters!");

const cmd = process.argv[2];

switch (cmd) {
    case "build":
        console.log(process.cwd());
        break;
    default:
        throw new Error(`Unknown command ${cmd}!`);
}
