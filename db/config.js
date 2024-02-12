const mongoose = require("mongoose");
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {});
    console.log("Database Connected");
  } catch (e) {
    throw new Error("Error in database connection", e);
  }
};

module.exports = {
  dbConnection,
};
