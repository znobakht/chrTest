const mongoClient = require("mongodb").MongoClient;
const mongoUrl = require("./config/keys").mongoUrl;

// const mongoose = require("mongoose");
const testDBName = "Test_decoding";
const testResultDBName = "testResult";
// const testResultUrl = mongoUrl + "/" + testResultDBName;
// console.log(testResultUrl)

const diffrenceModel = require("./models/diffrence");

// mongoose.set("strictQuery", false);

async function main() {
  try {
    // mongoose
    //   .connect(testResultUrl)
    //   .then(() => console.log("mongoose connected to testResutlDb"))
    //   .catch((err) => console.error(err));

    const client = await mongoClient.connect(mongoUrl); // await is necessary
    console.log("connected to db");

    const db = client.db(testDBName);
    const testDB = client.db(testResultDBName);

    const collectionMain1 = db.collection("main_file_1");
    const collectionMain2 = db.collection("main_file_2");
    const collectionMain3 = db.collection("main_file_3");

    const collectionBHN1 = db.collection("CHR1_Bhn");
    const collectionBHN2 = db.collection("CHR2_Bhn");
    const collectionBHN3 = db.collection("CHR3_Bhn");

    const diffrenceCollection = testDB.collection("diffrences");

    const outs = await collectionMain2
      .aggregate([
        {
          $project: {
            "Procedure Messages": 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    // console.log(outs);

    const tmp1 = await collectionMain2.findOne();
    const keys = Object.keys(tmp1);
    // console.log(keys);
    // console.log(tmp1[keys[3]]);

    for(let i=0; i < outs.length; i++){
    // for (let i = 0; i < 1; i++) {
      console.log(i)
      const tmp1 = await collectionMain2.findOne({
        "Procedure Messages": outs[i]["Procedure Messages"],
      });
      const tmp2 = await collectionBHN2.findOne({
        "Procedure Messages": outs[i]["Procedure Messages"],
      });

      // console.log(tmp1)
      // console.log(tmp2)
      if (tmp1 && tmp2) {
        for (let j = 3; j < keys.length; j++) {
        //   console.log(j);
          if (tmp1[keys[j]] !== tmp2[keys[j]]) {
            await diffrenceCollection.insertOne({
              procedureMessage: outs[i]["Procedure Messages"],
              mainValue: tmp1[keys[j]],
              bhnValue: tmp2[keys[j]],
              fileNumber: 2
          })
            // console.log(tmp1[keys[j]]);
            // console.log(tmp2[keys[j]]);
          }
        }
      } else {
        if (tmp1) {
          console.log(i + "   " + "tmp2 isnt availabe");
        } else {
          console.log(i + "   " + "tmp1 isnt availabe");
        }
      }
    }

    await client.close();
  } catch (err) {
    console.error(err);
    client.close();
  }
}

main();
