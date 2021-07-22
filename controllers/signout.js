const handleSignout = (knex) => (req, res) => {
  console.log("signout");

  const { userId, session_id } = req.body;

  console.log("userID: ", userId);

  knex
    .raw(
      ` delete from sessions
               where userid='${userId}'
               and id=${session_id}
               ;
    `
    )
    .then((data) => {
      console.log(data);
    })
    .catch(console.log);

  // req.session.destroy((err) => {
  //   console.log(err);
  // });

  // res.clearCookie(SESS_NAME);

  // console.log("clearCookie: ", req.session);

  res.json({ message: "logged out" });
};

module.exports = {
  handleSignout,
};
