const { ONE_DAY } = require("../constants/constants");
const { knex } = require("../database/knex");

const getExpiryDate = (expdays) => {
  const d = new Date();

  d.setTime(d.getTime() + expdays * ONE_DAY);
  const timeStamp = `'${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}'`;

  return timeStamp;
};

const setSession = async (userid, encrypted_token, iv) => {
  const expDate = getExpiryDate(1);

  let res12 = await knex
    .raw(
      ` insert into sessions (userid,expiry_date,token) values('${userid}',${expDate},'${encrypted_token}');
    `
    )
    .then((data) => {
      console.log(data);
    });
};

const getSession = async (userId, session_id) => {
  const userid = userId || -1;
  const id = session_id || -1;

  const data = await knex.raw(
    ` select userid,token from sessions
            where
             userid='${userid}'
            and
            id=${id} 
            and 
            expiry_date > ${getExpiryDate(0)};
    `
  );

  console.log("current time: ", getExpiryDate(0));
  return data.rows;
};

module.exports = {
  getExpiryDate,
  getSession,
  setSession,
};
