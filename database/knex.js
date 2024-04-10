const knex = require("knex")({
  client: "pg",
  connection: {
    // host: "127.0.0.1",
    connectionString:
      process.env.DATABASE_URL ||
      // "postgres://uqvfyumt:hx08eQNWBRat-Pe6apYj6VElMTGYDYjh@arjuna.db.elephantsql.com/uqvfyumt",
      "postgresql://neondb1_owner:Q3qrfKDxlwh0@ep-late-sea-a2u4c2qe.eu-central-1.aws.neon.tech/neondb1",
    ssl: { rejectUnauthorized: false },
  },
});

module.exports = {
  knex,
};
