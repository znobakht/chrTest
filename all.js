import { MongoClient } from "mongodb";
import {
  mongoUrl,
  srcDBName,
  dstDBName,
  mainColTmp,
  BHNColTmp,
  startNumber,
  endNumber,
  dstColName,
} from "./config/keys20.js";

import { printTime } from "./printTime.js";

import logger from "./logger.js";

let client;
const main = async () => {
  // async function main() {
  try {
    client = await MongoClient.connect(mongoUrl); // await is necessary
    console.log("connected to db");

    const db = client.db(srcDBName);
    const dstDB = client.db(dstDBName);

    for (let i = startNumber + 16; i <= endNumber; i++) {
      console.log(i);
      logger.info(`fileNumber: ${i}`);

      printTime();

      const srcCollName = `${mainColTmp}${i}`;

      const collectionMain = db.collection(srcCollName);
      const collectionBHN = db.collection(`${BHNColTmp}${i}`);

      const differencesCollection = dstDB.collection(dstColName);

      const PMIDS = await collectionMain
        .aggregate([
          {
            $project: {
              "Procedure Messages": 1,
              _id: 0,
            },
          },
        ])
        .toArray();

      const tmp1 = await collectionMain.findOne();
      let keys = Object.keys(tmp1);

      const unwantedKeys = ["_id", "DeviceName", "StartTime", "DateTime"];
      keys = keys.filter((ele) => !unwantedKeys.includes(ele));

      console.log(PMIDS.length);
      logger.info(`number of unique PMs: ${PMIDS.length}`);

      for (let j = 0; j < PMIDS.length; j++) {
        // console.log(j);
        const PMID = PMIDS[j]["Procedure Messages"];

        logger.debug(`fileNumber: ${i}, PMID: ${PMID}, j: ${j}`);

        const tmp1 = await collectionMain.findOne({
          "Procedure Messages": PMID,
        });
        const tmp2 = await collectionBHN.findOne({
          "Procedure Messages": PMID,
        });

        if (tmp1 && tmp2) {
          for (let k = 0; k < keys.length; k++) {
            if (tmp1[keys[k]] !== tmp2[keys[k]]) {
              await differencesCollection.insertOne({
                procedureMessage: PMID,
                fieldName: keys[k],
                mainValue: tmp1[keys[k]],
                bhnValue: tmp2[keys[k]],
                fileNumber: srcCollName,
              });
            }
          }
        } else {
          if (tmp1) {
            console.log(j + "   " + "tmp2 isn't available");
          } else {
            console.log(j + "   " + "tmp1 isn't available");
          }
        }
      }
    }

    await client.close();
  } catch (err) {
    console.error(err);
    await client.close();
  }
};

main();
