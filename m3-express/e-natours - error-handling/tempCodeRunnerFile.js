const db = process.env.DATABASE
.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose.connect(db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'natours',
  })
  .then(() => console.log('DB connection successful'));

