"use strict";
// Declare snowflakey
const snowflakey = require("snowflakey");
// Create the worker instance
const Worker = new snowflakey.Worker({
  name: "TESTING",
  epoch: 1617278400,
  workerId: process.env.CLUSTER_ID || 1,
  processId: process.pid || undefined,
  workerBits: 8,
  processBits: 0,
  incrementBits: 14,
});

/**
 * Generate a unique snowflake for use in any way seen fit.
 * @returns {string} Unique snowflake
 */
module.exports.GenerateID = () => {
  const flake = Worker.generate();
  console.log(`Created snowflake: ${flake}`);
  console.log(
    `Creation date    : ${snowflakey.lookup(flake, Worker.options.epoch)}`
  );
  console.log(
    `Deconstructed    : ${Worker.deconstruct(flake).timestamp.valueOf()}`
  );

  return flake;
};

/**
 * Convert snowflake to string Date/Time
 * @param {string} SNowflake A Snowflake genrated using GenerateID()
 * @returns {string} Date/Time of snowflake creation
 */
module.exports.getString = (Snowflake) => {};
