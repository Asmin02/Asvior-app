import { execSync } from "node:child_process";

process.env.CAPACITOR_REMOTE_URL = "https://asvior.app";
execSync("npx cap sync android", { stdio: "inherit", env: process.env });
