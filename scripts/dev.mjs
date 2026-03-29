import { spawn } from "node:child_process";

const args = process.argv.slice(2).map((arg) => arg.toLowerCase());
const runFull = args.includes("full");
const runTest = args.includes("test");

const targetScript = runTest ? "dev:test" : runFull ? "dev:full" : "dev:web";
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const child = spawn(npmCmd, ["run", targetScript], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
