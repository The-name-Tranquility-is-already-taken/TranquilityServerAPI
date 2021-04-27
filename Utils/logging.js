require("colors");
const sendMail = require("./functions/mailer").sendMail;

logLevel = "LEGITALL";

function getLogLevelNum(level) {
    if (level == "TESTING") return 0;
    if (level == "GENERIC") return 2;
    if (level == "WARNING") return 4;
    if (level == "ERROR") return 6;
    if (level == "DEBUG") return 8;
    if (level == "ALL") return 10;

    // Debugging stuff.
    if (level == "TIMINGS") return 20;

    if (level == "LEGITALL") return 100;

    log("Unsure what log level " + level.red + " belongs to.", "GENERIC");
    return 4;
}
exports.getLogLevelNum = (level) => {
    return getLogLevelNum(level);
};

async function log(message, type = "DEBUG", callingFunction = "N/A") {
    if (getLogLevelNum(type) > getLogLevelNum(logLevel)) {
        return;
    }

    maxSize = 55;

    time = getDateTime().yellow;

    if (callingFunction == "N/A") {
        StartMessage = `[${time}] - [`;
    } else {
        StartMessage = `[${time}] - [${callingFunction.blue}] - [`;
    }

    if (type == "ERROR") {
        StartMessage += type.red;
        sendMail(process.env.ADMIN_EMAIL,
            `
    Time: ${getDateTime()}
    <br>
    <br>
    <div>
    ${message}
    </div>
    `,
            "Tranquility - Server API Error"
        );
    } else if (type == "WARNING") StartMessage += type.blue;
    else if (type == "GENERIC") StartMessage += type.green;
    else if (type == "DEBUG") StartMessage += type.gray;
    else if (type == "TESTING") StartMessage += type.magenta;
    else StartMessage += type.blue;

    StartMessage += `] `;

    left = maxSize - StartMessage.length;

    function balence() {
        tmp = "";
        space = " ";
        while (left >= 0) {
            left = left - 1;
            tmp = tmp + space;
        }
        return tmp;
    }
    console.log(StartMessage + balence() + "-> " + message);
}
exports.log = async(message, type = "DEBUG", callingFunction = "N/A") => {
    log(message, type, callingFunction);
};

exports.error = async(message, callingFunction = "N/A") => {
    log(message, "ERROR", callingFunction);
}

exports.warning = async(message, callingFunction = "N/A") => {
    log(message, "WARNING", callingFunction);
}

exports.debug = async(message, callingFunction = "N/A") => {
    log(message, "DEBUG", callingFunction);
}

function char_count(str, letter) {
    var letter_Count = 0;
    for (var position = 0; position < str.length; position++) {
        if (str.charAt(position) == letter) {
            letter_Count += 1;
        }
    }
    return letter_Count;
}
exports.char_count = (str, letter) => {
    return char_count(str, letter);
};

function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + " - " + hour + ":" + min + ":" + sec;
}
exports.getDateTime = () => {
    return getDateTime();
};