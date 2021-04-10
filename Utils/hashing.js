
const monitor = require("./monitor");
const logging = require("./logging");
const bcrypt = require('bcrypt');

var saltRounds = 8;

function hashTiming(curSalt) {
    let startTimestamp = (new Date()).getTime();

    // Generate Salt
    const salt = bcrypt.genSaltSync(curSalt);

    // Hash Password
    bcrypt.hashSync("fdsbtyuktrdfghytr", salt); 
    
    return (new Date()).getTime()-startTimestamp;
}

module.exports.setup = () => {
    var timeTaken = -1;

    var maxTimeAllowed = 1000;
    var leaway = 150;

    var bestRounds  = -1;
    var bestTiming  = -1;

    for(var curSalt = 1;curSalt <= 1000; ++curSalt) {
        
        var test1 = hashTiming(curSalt);
        var test2 = hashTiming(curSalt);
        var test3 = hashTiming(curSalt);

        timeTaken = test1 + test2 + test3;
        timeTaken /= 3;
        timeTaken = Math.round(timeTaken);

        console.log(`testing ${curSalt} - times taken: ${test1}ms, ${test2}ms, ${test3}ms - average: ${timeTaken}ms`);

        if(timeTaken <= maxTimeAllowed + leaway) {
            if(timeTaken > bestTiming) {
                bestRounds  = curSalt;
                bestTiming  = timeTaken;
            }
        } else {
            break;
        }
    }
    console.log(`Setting salt rounds to ${bestRounds} - time taken: ${bestTiming}ms`)
    saltRounds = bestRounds;
}

const hash = (text) => {
    
    let startTimestamp = (new Date()).getTime();

    // Generate Salt
    const salt = bcrypt.genSaltSync(saltRounds);

    // Hash Password
    const hash = bcrypt.hashSync(text, salt); 
    
    let end = (new Date()).getTime()
    var duration = end-startTimestamp;

    logging.log(`Taken: ${duration}ms - salt: ${salt} - hash: ${hash}`, "TIMINGS");
    monitor.log("hashing", duration);

    return hash;
};

module.exports.hash = (text) => {
    return(hash(text));
}