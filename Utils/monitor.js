var config = require("./../config").conf;

const logging = require("@connibug/js-logging");
logging.setupMail("mail.spookiebois.club", 587, process.env.EMAIL, process.env.EMAIL_PASS);

const template = (name_t) => ({
  name: name_t,
  data: [],
  averageTimes: {
    all: -1, // Time in ms
  },
  totalTime: 0,
  callCount: 0,
});

var data = [];

/**
 * Used for formatting and outputing hash times.
 */
exports.output = () => {
  data.forEach((entry) => {
    console.log("-----------------------");
    console.log(entry.name);
    console.log(`Average Times: ${entry.averageTimes.all}ms`);
    console.log(`Total Time: ${entry.totalTime}ms`);
    console.log(`Called: ${entry.callCount} times`);
  });
};

/**
 * I think its pure jank but i cant tell.
 * @param {String} Name the name of the dataset i think :|
 * @returns
 */
function getSpecificDataSet(name) {
  var Times = [];
  var Ms = [];
  data.forEach((entry) => {
    // console.log("Entry name: ", entry.name, " - ", name);
    if (entry.name == name) {
      // console.log("Pushing");
      var i = 0;
      entry.data.forEach((r) => {
        Times.push(entry.data[i].timeStamp);
        Ms.push(entry.data[i].timeTaken);
        ++i;
      });
    }
  });
  // console.log(data);
  // console.log([ Times, Ms ]);
  return [Times, Ms];
}

/**
 * Used by api 
 */
exports.data = (req, res) => {
  var colours = [
    {
      bg: "rgb(255, 99, 132)",
      border: "rgb(255, 99, 132)",
    },
  ];

  var curColour = 0;

  function createDataSet(label, times) {
    return {
      label: label,
      backgroundColor: colours[curColour].bg,
      borderColor: colours[curColour].border,
      data: times,
    };
  }

  var all = [];

  var dat = getSpecificDataSet(req.body.target);
  var times = dat[0];

  //console.log(times);
  var dataSet = createDataSet(
    req.body.target,
    getSpecificDataSet(req.body.target)[1]
  );
  //console.log(dataSet);

  all.push(dataSet);

  //console.log("All:",all[0]);

  res.json({ all: all[0], times: times });
};

/**
 * Something
 */
exports.log = async (module_t, timeTaken) => {
  timeTaken = parseInt(timeTaken);

  var i = 0;
  var found = false;
  data.forEach((e) => {
    if (e.name == module_t) {
      var shouldHalf = false;
      if (data[i].averageTimes.all != -1) shouldHalf = true;

      // Submit data
      data[i].data.push({ timeTaken: timeTaken, timeStamp: getDateTime() });
      data[i].averageTimes.all += timeTaken + 1;
      data[i].totalTime += timeTaken;
      data[i].callCount += 1;

      if (shouldHalf) {
        data[i].averageTimes.all /= 2;
      }
      found = true;
    }
    ++i;
  });
  if (!found) {
    data.push(template(module_t));
    this.log(module_t, timeTaken);
  }
};

/**
 * Gets the current date and outputs it as a string for use when logging.
 * @returns {String} Outputs the current time
 */
function getDateTime() {
  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  // var year = date.getFullYear();

  // var month = date.getMonth() + 1;
  // month = (month < 10 ? "0" : "") + month;

  // var day = date.getDate();
  // day = (day < 10 ? "0" : "") + day;

  return (
    /*year + ":" + month + ":" + day + " - " + */ hour + ":" + min + "." + sec
  );
}

function calculateVariance(dataSet, mean) {
  variance = 0;
  
  for(var i = 0; i <= dataSet.length(); i++) {
    // subtract mean from each number, square the result
    dataSet[i] -= mean;
    dataSet[i] *= dataSet[i];

    // Average the result
    variance += dataSet[i];
    variance /= 2;
   }
  return variance;
}
if (config.monitoring.outputStats) {
  setInterval(function () {
    console.log(
      "------------------------------------------------------------------------------------"
    );
    data.forEach((entry) => {
      console.log("");
      logging.log(`| ${entry.name} x${entry.callCount}`);
      logging.log(`--- Average Times: ${entry.averageTimes.all}ms`);
      logging.log(
        `--- Variance: + ${
          entry.averageTimes.all * entry.callCount - entry.totalTime
        }ms`
      );
      logging.log(`--- Total Time: ${entry.totalTime}ms`);
      logging.log(`--- Called: ${entry.callCount} times`);
    });
    console.log(
      "------------------------------------------------------------------------------------"
    );
  }, config.monitoring.outputStatsEvery);
}
