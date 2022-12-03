import { exec }  from "node:child_process";
import path from "node:path";

const toExecPromise = async (cmd, timeout=60000) => new Promise((resolve) => {
  const error = (err) => throw new Error(err);
  const timeOut = () => (proc.kill("SIGTERM"), error(`Command took too long: ${cmd}`));
  const id = setTimeout(timeOut, timeout);
  exec(cmd, (err, stdout) => clearTimeout(id) && ((err) ? error(err) : resolve(stdout));
});

export const moduleExports = {
  git: (cmd) => toExecPromise(`git ${cmd}`),
  getCurrentBranch: async () => (await git(`rev-parse --abbrev-ref HEAD`)).trim(),
  getConfigData: async (configItem) => await git(configItem).catch((_)=>""),
  getBranches: async () => Array.from((await git("branch --no-color"))
    .split("\n").map((branch) => branch.replace("*", "").trim())
    .reduce((collector, branch) => collector.add(branch), new Set())),
  hasBranch: async (branch) => (await git.getBranches()).includes(branch),
  switchBranch: async (branch) => (await git.hasBranch(branch)) 
    ? await git(`checkout -b ${branch}`)
    : await git(`checkout ${branch}`),
  getRepoName: async () => path.basename((await git("rev-parse --show-toplevel"))).trim()
};
