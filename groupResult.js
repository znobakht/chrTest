const mongoClient = require("mongodb").MongoClient;
const mongoUrl = require("./config/keys").mongoUrl;

const testResultDBName = "testResult";
const testResultCollectionName = "diffrences";
let client;
async function main() {
  try {
    client = await mongoClient.connect(mongoUrl);
    console.log("connected to db");

    const diffrenceCollection = client
      .db(testResultDBName)
      .collection(testResultCollectionName);
    // const result =
    for(let i =1; i <=3; i++){
        console.log(i)
        await diffrenceCollection
      .aggregate(
        [
          {
            $match: { fileNumber: i },
          },
          {
            $group: {
              _id: {
                fieldName: "$fieldName",
                mainValue: "$mainValue",
                bhnValue: "$bhnValue",
              },
              value: { $sum: 1 },
              fileNumber: { $first: "$fileNumber" },
            },
          },
          {
            $sort: { value: -1 },
          },
          {
            $merge: {
              into: {
                db: testResultDBName,
                coll: "grouped",
              },
            },
          },
        ],
        { allowDiskUse: true }
      )
      .toArray();
    }
    
    // console.log(result);

    await client.close();
  } catch (err) {
    console.error(err);
    await client.close();
  }
}

main();
