const deleteProfile = (knex) => (req, res) => {
  const { email, id } = req.body;

  knex
    .raw(
      `
          select entries from users
           where id=${id} 
          ;  
          delete from users
          where id=${id};
          delete from login
          where email='${email}'
      `
    )
    .then(async (data) => {
      const entries = data[0].rows[0].entries;

      console.log("email while deleting: ", email);
      console.log("entries while deleting: ", entries);

      //   entries = entries.rows[0].entries;

      try {
        let deletedUserData = await knex.raw(`
            select id from deletedUsers
            where email='${email}';
          `);

        if (deletedUserData.rows.length > 0) {
          let random1 = await knex.raw(`
            update deletedUsers
            set entries=${entries}
            where email='${email}';
          `);

          console.log("success updating deletedUsers");
          res.json({ message: "Success" });
          return;
        }
      } catch (err) {
        console.log(err);
      }

      try {
        let res1 = await knex.raw(`
              insert into deletedUsers (email,entries) values
              ('${email}',${entries});
            `);

        console.log("success inserting deletedUsers");
        res.json({ message: "Success" });
      } catch (err) {
        console.log(err);
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "Unable to delete account" });
    });
};

module.exports = {
  deleteProfile,
};
