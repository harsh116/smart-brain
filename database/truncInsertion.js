const { knex } = require("./knex");

const truncInsertion = async (table, mainCol, cols, values) => {
  let updateString = "";

  for (let i = 0; i < cols.length; i++) {
    updateString += cols[i];
    updateString += "=";
    updateString += values[i];

    if (i !== cols.length - 1) updateString += ",";
  }

  let insertColsString = cols.join(",");
  let insertValuesString = values.join(",");

  const mainValue = values[cols.indexOf(mainCol)];

  try {
    const recordPresent = await knex.raw(`  
            select ${mainCol} from ${table}
            where ${mainCol}=${mainValue};
        `);

    if (recordPresent.rows.length) {
      let res2 = await knex.raw(`  
                update ${table}
                set ${updateString}
                where ${mainCol}=${mainValue};
            `);
    } else {
      let res1 = await knex.raw(`
            insert into ${table} (${insertColsString})
            values (${insertValuesString})
        `);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  truncInsertion,
};
