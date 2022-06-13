require("dotenv").config();
const user = require("../models/user.js");
const fs = require("fs");
const csv = require("csv-parser");
const nodemailer = require("nodemailer");
//--------------------------------------

exports.addEmployees = async (req, res) => {
  // var file = req.body.file;

  try {
    // csvFile = req.body.file
    // Using a local file as postman is not allowing me to upload a file despite using all fixes
    var records = {};
    fs.createReadStream("records.csv")
      .pipe(csv())
      .on("data", (row) => {
        records = row;
      })
      .on("end", async () => {
        const { name, email, phoneStatus, employeeTitle } = records;

        if (!email) {
          return res
            .status(403)
            .send({ success: false, message: "email is required." });
        }

        if (!name) {
          return res
            .status(403)
            .send({ success: false, message: "name is required." });
        }

        if (!phoneStatus) {
          return res
            .status(403)
            .send({ success: false, message: "phone status required." });
        }

        // if (employeeTitle != "frontend developer") {
        //   return res
        //     .status(403)
        //     .send({ success: false, message: "Incorrect developer entered" });
        // }

        // if (employeeTitle != "ai developer") {
        //   return res
        //     .status(403)
        //     .send({ success: false, message: "Incorrect developer entered" });
        // }

        if (employeeTitle.localeCompare("backend developer") != 0) {
          return res
            .status(403)
            .send({ success: false, message: "Incorrect developer entered" });
        }

        const createdUser = new user(records);
        await createdUser.save();
        return res.status(200).send({ success: true, result: createdUser });
      });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
};

//----------------------------

exports.getEmployeeByNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    var givenNumber = phoneNumber;

    if (
      givenNumber[0] != "*" &&
      givenNumber[1] != "*" &&
      givenNumber[2] != "*"
    ) {
      var chunkNumber =
        givenNumber[0] + givenNumber[1] + givenNumber[2] + givenNumber[3];
    }

    if (
      givenNumber[4] != "*" &&
      givenNumber[5] != "*" &&
      givenNumber[6] != "*"
    ) {
      var chunkNumber =
        givenNumber[3] +
        givenNumber[4] +
        givenNumber[5] +
        givenNumber[6] +
        givenNumber[7];
    }

    if (
      givenNumber[8] != "*" &&
      givenNumber[9] != "*" &&
      givenNumber[10] &&
      givenNumber[11] != "*"
    ) {
      var chunkNumber =
        givenNumber[7] +
        givenNumber[8] +
        givenNumber[9] +
        givenNumber[10] +
        givenNumber[11];
    }

    const foundEmployees = await user
      .find({ phoneStatus: { $regex: chunkNumber } })
      .select("name email employeeTitle phoneStatus")
      .skip(process.env.PAGE * process.env.LIMIT)
      .limit(process.env.LIMIT);

    return res.status(200).send({ success: true, result: foundEmployees });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
};

//------------------------------------

exports.addEmployeePicture = async (req, res) => {
  try {
    const email = req.body;

    if (!email) {
      return ress
        .status(400)
        .send({ success: false, message: "email not found" });
    }
    if (!req.file) {
      return res.status(400).send({ success: false, message: "no file found" });
    }

    const path = req.file.path;
    var updatedEmployee = await user.findOneAndUpdate(
      { email: email },
      { imagePath: path }
    );

    if (!updatedEmployee) {
      return res.status(400).send({
        success: false,
        message: "user not found in  database",
      });
      return;
    }
    return res
      .status(200)
      .send({ success: true, imagePath: updatedEmployee.imagePath });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
};

//-------------------------------

exports.getEmployeeByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    var foundEmployee = await user
      .find({ email: email })
      .select("name email employeeTitle phoneStatus");

    if (!foundEmployee) {
      return res.status(400).send({
        success: false,
        message: "user not found in database",
      });
      return;
    }

    return res
      .status(200)
      .send({ success: true, "Employee details": foundEmployee });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
};
//----------------------------------

exports.sendEmail = async (req, res) => {
  try {
    const { email, text } = req.params;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hammasdev576@gmail.com",
        pass: "necrophos",
      },
    });

    const msg = {
      from: "hammasdev576@gmail.com", // sender address
      to: `${email}`, // list of receivers
      subject: "Message", // Subject line
      html:
        "<h3>Message :</h3>" +
        "<h1 style='font-weight:bold;'>" +
        text +
        "</h1>",
    };

    // send mail with defined transport object
    const info = await transporter.sendMail(msg);
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
};
