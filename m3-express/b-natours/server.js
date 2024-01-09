const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

/* 
  console.log(app.get('env')) // set by express // development
  console.log(app.get(process.env)) // node env variables

  In express many packages depends on the NODE_ENV
  its is a variable which is kind of convention which should define weather
  we are in development or production
  and we can also define any madeUp variable
*/


const db = process.env.DATABASE
.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'natours',
  })
  .then(() => console.log('DB connection successful'));


const port = process.env.PORT || 3000;
app.listen(port, '127.0.0.1', () => {
  console.log(`App running on port ${port}...`);
});
