import { promises as fs } from "node:fs";
import { git, getRepoName } from "./git.js";
import { finished, logo, example } from "./messages.mjs";
import path from "node:path";
import { program } from "commander";
import { Prompts } from "./prompts.js";
import pkg from "./package.json" assert { type: "json" };
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const version = pkg.version;
const tmplDir = __dirname + "/templates/";

// Colors
const { g, gr, r, y, heading } = await import("./theme.mjs");
const chk = g("✔");

async function performGitTasks(collectedData) {
  console.info(heading("Performing git tasks"));
  let newRepo = "";
  if (collectedData.repo !== path.basename(process.cwd())) {
    newRepo = collectedData.repo;
  }
  if (collectedData.needsGitInit) {
    const result = await git(`init ${newRepo}`);
    if (newRepo) {
      process.chdir(`${process.cwd()}/${newRepo}`);
    }
    console.info(g(` ${chk} ${result.trim()}`));
  }
  await git.switchBranch(collectedData.mainBranch);
  console.info(g(` ${chk} switched to branch ${collectedData.mainBranch}`));
}

function populateTemplate(rawData, collectedData, file) {
  // find all {{\w}} and replace them form collectedData
  const replaceSet = (rawData.match(/{{\w+}}/gm) || [])
    .map((match) => match.replace(/[{{|}}]/g, ""))
    .reduce((collector, match) => collector.add(match), new Set());
  return Array.from(replaceSet)
    .map((match) => {
      const key = new RegExp(`{{${match}}}`, "gm");
      if (!collectedData[match]) {
        console.warn(
          `${y("Warning")}: no match for \`${match}\` in template ${file}`
        );
      }
      const value = collectedData[match] || match;
      return [key, value];
    })
    .reduce((rawData, [key, value]) => rawData.replace(key, value), rawData);
}

async function getFilesToInclude(collectedData) {
  const excludedFiles = new Set();
  switch (collectedData.preprocessor) {
    case "bikeshed":
      excludedFiles.add("index.html");
      break;
    case "respec":
      excludedFiles.add("index.bs");
      break;
  }
  const dirFiles = await fs.readdir(tmplDir);
  return dirFiles
    .filter((filename) => !excludedFiles.has(filename))
    .map((filename) => [tmplDir + filename, `${process.cwd()}/${filename}`]);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath, fs.F_OK);
  } catch (err) {
    return false;
  }
  return true;
}

// Uses git to get the name of the repo (cwd)
async function writeTemplates(collectedData) {
  console.info(heading("Creating Templates"));
  const destinations = await getFilesToInclude(collectedData);
  const successfulWrites = [];
  for (let [from, to] of destinations) {
    if (await fileExists(to)) {
      console.warn(
        `${y(" ⚠️ skipping")} ${gr(path.basename(to))} (already exists)`
      );
      continue;
    }
    const rawData = await fs.readFile(from, "utf8");
    const data = populateTemplate(rawData, collectedData, path.basename(from));
    try {
      await fs.writeFile(to, data);
      const basename = path.basename(to);
      console.log(` ${chk} ${g("created")} ${gr(basename)}`);
      successfulWrites.push(basename);
    } catch (err) {
      console.error(
        ` 💥 ${r("error: ")} could not create ${gr(path.basename(to))}`
      );
    }
  }
  if (successfulWrites.length) {
    await git(`add ${successfulWrites.join(" ")}`);
    await git(`commit -am "feat: add WICG files."`);
    console.info(
      g(`\nCommitted changes to "${collectedData.mainBranch}" branch.`)
    );
  }
  return collectedData;
}

// Tell the user what they should do next.
function postInitialization() {
  console.info(finished);
}

async function collectProjectData(name = "") {
  console.info(heading("Let's get you set up! (About this WICG project)"));
  let needsGitInit = false;
  const repo = await getRepoName()
    .catch((_err) => (needsGitInit = true) && (await Prompts.askRepoName()).trim());
  name = name || await Prompts.askProjectName(repo);
  
  const userName = await Prompts.askUserName();
  const userEmail = await Prompts.askEmail();
  
  const [, affiliationHint] = /(?:@)([\w|-]+)/.exec(userEmail);
  const affiliation = await Prompts.askAffiliation(affiliationHint);
  const affiliationURL = (affiliation) ? await Prompts.askAffiliationURL(userEmail) : '';
  
  const mainBranch = await Prompts.askWhichGitBranch();
  const preprocessor = await Prompts.askWhichPreProcessor();
  const srcfile = preprocessor === "bikeshed" ? "index.bs" : "index.html",
  
  return { repo, name, userName, userEmail, affiliation, affiliationURL, mainBranch, preprocessor, needsGitInit, srcfile, };
}

program
  .version(version)
  .command("init [name]")
  .description("start a new incubation project")
  .action(async (name, options) => {
    console.info(logo);
    try {
      const collectedData = await collectProjectData(name, options);
      await performGitTasks(collectedData);
      await writeTemplates(collectedData);
    } catch (err) {
      console.error(`\n 💥 ${r(err.message)}`, err);
    }
    postInitialization();
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  console.log(example);
}
