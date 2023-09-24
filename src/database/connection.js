const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect("mongodb://localhost:27017");
        console.log("Database connected");
    } catch (error) {
        console.log("db error", error);
        process.exit(1);
    }
}

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to db...");
});

mongoose.connection.on("error", (err) => {
    console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected");
});

process.once("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
    process.exit(1);
});

module.exports = connect;
