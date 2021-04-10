"use strict";
const { UniqueID } = require('nodejs-snowflake');
const config =
{
    returnNumber: false,
    customEpoch: 1617278400 // the servers EPOCH time (the time we first created the repo)
};
const uid = new UniqueID(config);

module.exports.GenerateID = () => {
    return uid.getUniqueID();
}

module.exports.getStringText = (SnowFlake) => {

    var timestamp = uid.getTimestampFromID(SnowFlake);

}