var View_Channel  = 0x001;
var Send_Messages = 0x010;
var Ping_Messages = 0x100

var Connis_Channel_Perms = 0x011;

if(Connis_Channel_Perms & View_Channel)
{
    console.log("COnni can view the channel");
}
if(Connis_Channel_Perms & Send_Messages)
{
    console.log("COnni can speak in the channel");
}
if(Connis_Channel_Perms & Ping_Messages)
{
    console.log("COnni can ping in the channel");
}
