import { MongoClient } from "mongodb";
import {
  mongoUrl,
  dstDBName,
  startNumber,
  endNumber,
  mainColTmp,
  groupedCollTmp,
} from "./config/keys15.js";
import logger from "./logger.js";
import { printTime } from "./printTime.js";

let client;
const main = async () => {
  try {
    client = await MongoClient.connect(mongoUrl);
    console.log("connected to db");
    const DB = client.db(dstDBName);
    const srcColl = DB.collection(groupedCollTmp);
    printTime();
    for (let i = startNumber; i <= endNumber; i++) {
      const fileNumber = `${mainColTmp}${i}`;
      const dstColName = `${groupedCollTmp}${i}`;

      console.log(i);

      await srcColl
        .aggregate([
          {
            $match: {
              "_id.fileNumber": fileNumber,
            },
          },
          {
            $out: {
              db: dstDBName,
              coll: dstColName,
            },
          },
        ])
        .toArray();
    }
    await client.close();
  } catch (err) {
    logger.error(err);
    console.log(err);
    await client.close();
  }
};
main();
