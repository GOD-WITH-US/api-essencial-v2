const mongoose = require("mongoose");

//remove depreciation
mongoose.set("strictQuery", true);

//connect to mongoose with then=ok  catch=error
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@essencial.2ldsrj0.mongodb.net/essencial"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
