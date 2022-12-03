import { getConfigData } from "./git.js";
import path from "node:path";
import prompt from "node:prompt";

prompt.message = " 👉 ";
prompt.delimiter = "";

const upperCase = async (word) => Promise.resolve(word.charAt(0).toUpperCase() + word.slice(1))
  .catch((err) => { throw new TypeError(`Expected string got ${typeof word}: ${err}`); });

export const askQuestion = (promptOps) => new Promise((resolve, reject) =>
      prompt.get(promptOps, (cancel, res) => (cancel) 
          ? reject(new Error(" 🙅 User canceled."));
          : resolve(res.question)));

export const Prompts = {
  askQuestion, askRepoName: () => askQuestion({
    description: "Name of Git repository:",
    default: path.basename(process.cwd()),
    type: "string", before: (value) => value.trim(),
  }),
  askProjectName: (repo) => askQuestion({
    description: "Name of project:",
    default: `The ${upperCase(repo)} API`,
    type: "string", before: (value) => value.trim(),
  }),
  askUserName: async () => askQuestion({
    description: "Name of Primary Editor of the spec:",
    default: (await getConfigData("config user.name")).trim(),
    type: "string", before: (value) => value.trim(),
  }),
  askAffiliation(hint = "") {
    const promptOps = {
      description: `Company affiliation(e.g., ${
        upperCase(hint) || "Monsters"
      } Inc.):`,
      default: upperCase(hint),
      type: "string", before: (value) => value.trim(),
    };
    return this.askQuestion(promptOps);
  },
  askAffiliationURL(emailHint = "") {
    const [, hint] = emailHint.match(/(?:@)(.+)/);
    const promptOps = {
      description: "Company URL:",
      type: "string", before: (value) => value.trim(),
    };
    if (hint) {
      promptOps.default = `https://${hint}`;
    }
    return this.askQuestion(promptOps);
  },
  async askEmail() {
    const email = await getConfigData("config user.email");
    const promptOps = {
      description: "Email (optional):",
      default: email.trim(),
      type: "string", before: (value) => value.trim(),
    };
    return this.askQuestion(promptOps);
  },
  askWhichGitBranch() {
    const promptOps = {
      description: "Main git branch for the spec:",
      default: "main",
      pattern: /^[\w\-]+$/,
      message: "Name must be only letters and dashes",
      type: "string", before: (value) => value.trim(),
    };
    return this.askQuestion(promptOps);
  },
  askWhichPreProcessor() {
    const promptOps = {
      description: "Spec preprocessor (respec or bikeshed):",
      default: "respec",
      pattern: /^(respec|bikeshed|bs)$/i,
      type: "string", before: (value) => value.trim(),
    };
    return this.askQuestion(promptOps);
  },
};
