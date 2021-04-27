# TranquilityServerAPI

[![DeepScan grade](https://deepscan.io/api/teams/13554/projects/16524/branches/357480/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=13554&pid=16524&bid=357480)

# # Formatting

- For all HTTP Parmas the varible names have to be uppercase such that,
  req.params.MemberID `/guild/:MemberID/:GuildID/:GuildInvite`

## Configuration

Tranquilitys server api is configured using the following .env variables.

| Name | Description | Default |
| ---- | ----------- | ----- |
| PORT | HTTP Port for the application | 322 |
| mongodb | URL for the mongoDB database connection | N/A |
| ADMIN_EMAIL | Administration email to send logging info etc to | N/A |
| EMAIL | Sender email for 2FA, account confirmation etc | N/A |
| TWILIO_SENDING_NUMBER | Twilio phone number for 2FA, account confirmation etc | N/A |
| TWILIO_ACCOUNT_SID | Twilio account SID | N/A |
| TWILIO_ACCOUNT_AUTH_TOKEN | Twilio auth token | N/A |
