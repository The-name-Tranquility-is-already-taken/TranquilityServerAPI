const logging = require("./logging")

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
var times = [];

module.exports.output = () => {
  data.forEach((entry) => {
    console.log("-----------------------");
    console.log(entry.name);
    console.log(`Average Times: ${entry.averageTimes.all}ms`);
    console.log(`Total Time: ${entry.totalTime}ms`);
    console.log(`Called: ${entry.callCount} times`);
  });
};

function flipArray(array) {
  console.log(array.length);
}

function getSpecificDataSet(name) {
  var Times = [];
  var Ms = [];
  // data.forEach((entry) => {
  //   if(entry.name == name) {
  //     var i = 0;
  //     entry.data.forEach(e => {
  //       Times.push(entry.data[i].timeStamp);
  //       Ms.push(entry.data[i].timeTaken);
  //       ++i;  
  //     });
  //   }
  // });

  return(Ms);
}

module.exports.data = (req, res) => {
  var colours = [
    {
      bg: 'rgb(255, 99, 132)',
      border: 'rgb(255, 99, 132)'
    }
  ]
  
  var curColour = 0;
  function createDataSet(label, times) {
    return({
      label: label,
      backgroundColor: colours[curColour].bg,
      borderColor: colours[curColour].border,
      data: times,

    })
  }

  var all = [];
  [
    // {
    //     label: 'login - valid',
    //     backgroundColor: 'rgb(255, 99, 132)',
    //     borderColor: 'rgb(255, 99, 132)',
    //     data: Object.entries(times).map( (item) => item[1]),
    // }
  ];

  data.forEach((entry) => {
    all.push(createDataSet(entry.name, getSpecificDataSet(entry.name)));

  });

  console.log("-------------------------------------------------------------------");
  console.log(times);
  // console.log(data);
  
  var fTimes = [];

  times.forEach(time => {
    logging.log(`Building for: ${time}`);
    fTimes.push(time);
    data.forEach(entry => {
      logging.log(`Checking - ${entry.name}`);
      var foundOne = false;
      entry.data.forEach(timeRecord => {
        if(timeRecord.timeStamp == time) {
          logging.log(`Had entry- ${time}`);
          if(foundOne) {
            logging.log("Had multiple!!!!!", "ERROR");
            return;
          }
          foundOne = true;
          var vvvv = 0;
          all.forEach(thing => {
            if(thing.label == entry.name) {
              console.log("Time: ", timeRecord.timeTaken);
              all[vvvv].data.push(timeRecord.timeTaken);
            }
            ++vvvv;
          });
        }
      });

      if(!foundOne) {
        console.log(entry.name + " -Didnt have a record.")
        var vvvv = 0;
        all.forEach(thing => {
          if(thing.label == entry.name) {
            console.log("Time: ", "NA");
            all[vvvv].data.push(0);
            console.log("Should have added a black record:", all[vvvv].data);
          }
          ++vvvv;
        });
      }
    });
  });
  
  console.log(fTimes);
  console.log(all);

  //all.push(createDataSet("Valid Logins", getSpecificDataSet("login - valid")));

  //console.log({ all: all, times: times });
  res.json({ all: all, times: times });


};

module.exports.log = async (module_t, timeTaken, timeStamp_t = new Date().getTime()) => {
  timeTaken = parseInt(timeTaken);

  var i = 0;
  var found = false;
  data.forEach((e) => {
    if (e.name == module_t) {
      console.log("New log: ", module_t, " - ", timeTaken );
      times.push(timeStamp_t);
    
      var shouldHalf = false;
      if (data[i].averageTimes.all != -1) shouldHalf = true;

      // Submit data
      data[i].data.push({ timeTaken: timeTaken, timeStamp: timeStamp_t });
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
    this.log(module_t, timeTaken, timeStamp_t);
  }
};

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

  return /*year + ":" + month + ":" + day + " - " + */hour + ":" + min + "." + sec;
}
