const chalk = await import("chalk");
export const b = chalk.default.blue.bind(chalk);
export const g = chalk.default.green.bind(chalk);
export const gr = chalk.default.gray.bind(chalk);
export const m = chalk.default.magenta.bind(chalk);
export const r = chalk.default.red.bind(chalk);
export const y = chalk.default.yellow.bind(chalk);
export const underline = chalk.default.underline.bind(chalk);
export const heading = (text) => chalk.default.underline(`\n${text.toUpperCase()}\n`);
export const blueUnderlineBold = (text) => chalk.default.blue.underline.bold(text)
