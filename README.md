# TranquilityServerAPI

Backend API For Tranquility,
<br>
Fully documented api including,
<br>
Authentication API - (Currently no standalone solution)
<br>
Guild/Messages/User API

[![DeepScan grade](https://deepscan.io/api/teams/13554/projects/16524/branches/357480/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=13554&pid=16524&bid=357480)

## Formatting

- For all HTTP Parmas the varible names have to be uppercase such that,
  req.params.MemberID `/guild/:MemberID/:GuildID/:GuildInvite`

# Documentation

### Member API
https://documenter.getpostman.com/view/14329009/TzCL7ntF

### Guild API
https://documenter.getpostman.com/view/14329009/TzCQbRuk

### Auth API
https://documenter.getpostman.com/view/14329009/TzJx8wKc

## Configuration

Tranquilitys api is configured using  2 config files including the following .env variables.

| Name | Description | Default | Required |
| ---- | ----------- | ------- | -------- |
| PORT | HTTP Port for the application | 322 | True |
| mongodb | URL for the mongoDB database connection | N/A | True |
| ADMIN_EMAIL | Administration email to send logging info etc to | N/A | False |
| EMAIL | Sender email for 2FA, account confirmation etc | N/A | False |
| TWILIO_SENDING_NUMBER | Twilio phone number for 2FA, account confirmation etc | N/A | False |
| TWILIO_ACCOUNT_SID | Twilio account SID | N/A | False |
| TWILIO_ACCOUNT_AUTH_TOKEN | Twilio auth token | N/A | False |
| SALT_ROUNDS | Salt rounds for hashing( larger > more secure but longer run times) | 13 |  True |

and also a config.js
```js
exports.conf = {
    channelName_Checks: {
        shortenChannelName: true,      // Default: true
        
        // Forces channel names to not contain spaces, such that they are replaces with a defined char 
        replaceSpacesWithChar: true,   // Default: true
    },
    messageText_Checks: {
        // Limit how large a single message can be.
        lengthLimit: true,             // Default: true
        maxLength: 100,                // Default: true
    },
    monitoring: {
        // Should the monitoring server echo statistics every X second to the attached console.
        outputStats: false,            // Default: true
        outputStatsEvery: 10000,       // Default: 10000 ms eg 10 Seconds
    }
}
```
