const pool = require("../database/db");

const getRecordDate = async (req, res) => {
  try {
    // 1. check if user's record date exists
    const userRecord = await pool.query(
      'SELECT * FROM "record" WHERE "logger_username" = $1 AND "date" = $2',
      [req.decoded.username, req.body.date]
    );
    if (!userRecord.rowCount) {
      // check if rowCount is truthy / !falsy (!0) => username is unique => can continue
      return res
        .status(400)
        .json({ status: "error", message: "record date not found" });
    }

    console.log("record date is: ", userRecord.rows[0]);
    res.json({ status: "okay", message: "record exists" });
  } catch (error) {
    console.log("POST /logger/getRecordDate/", error);
    res.status(400).json({ status: "error", message: "an error has occurred" });
  }
};

const createRecord = async (req, res) => {
  try {
    // only allow Health loggers
    if (req.decoded.userType !== "Health Logger") {
      res.status(401).json({ status: "error", message: "unauthorised" });
    }

    const createdRecord = await pool.query(
      'INSERT INTO "record" ("date", "logger_username") VALUES ($1, $2) RETURNING *',
      [req.body.date, req.decoded.username]
    );

    console.log("created record is ", createdRecord.rows[0]);
    res.json({ status: "okay", message: "record created" });
  } catch (error) {
    console.log("PUT /logger/createRecord/", error);
    res.status(400).json({ status: "error", message: "an error has occurred" });
  }
};

const createEntry = async (req, res) => {
  try {
    // only allow Health loggers
    if (req.decoded.userType !== "Health Logger") {
      res
        .status(401)
        .json({ status: "error", message: "user type is not Health Logger" });
    }

    // JOIN "record" to get id
    const createdEntry = await pool.query(
      'INSERT INTO "entry" (type, name, category, title, item, image_url, trigger_tag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        req.body.type,
        req.body.name,
        req.body.category,
        req.body.title,
        req.body.item,
        req.body.imageUrl,
        req.body.triggerTag,
      ]
    );
    console.log("created user is ", createdEntry.rows[0]);
    res.json({ status: "okay", message: "record created" });
  } catch (error) {
    console.log("PUT /logger/createEntry/", error);
    res.status(400).json({ status: "error", message: "an error has occurred" });
  }
};

const displayAllRecords = () => {};

const displaySomeRecords = () => {};

const updateRecord = () => {};

const updateEntry = () => {};

const deleteRecord = () => {};

const deleteEntry = () => {};

module.exports = {
  getRecordDate,
  createRecord,
  createEntry,
  displayAllRecords,
  displaySomeRecords,
  updateRecord,
  updateEntry,
  deleteRecord,
  deleteEntry,
};
