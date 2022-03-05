const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

async function main() {
  const uri = "mongodb://localhost:27017/?readPreference=primary&ssl=false";

  const client = new MongoClient(uri);
  let count = 0;
  try {
    app.post("/command", async (_, res) => {
      await client.connect();
      const db = client.db("CQRS").collection("counter");
      count = count + 1;
      const doc = {
        count: count,
      };
      const result = db.insertOne(doc);
      res.status(200);
      res.send((await result).insertedId);
    });

    app.get("/query", async (_, res) => {
      await client.connect();
      const db = client.db("CQRS").collection("counter");
      db.find({}).toArray(function (err, result) {
        if (err) throw err;
        res.status(200);
        res.send(result);
      });
    });

    app.listen(port, () => {
      console.log(`Command Module listening at http://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
