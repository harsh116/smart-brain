const nodemailer = require("nodemailer");
const { knex } = require("./database/knex");
const { truncInsertion } = require("./database/truncInsertion");
const { getExpiryDate } = require("./cookies/session_functions");
const { SERVER_HOST, CLIENT_HOST } = require("./constants/constants");

const randtoken = require("rand-token");

const nodeMailerSMTP = () => async (req, res) => {
  const { email } = req.body;

  //true or false
  let verifiedUserStatus = await knex.raw(`
    select verified from users
    where email='${email}'
  `);

  if (
    verifiedUserStatus.rows.length > 0 &&
    verifiedUserStatus.rows[0].verified === true
  ) {
    console.log("email already verified");
    res.json({ message: "already verified" });
    return;
  }

  //   let testAccount = await nodemailer.createTestAccount();
  const host = "smtp.elasticemail.com";
  const port = 2525;
  const fromEmail = "fullstar9275@outlook.com";
  const fromName = "smart-brain";
  const pass = "0C69B9111D5821E7424221CD22BCB5BEA887";
  const emailSubject = "Complete your registration";

  const toEmail = email;

  // Generate a 16 character alpha-numeric token:
  const token_key = randtoken.generate(16);

  let res2 = await truncInsertion(
    "emailauthentication_token",
    "email",
    ["email", "token_key", "expiry_date"],
    [`'${email}'`, `'${token_key}'`, getExpiryDate(3)]
  );

  //   try {
  //     let res1 = await knex.raw(`
  //         insert into emailauthentication_token (email,token_key,expiry_date)
  //         values ('${email}','${token_key}',${getExpiryDate(3)});
  //       `);
  //   } catch (err) {
  //     console.log(err);
  //   }

  const textMessage = "Click the confirmation link to proceed furthur";
  const redirectingLink = `${SERVER_HOST}/checkAuthenticationToken?token_key=${token_key}`;

  const html = `    
  <h1><center>Finish creating your account</center></h1>
  <br>
  <p>Hey There,</p>
  <br>
  <p>Your email address has been registered with ${fromName}.
   To validate your account and increase your usage limit, please click on the button below.</p>
  <br>
  <br>
  <div style="max-width: fit-content ;margin: 0 auto">
  <button style="background-color: blue; margin: 0 auto; color: white; padding: 1rem; border: none;border: 1px solid blue ; border-radius: 0.5rem"  ><a style="color: white; text-decoration: none"
   href="${redirectingLink}" target="_blank"
  >
      Confirm my email address
  </a></button>
  </div>

    `;

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: false,
    // service: "gmail",
    auth: {
      user: fromEmail,
      pass: pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,

      subject: emailSubject,
      text: textMessage,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.json({ message: "congrats" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "There is some error please try again" });
  }

  console.log("token key: ", token_key);
  //   res.json({ message: "congrats", token_key });
  //   res.send(html);
};

const nodemailerCheckToken = () => async (req, res) => {
  const { token_key } = req.query;
  console.log("token_key get: ", token_key);

  try {
    let tokenKeyPresent = await knex.raw(
      `
      select token_key,email from emailauthentication_token
      where token_key='${token_key}' and expiry_date >  ${getExpiryDate(0)};
      `
    );

    if (tokenKeyPresent.rows.length > 0) {
      const emailFound = tokenKeyPresent.rows[0].email;

      await knex.raw(`

                update users
                set verified= true
                where email='${emailFound}'
            `);

      await knex.raw(`
              delete from emailauthentication_token
              where token_key='${token_key}';
            `);

      // res.json({ message: "success" });
      res.redirect(CLIENT_HOST); //CLIENT_HOST
    } else {
      res.status(403).json({ message: "invalid token or token is expired" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  nodeMailerSMTP,
  nodemailerCheckToken,
};
