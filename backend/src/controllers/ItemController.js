// Import nodemailer and dotenv :

const nodemailer = require("nodemailer");
const models = require("../models");
require("dotenv").config();

class ItemController {
  static browse = (req, res) => {
    models.item
      .findAll()
      .then(([rows]) => {
        res.send(rows);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static read = (req, res) => {
    models.item
      .find(req.params.id)
      .then(([rows]) => {
        if (rows[0] == null) {
          res.sendStatus(404);
        } else {
          res.send(rows[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static edit = (req, res) => {
    const item = req.body;

    // TODO validations (length, format...)

    item.id = parseInt(req.params.id, 10);

    models.item
      .update(item)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static add = (req, res) => {
    const item = req.body;

    // TODO validations (length, format...)

    models.item
      .insert(item)
      .then(([result]) => {
        res.status(201).send({ ...item, id: result.insertId });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static delete = (req, res) => {
    models.item
      .delete(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  // Add a sendEmail function. This function take in parameter req and res. We get some informations from the req.body.

  static sendMail = (req, res) => {
    const { name, surname, phone, email, message } = req.body;

    // Next, we need to create a transporter in which we will setting up our SMTP server :

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SENDIN,
      port: process.env.SMTP_PORT_SENDIN,
      secure: false,
      auth: {
        user: process.env.SMTP_SENDIN_USER,
        pass: process.env.SMTP_SENDIN_PASSWORD,
      },
      ssl: { rejectUnauthorized: false },
    });

    // Now, we can set up the body of our mail :

    const mailOptions = {
      from: email,
      to: "guilhem.seyvet@wildcodeschool.com",
      subject: "New message from contact form",
      text: `${message} \n\n Phone: ${phone} \n\n Name: ${name} \n\n Surname: ${surname} \n\n Email: ${email}`,
      html: `<p>${message}</p> <p>Phone: ${phone}</p> <p>Name: ${name}</p> <p>Surname: ${surname}</p> <p>Email: ${email}</p>`,
    };

    // Finally, we return the transporter with the sendMail method :

    return transporter
      .sendMail(mailOptions)
      .then((info) => {
        console.warn(info);
        res.status(200).send("Message sent");
      })
      .catch((err) => {
        console.warn(err);
        res.status(500).send("Something went wrong");
      });
  };
}

module.exports = ItemController;
