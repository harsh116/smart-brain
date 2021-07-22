const updateProfile = (knex, bcrypt) => (req, res) => {
  const { type, data, id, email } = req.body;

  if (type === "name") {
    if (data.length > 50) {
      res.status(400).json({ message: "name must not exceed 50 characters" });
      return;
    }

    knex
      .raw(
        `
        update users
        set name='${data}'
        where id=${id};
  
        select * from users
        where id=${id};
  
      `
      )
      .then((user) => {
        console.log("name changed");
        res.json({ message: "success", data: user[1].rows[0] });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ message: "Could not update name" });
      });
  } else if (type === "password") {
    if (data.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be of minimum 6 characters" });
    }

    const newPassword = bcrypt.hashSync(data);

    knex
      .raw(
        `
        update login
        set hash='${newPassword}'
        where email='${email}'
      `
      )
      .then((data) => {
        console.log("password changed");
        res.json({ message: "success" });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ message: "Could not update password" });
      });
  }
};

module.exports = {
  updateProfile,
};
