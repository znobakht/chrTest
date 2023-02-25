import { MongoClient } from "mongodb";
import { mongoUrl, dstDBName, fileNumberForDelete } from "./config/keys.js";
const collectionName = "differences";

let client;

async function main() {
  try {
    client = await MongoClient.connect(mongoUrl);
    console.log("connected to db");
    let collection = client.db(dstDBName).collection(collectionName);
    await collection.deleteMany({ fileNumber: fileNubmerForDelete });
    console.log("they have been deleted completely")
    client.close();
  } catch (err) {
    console.error(err);
    await client.close();
  }
}

main();
