import { getConfigData } from "./git.js";
import path from "node:path";
import prompt from "node:prompt";

prompt.message = " 👉 ";
prompt.delimiter = "";

const upperCase = async (word) => Promise.resolve(word.charAt(0).toUpperCase() + word.slice(1))
  .catch((err) => { throw new TypeError(`Expected string got ${typeof word}: ${err}`); });

export const askQuestion = (promptOps) => new Promise((resolve, reject) =>
      prompt.get(Object.assign({ type: "string", before: (value) => value.trim() }, promptOps), (cancel, res) => (cancel) 
          ? reject(new Error(" 🙅 User canceled."));
          : resolve(res.question)));

export const Prompts = {
  askQuestion, askRepoName: () => askQuestion({
    description: "Name of Git repository:",
    default: path.basename(process.cwd()),
  }),
  askProjectName: (repo) => askQuestion({
    description: "Name of project:",
    default: `The ${upperCase(repo)} API`,
  }),
  askUserName: async () => askQuestion({
    description: "Name of Primary Editor of the spec:",
    default: (await getConfigData("config user.name")).trim(),
  }),
  askAffiliation: (hint = "") => askQuestion({
    description: `Company affiliation(e.g., ${
      upperCase(hint) || "Monsters"
    } Inc.):`,
    default: upperCase(hint),
  }),
  askAffiliationURL: (emailHint = "") => (emailHint = emailHint.match(/(?:@)(.+)/)[1] || '') && askQuestion({
    description: "Company URL:",
    default: (emailHint) ? `https://${emailHint}` : undefined,
  }),
  askEmail: async () => askQuestion({
      description: "Email (optional):",
      default: (await getConfigData("config user.email")).trim(),
  }),
  askWhichGitBranch: () => askQuestion({
    description: "Main git branch for the spec:",
    default: "main",
    pattern: /^[\w\-]+$/,
    message: "Name must be only letters and dashes",
  }),
  askWhichPreProcessor: () => askQuestion({
    description: "Spec preprocessor (respec or bikeshed):",
    default: "respec",
    pattern: /^(respec|bikeshed|bs)$/i,
  }),
};
