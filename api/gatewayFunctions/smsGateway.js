/**
 * Gateway used to start the process of verifying ownership of a phone number
 * @param {*} req 
 * @param {*} res 
 */
exports.verifPhone = async(req, res) => {
    let startTimestamp = new Date().getTime();

    var response = await phoneFunctions.setupPhone2FA(req.params.MemberID).catch((err) => {
        console.log("ERR: ", err);
        res.status(codes.Bad_Request);
        return ("err");
    });

    if (response == "err") {
        res.status(codes.Bad_Request);
    } else {
        res.status(codes.Ok);
    }
    res.json({ response: response });

    monitoring.log("verifPhone", new Date().getTime() - startTimestamp);
};

/**
 * Gateway used to verify the ownership of a phone number
 * @param {*} req 
 * @param {*} res 
 */
exports.newSMS = async(req, res) => {
    let startTimestamp = new Date().getTime();

    var response = await phoneFunctions.setupPhone2FA(req.params.MemberID).catch((err) => {
        console.log("ERR: ", err);
        return ("err");
    });

    if (response == "err") {
        res.status(codes.Bad_Request);
    } else {
        res.status(codes.Ok);
    }
    res.json({ response: response });

    monitoring.log("verifPhone", new Date().getTime() - startTimestamp);
};