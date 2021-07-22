const handleProfileGet = (knex) => (req, res) => {
  const { id } = req.params;
  // const found = database.users.find((user) => user.id === id);

  knex
    .raw(
      `
          select * from users where id=${id}
    `
    )
    .then((user) => {
      // console.log(user);
      if (user.rows.length === 0) res.status(404).json("no such user");
      else res.json(user.rows[0]);
    });
};

module.exports = {
  handleProfileGet,
};
