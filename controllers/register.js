const { setSession } = require("../cookies/session_functions");
const { isValidEmail, isPasswordSecure } = require("../helper/helper");
const randtoken = require("rand-token");
const { decrypt, encrypt } = require("../helper/helper");
const { CIPHER_KEY } = require("../constants/constants");

const handleRegister = (knex, bcrypt) => (req, res) => {
  const getEntriesFromDeletedUser = async (email) => {
    const entries = await knex.raw(`
            select entries from deletedUsers
            where email='${email}'
        `);

    if (entries.rows.length === 0) return 0;

    return entries.rows[0].entries;
  };

  let body = req.body;
  let { pass, name } = body;
  // bcrypt.hash(pass, null, null, (err, hash) => {
  //   console.log(hash);
  //   pass = hash;
  // });

  knex
    .transaction((trx) => {
      trx
        .raw(
          `select email from login where 
                email = '${body.userName}'
              union
              select email from users where 
                email = '${body.userName}'
          `
        )
        .then(async (data) => {
          if (data.rows.length !== 0) {
            console.log("1st data: ", data);
            res
              .status(404)
              .json({ message: "user with this username already exist." });
          } else if (!isValidEmail(body.userName)) {
            res.status(404).json({ message: "Invalid email address" });
          } else if (!isPasswordSecure(pass)) {
            res
              .status(404)
              .json({ message: "Password must be of minimum 6 characters" });
          } else if (name.length > 50) {
            res
              .status(400)
              .json({ message: "name must not exceed 50 characters" });
          } else {
            pass = bcrypt.hashSync(pass);

            const entries_deleted_users = await getEntriesFromDeletedUser(
              body.userName
            );

            trx
              .raw(
                `insert into login (hash,email) values ('${pass}','${body.userName}');
                  select email from login where email = '${body.userName}';
                  
           
           
           `
              )
              .then((loginEmail) => {
                console.log(loginEmail[1].rows[0].email);
                loginEmail = loginEmail[1].rows[0].email;

                return trx
                  .raw(
                    ` insert into users (name,email,entries)
                   values ('${body.name}','${loginEmail}',${entries_deleted_users});
                   select * from users
                    where email='${loginEmail}'
  
                  `
                  )
                  .then(async (user) => {
                    const userId = user[1].rows[0].id;

                    const token = randtoken.generate(16);
                    const { encrypted_token, iv } = encrypt(token, CIPHER_KEY);
                    await setSession(userId, token, iv);

                    const data1 = await trx.raw(`
                        select max(id) as id from sessions
                        where userid='${userId}'
                        `);

                    console.log("session_id data: ", data1);
                    const session_id = data1.rows[0].id;
                    console.log("session_id: ", session_id);

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

                    let userObj = user[1].rows[0];
                    let d = userObj.joined;
                    d.setTime(d.getTime() - 1000 * 60 * d.getTimezoneOffset());
                    userObj.joined = d;
                    console.log("user[1][0]: ", userObj);

                    res.json({
                      message: "registered",
                      data: userObj,
                      cookies,
                    });
                  })
                  .catch((err) => {
                    console.log("1st: ", err);
                    res.json({ message: "unable to register" });
                    // throw Error;
                  });

                // res.json({ message: "registered", data: data[1].rows[0] });
              })

              .then(trx.commit)
              .catch(trx.rollback);
          }
        });
    })
    .catch((err) => res.json({ message: "unable to register" }));

  /* if (database.users.find((ele) => ele.userName === body.userName)) {
      res.status(404).json({ message: "user with this username already exist." });
    } else {
      let obj = {
        id: database.id.toString(),
        userName: body.userName,
        pass: pass,
        name: body.name,
        entries: 0,
        joined: new Date(),
      };
  
      // res.json('registered');
      // body["id"]=database.id.toString();
      database.id++;
      // body["entries"]=0;
      // body["joined"]=new Date();23
      database.users.push(obj);
      // console.log("new database: ", database);
      fs.writeFile("database.json", JSON.stringify(database), (err) => {
        if (err) console.log("err writing: ", err);
      });
      delete obj.pass;
      res.json({ message: "registered", data: obj }); 
    } */
};

module.exports = {
  handleRegister,
};
