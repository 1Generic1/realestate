const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://taye_db_user:WrEIxUXIVf1wHS5d@ac-cskun6a-shard-00-00.gbniujp.mongodb.net:27017,ac-cskun6a-shard-00-01.gbniujp.mongodb.net:27017,ac-cskun6a-shard-00-02.gbniujp.mongodb.net:27017/realestate?ssl=true&replicaSet=atlas-13k8n4-shard-0&authSource=admin&retryWrites=true&w=majority",
    { family: 4, serverApi: "1" },
  )
  .then(() => console.log("✅ Connected successfully!"))
  .catch((err) => console.error("❌ Connection failed:", err));
