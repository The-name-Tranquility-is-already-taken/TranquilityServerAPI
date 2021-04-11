var data = [
  {
    name : "hashing",
    data : [],
    averageTimes : {
      all : -1, // Time in ms
    },
    totalTime : 0,
    callCount : 0,
  },
];

module.exports.output = () => {
  data.forEach((entry) => {
    console.log("-----------------------");
    console.log(entry.name);
    console.log(`Average Times: ${entry.averageTimes.all}ms`);
    console.log(`Total Time: ${entry.totalTime}ms`);
    console.log(`Called: ${entry.callCount} times`);
  });
};

module.exports.log = (module_t, timeTaken) => {
  var i = 0;
  var found = false;
  data.forEach((e) => {
    if (e.name == module_t) {
      var shouldHalf = false;
      if (data[i].averageTimes.all != -1)
        shouldHalf = true;

      // Submit data
      data[i].data.push({timeTaken : timeTaken});
      data[i].averageTimes.all += timeTaken;
      data[i].totalTime += timeTaken;
      data[i].callCount += 1;

      if (shouldHalf) {
        data[i].averageTimes.all /= 2;
      }
      found = true;
    }
  });
  if (!found) {
  }
};
