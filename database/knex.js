const knex = require("knex")({
  client: "pg",
  connection: {
    // host: "127.0.0.1",
    connectionString:
      process.env.DATABASE_URL ||
      "postgres://uqvfyumt:hx08eQNWBRat-Pe6apYj6VElMTGYDYjh@arjuna.db.elephantsql.com/uqvfyumt",
    ssl: { rejectUnauthorized: false },
  },
});

module.exports = {
  knex,
};
