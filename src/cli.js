#!/usr/bin/env node

const minimist = require("minimist");
const ora = require("ora");
const chalk = require("chalk");

const unitGolf = require("./index");

const args = minimist(process.argv.slice(2));

const {
  _: [input],
  tolerance,
  width,
  height
} = args;

const spinner = ora();
spinner.start();

const renderOffset = offset => {
  if (offset === 0) return "";
  return `(${(offset > 0 ? "+" : "") + offset}px)`;
};

const renderBest = option => {
  const { string, pixelOffset } = option;
  return [
    chalk.hex("#8bc34a").bold(`⛳  ${string}`),
    chalk.green(renderOffset(pixelOffset))
  ].join(" ");
};

const renderRest = option => {
  const { string, pixelOffset } = option;
  return [string, renderOffset(pixelOffset)].join(" ");
};

unitGolf({ input, tolerance, width, height }).then(([best, ...rest]) => {
  spinner.stop();
  console.log("");
  console.log(renderBest(best));
  console.log("");
  console.log(rest.map(renderRest).join("\n"));
  console.log("");
});
