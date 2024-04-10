const handleVerfiedSeen = (knex) => async (req, res) => {
  const { email } = req.body;

  try {
    await knex.raw(`
        update users
        set verified_seen=true
        where email='${email}'
        `);

    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.json({ message: "There was some problem" });
  }
};

module.exports = {
  handleVerfiedSeen,
};
