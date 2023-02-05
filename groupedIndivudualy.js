import { MongoClient } from "mongodb";
import {
  mongoUrl,
  dstColName as srcColName,
  dstDBName,
  startNumber,
  endNumber,
  mainColTmp,
  groupedCollTmp,
} from "./config/keys15.js";
import logger from "./logger";
import { printTime } from "./printTime";

let client;
const main = async () => {
  try {
    client = await MongoClient.connect(mongoUrl);
    const DB = client.db(dstDBName);
    const srcColl = DB.collection(srcColName);
    printTime();
    for (let i = startNumber; i <= endNumber; i++) {
      const fileNumber = `${mainColTmp}${i}`;
      const dstColName = `${groupedCollTmp}${i}`;

      await srcColl
        .aggregate([
          {
            $match: {
              fileNumber: fileNumber,
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

      await client.close();
    }
  } catch (err) {
    logger.error(err);
    console.log(err);
    await client.close();
  }
};
main();
