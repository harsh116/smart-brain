const { setSession } = require("../cookies/session_functions");
const randtoken = require("rand-token");
const { decrypt, encrypt } = require("../helper/helper");
const { CIPHER_KEY } = require("../constants/constants");

const handleSignIn = (knex, bcrypt) => (req, res) => {
  let dataRecieved = req.body;

  // console.log("req: ", req);
  // console.log("dataRecieveed: ", dataRecieved);
  // const found = database.users.find(
  //   (ele) =>
  //     ele.userName === dataRecieved.userName &&
  //     bcrypt.compareSync(dataRecieved.pass, ele.pass)
  // );

  knex
    .raw(
      ` select email,hash from login
            where email= '${dataRecieved.userName}'
    `
    )
    .then((loginData) => {
      if (loginData.rows.length === 0) {
        res.status(404).json({ message: "This email does not exist" });
        return;
      }
      let isValidPass = bcrypt.compareSync(
        dataRecieved.pass,
        loginData.rows[0].hash
      );
      if (!isValidPass) {
        res.status(404).json({ message: "Incorrect Password" });
        return;
      }
      knex
        .raw(
          ` select * from users
              where email= '${dataRecieved.userName}'
  
             
      `
        )
        .then(async (user) => {
          const userId = user.rows[0].id;
          const token = randtoken.generate(16);
          const { encrypted_token, iv } = encrypt(token, CIPHER_KEY);
          await setSession(userId, token, iv);

          const data = await knex.raw(`
  
            select max(id) as id from sessions
            where userid='${userId}'
            `);

          console.log("session id data: ", data);

          let session_id = data.rows[0].id;

          // console.log(req.session);
          const cookies = Object.assign(
            {},
            {
              userId: userId,
              session_id,
              encrypted_token: encrypted_token,
            }
          );
          console.log("cookies: ", cookies);

          res.json({
            message: "congrats",
            data: user.rows[0],
            cookies,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json("Unable to sign in");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json("Unable to sign in");
    });

  // if (found === undefined) {
  //   res.status(404).json({ message: "error signin in" });
  // } else {
  //   let found1 = Object.assign({}, found);
  //   delete found1.pass;
  //   res.json({ message: "congrats", data: found1 });

  //   console.log("data: ", found);
  // }
};

module.exports = {
  handleSignIn,
};
