// Have number gaps so its easier to reorder them without changing all the
// values
exports.dataFormats = {
  ALL : 1,
  ADMIN : 3,
  USER : 5,
  BOT : 7,
  PUBLIC : 9,
  NONE : 11,
};

/**
 * Used to format the raw member data of a member
 * @param {JSON} MemberData The unformatted user data
 * @param {number} PermissionLevel Permission level of the
 *     user that is seeing this data
 * @returns {JSON} Formatted member data
 */
exports.formatMemberData = (MemberData, PermissionLevel) => {
  var out = {};

  switch (PermissionLevel) {
  case this.dataFormats.ALL:
    return MemberData;

  case this.dataFormats.ADMIN:
    Object.assign(out, {
      hash : MemberData.hash,
    });

  case this.dataFormats.USER:
    Object.assign(out, {
      phoneNumber : MemberData.phoneNumber,
      email : MemberData.email,
      guilds : MemberData.guilds,
    });

  case this.dataFormats.BOT:
    Object.assign(out, {});

  case this.dataFormats.PUBLIC:
    Object.assign(out, {
      id : MemberData.id,
      tag : MemberData.tag,
      createdDate : MemberData.createdDate,
    });
    break;

  case this.dataFormats.NONE:
    out = {};
  }
  return out;
};
