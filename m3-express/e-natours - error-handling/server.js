const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

///////////// ///////////// ///////////// ///////////// ///////////// ///////////// 

/* 
  console.log(app.get('env')) // set by express // development
  console.log(app.get(process.env)) // node env variables

  In express many packages depends on the NODE_ENV
  its is a variable which is kind of convention which should define weather
  we are in development or production
  and we can also define any madeUp variable
*/

///////////// ///////////// ///////////// ///////////// ///////////// ///////////// 

const db = process.env.DATABASE
.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'natours',
  })
  .then(() => console.log('DB connection successful'));


///////////// ///////////// ///////////// ///////////// ///////////// ///////////// ///////////// 

const port = process.env.PORT || 3000;
const server = app.listen(port, '127.0.0.1', () => {
  console.log(`App running on port ${port}...`);
});

///////////// ///////////// ///////////// ///////////// ///////////// ///////////// ///////////// 

// if any promise get rejected
process.on('unhandledRejection',err=>{
  console.log('----/----/----/----/-----/----/----/');
  console.log(err.name,err.message);
  console.log('----/----/----/----/-----/----/----/');

  console.log('UNHANDLED REJECTION 🙅🏽‍♂️🚦🙅🏽‍♂️  Shutting down...')
  // process.exit(1); // hard exit

  // Giving time to finish pending requests
  server.close(()=>{
    console.log("Server closed ...");
  });
  
});

///////////// ///////////// ///////////// ///////////// ///////////// ///////////// ///////////// ///////////// 


// it is a good idea to put this block above everything
process.on('uncaughtException',err => {
  console.log('Uncaught Exception 🙅🏽‍♂️🚦🙅🏽‍♂️  Shutting down...')
  
  server.close(()=>{
    console.log("Server closed ...");
  });
});