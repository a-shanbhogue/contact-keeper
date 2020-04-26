const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo DB connected ...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  //   mongoose
  //     .connect(db, {
  //       useNewUrlParser: true,
  //       useFindAndModify: false,
  //       useCreateIndex: true,
  //       useUnifiedTopology: true,
  //     })
  //     .then(() => console.log("Mongo DB Connected"))
  //     .catch((err) => {
  //       console.err(err);
  //       process.exit(1);
  //     });
};

module.exports = connectDB;
