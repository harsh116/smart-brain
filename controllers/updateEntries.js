const handleEntries = (knex) => (req, res) => {
  const { id } = req.body;
  let entries;

  knex
    .raw(
      ` update users
        set entries=entries+1
        where id=${id};
  
        select * from users
        where id=${id}
  
    `
    )
    .then((user) => {
      console.log(user[1].rows[0]);
      res.json(user[1].rows[0]);
    })
    .catch((err) => console.log("unable to get entries"));

  // let userCopy = Object.assign({}, user);
  // delete userCopy.pass;
  // return res.json(userCopy);
  // }
  // });

  // if (found) {
  // } else res.status(404).json("no such user");
};

module.exports = {
  handleEntries,
};
