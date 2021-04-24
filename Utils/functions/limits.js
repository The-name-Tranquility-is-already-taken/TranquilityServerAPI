var maxChannelNameLength = 25;


/**
 * Used to validate a channel name
 * @param {*} channelName 
 * @returns valid channel name and output actions taken to the string.
 */
exports.channelName = (channelName) => {
    var cleanedChannelName = channelName;
    var actionsTaken = {
        shortenChannelName: false,
        replacedSpacesWithChar: false,
    };
    var isChanged = false;

    // shorten the channel name if its to long!
    // Done first to prevent large strings crashing the server.
    if (cleanedChannelName.length > maxChannelNameLength) {
        //console.log("To long by", cleanedChannelName.length - maxChannelNameLength, "letters.");
        actionsTaken.shortenChannelName = true;
        isChanged = true;

        cleanedChannelName = cleanedChannelName.substr(0, maxChannelNameLength);
    }

    // Check each letter for disallowed chars.
    // And add - instead of spaces.
    var builtString = "";
    var lastCharHypen = "";
    cleanedChannelName.split("").forEach(letter => {
        if (letter == " ") {
            letter = "-";
            if (lastCharHypen) letter = "";
            lastCharHypen = true;
            actionsTaken.replacedSpacesWithChar = true;
            isChanged = true;
        } else {
            lastCharHypen = false;
        }


        builtString += letter;

    });
    cleanedChannelName = builtString;


    return {
        cleaned: cleanedChannelName,
        actions: actionsTaken,
        modified: isChanged,
    }
}

console.log(this.channelName("Ge  eral Char 1"));