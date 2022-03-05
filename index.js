const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 8080;

async function main() {
  const uri = "mongodb+srv://SujitSingh:UncleSam2811@cluster0.klmab.mongodb.net/retryWrites=true&w=majority";

  const client = new MongoClient(uri);
  let count = 0;
  try {
    app.post("/command", async (_, res) => {
      await client.connect();
      const db = client.db("CQRS").collection("posts");
      post = count + 1;
      var myquery = { name: "Sujit Singh" };
      var newvalues = { $set: {rand: Math.random() } };
      const result = await db.updateOne(myquery, newvalues);
      res.status(200);
      res.send();
    });

    app.get("/query", async (_, res) => {
      await client.connect();
      const db = client.db("CQRS").collection("posts");
      db.find({}).toArray(function (err, result) {
        if (err) throw err;
        res.status(200);
        res.send(result);
      });
    });

    app.listen(port, () => {
      console.log(`listening at ${port}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
