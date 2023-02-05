import { MongoClient } from "mongodb";
import { mongoUrl, dstDBName, dstColName } from "./config/keys20.js";

let client;
const main = async () => {
  try {
    client = await MongoClient.connect(mongoUrl);
    console.log("connected to db");

    const differenceCollection = client.db(dstDBName).collection(dstColName);
    await differenceCollection
      .aggregate(
        [
          {
            $group: {
              _id: {
                fieldName: "$fieldName",
                mainValue: "$mainValue",
                bhnValue: "$bhnValue",
                fileNumber: "$fileNumber",
              },
              value: { $sum: 1 },
            },
          },
          {
            $sort: { value: -1 },
          },
          {
            $merge: {
              into: {
                db: dstDBName,
                coll: "grouped",
              },
            },
          },
        ],
        { allowDiskUse: true }
      )
      .toArray();

    await client.close();
  } catch (err) {
    console.error(err);
    await client.close();
  }
};

main();
