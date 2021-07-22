const knex = require("knex")({
  client: "pg",
  connection: {
    // host: "127.0.0.1",
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    
    
    
  },
});

module.exports = {
  knex,
};
