const mongoClient = require("mongodb").MongoClient;
const mongoUrl = require("./config/keys").mongoUrl;
const testDBName = "Test_decoding";
const testResultDBName = "testResult";
async function main(){
    try{
        const client = await mongoClient.connect(mongoUrl);// await is necessary 
        console.log("connected to db")
        const db = client.db(testDBName);
        const collectionMain1 = db.collection("main_file_1");
        const collectionMain2 = db.collection("main_file_2");
        const collectionMain3 = db.collection("main_file_3");

        const collectionBHN1 = db.collection("CHR1_Bhn");
        const collectionBHN2 = db.collection("CHR2_Bhn");
        const collectionBHN3 = db.collection("CHR3_Bhn");

        const outs = await collectionMain2.aggregate([
            {$project:{
                'Procedure Messages':1,
                _id:0
            }}
        ]).toArray()

        // console.log(outs);

        const tmp1 = await collectionMain2.findOne();
        const keys = Object.keys(tmp1);
        // console.log(keys);
        // console.log(tmp1[keys[0]]);

        for(let i=0; i < outs.length; i++){
            const tmp1 = await collectionMain2.find({'Procedure Messages': outs[i]['Procedure Messages']}).toArray();
            const tmp2 = await collectionBHN2.find({'Procedure Messages': outs[i]['Procedure Messages']}).toArray();

            for(let j=3; j <keys.length; j++){
                if(tmp1[keys[j]] !== tmp2[keys[j]]){

                }

            }


            
        }

        await client.close()
    }
    catch(err){
        console.error(err);
        client.close()
    }
}

main();