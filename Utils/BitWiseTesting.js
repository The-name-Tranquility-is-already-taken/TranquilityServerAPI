const ChannelBits = require(`./api/BitFlags/PermissionBitfields`).codes;
const { PerformanceObserver, performance } = require("perf_hooks");
/*
    0th bit = view channel
    1st bit = send messages
    2nd bit = manage messages
    00000000000000000000000000000000
*/
function isBitSet(b, pos) {
  return (b.field & (1 << pos)) != 0;
}
function setBit(b, pos) {
  b.field |= 1 << pos;
}
function clearBit(b, pos) {
  b.field = ~(1 << pos);
}

var ChannelObj = {
  ChannelID: "",
  Name: "",
  Description: "",
  RoleOverrides: [
    {
      RoleID: "",
      VIEW_CHANNEL: true,
      MANAGE_CHANNEL: null,
      MANAGE_PERMISSION: null,
      CREATE_INVITE: null,
      SEND_MESSAGES: true,
    },
  ],
};

var RoleObject = {
  RoleID: "",
  RoleName: "",
  Colour: { r: 255, g: 0, b: 255, a: 255 },
  Permissions: {
    VIEW_CHANNEL: true,
    MANAGE_CHANNEL: null,
    MANAGE_PERMISSION: null,
    CREATE_INVITE: null,
    SEND_MESSAGES: true,
  },
};

/*



*/

/*
let start = (new Date()).getTime()
let pog =0;
/*setBit(testing,0);
setBit(testing,1); 
var testing = {field:3};

for(var i = 0; i < 100000000; ++i)
{
    if(isBitSet(testing,0))
    {
        ++pog;
        //console.log("Conni can view the channel");
    }
    if(isBitSet(testing,1))
    {
        ++pog;
        //console.log("Conni can Send_Messages in the channel");
    }
    if(isBitSet(testing,2))
    {
        ++pog;
     //console.log("Conni can Manage_Messages the channel");
    }
}
let end = (new Date()).getTime()
var duration = end-start;
console.log(duration, "ms");
console.log(pog);




console.log(ConnisChannelPerms.field & 1<<1 );
setBit(ConnisChannelPerms,2);
clearBit(ConnisChannelPerms,1);
clearBit(ConnisChannelPerms,0);
console.log(`field = ${ConnisChannelPerms.field}`);

console.log((ConnisChannelPerms.field & ChannelBits.Manage_Messages) ? "can manage messages in the channel" : "cant manage messages");
setHexBit(ConnisChannelPerms,)
console.log(ConnisChannelPerms.field);
console.log((ConnisChannelPerms.field & ChannelBits.Manage_Messages) ? "can manage messages in the channel" : "cant manage messages");
*/
