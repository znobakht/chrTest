const mongoClient = require("mongodb").MongoClient;
const mongoUrl = require("./config/keys").mongoUrl;
const dbName = "testResult";
const collectionName = "diffrences";

let client;

async function main(){
    try{
        client = await mongoClient.connect(mongoUrl);
        console.log("connected to db");
        let collection = client.db(dbName).collection(collectionName);
        await collection.deleteMany({fileNumber:3});
        client.close()
    }
    catch(err){
        console.error(err);
        await client.close();
    }
}

main()