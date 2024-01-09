const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')


dotenv.config({ path: './../../config.env' });



const db = process.env.DATABASE
.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'natours',
  })
  .then(() => console.log('DB connection successful'));


  // Read JSON file
  const fileData  = JSON.parse(fs.readFileSync('./tours-simple.json','utf-8'));


const importData = async ()=>{
    let a = await Tour.create(fileData);
    
}
importData();

