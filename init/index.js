const mongoose = require("mongoose");
const initDatabase = require("./data.js");
const listing = require("../models/listing.js");


main()
.then(() => {console.log("Connection to Database is succesfull ")})
.catch((err) => {console.log(err)});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

const initDB = async () => {
    await listing.deleteMany({});
    // initDatabase.data = initDatabase.data.map((object) => ({...object, owner: '66714d656424ba7446c56b8e'}))
    await listing.insertMany(initDatabase.data);
    console.log("Data was intialised.");
}

initDB();

