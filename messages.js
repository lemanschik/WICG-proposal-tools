const { b, g, gr, r, y, m, underline, blueUnderlineBold } = await import("./chalk.js");

export const finished = `
${underline("NEXT STEPS")}

Congrats! You are ready to start. Please push everything up to GitHub
when you are ready.

Please review the files that were just added to this directory.

If you are new to spec writing or the WICG, we strongly encourage you to read:

  ⭐ Contributing New Proposals:
    ${b("https://github.com/WICG/admin#contributing-new-proposals")}

  ⭐️ API Design Principles:
    ${b("https://w3ctag.github.io/design-principles/")}

  ⭐️ Writing Promise-Using Specs:
    ${b("http://www.w3.org/2001/tag/doc/promises-guide")}

Prost, Be Salamati, Nastrovje, Good luck, Perhajr, Masel tov! 🐼
`;

const wicgURL = blueUnderlineBold("https//wicg.io");
const wicgTitle = y("Web Incubator Community Group");
const W3C = `${gr(">--=")} ${b("W")} * ${gr("3")} * ${b("C")} ${gr("=--<")}`;
export const logo = `
    ${y(" __      __")}${r(".___")}${m("_________")}${g("   ________")}        ${W3C}
    ${y("/  \\    /  \\")}${r("   \\")}${m("_   ___ \\")}${g(" /  _____/")}
    ${y("\\   \\/\\/   /")}${r("   /")}${m("    \\  \\/")}${g("/   \\  ___")}   ${wicgTitle}
    ${y(" \\        /")}${r("|   \\")}${m("     \\___")}${g("\\    \\_\\  \\")}
    ${y("  \\__/\\  /")}${r(" |___|")}${m("\\______  /")}${g("\\______  /")}         ${wicgURL}
    ${y("       \\/")}              ${m("\\/")}        ${g("\\/")}

This utility creates the basic files you need to get started.
It guesses sensible defaults based on your git setup.

Press ^C at any time to quit.
`;

export const example = `
ℹ️ A utility to get you started writing WICG specs.

Example:

  wicg init "My Awesome Proposal or Idea"

More info at: ${b("https://wicg.io")} | bugs: ${b("https://github.com/WICG/starter-kit")}
`;
