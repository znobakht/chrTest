const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const diffrenceSchema = new Schema({
    procedureMessage: String,
    mainValue: String,
    bhnValue: String,
    fileNumber: Number
})

module.exports = diffrenceModel = mongoose.model('diffrence',diffrenceSchema);