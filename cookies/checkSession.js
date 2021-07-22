const { getSession } = require("./session_functions");
const { CIPHER_KEY } = require("../constants/constants");
const { decrypt } = require("../helper/helper");

const redirectLogin = (knex) => async (req, res, next) => {
  const { userId, session_id, encrypted_token } = req.body;
  // console.log(req.session);

  console.log("userid: ", userId);
  console.log("session_id: ", session_id);
  console.log("encrypted token: ", encrypted_token);

  const result = await getSession(userId, session_id);
  console.log("result: ", result);

  // const found_SessionId=result.find

  if (!userId || result.length === 0) {
    console.log("redirectLogin req: ", req.body);
    console.log("inactive");
    res.json({ message: "sessionInactive" });
  } else {
    console.log("active");

    const { token } = result[0];

    console.log("initial token: ", token);

    const decrypted_token = decrypt(encrypted_token, CIPHER_KEY);

    console.log("decrypted_token: ", decrypted_token);

    if (token !== decrypted_token) {
      console.log("session token not matched");
      res.json({ message: "error" });
      return;
    }

    knex
      .raw(
        `select * from users
            where id=${userId};      
      `
      )
      .then((user) => {
        res.json({ message: "sessionActive", user: user.rows[0] });
      })
      .catch((err) => {
        console.log(err);
        res.json({ message: "sessionInactive" });
      });
  }
};

module.exports = {
  redirectLogin,
};
