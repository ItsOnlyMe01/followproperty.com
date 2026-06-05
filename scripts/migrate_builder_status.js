import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import User from "../models/User.js";
import BuilderApplication from "../models/BuilderApplication.js";

async function run() {
  console.log("Starting Builder Application Status Migration...");

  const envContent = fs.readFileSync(path.resolve("e:/goan/site/.env"), "utf8");
  const uriMatch = envContent.match(/MONGODB_URI\s*=\s*(.*)/);
  if (!uriMatch) {
    throw new Error("MONGODB_URI not found in .env");
  }
  const MONGODB_URI = uriMatch[1].trim().replace(/['"]/g, "");

  await mongoose.connect(MONGODB_URI);
  console.log("Database connected successfully.");

  // 1. Find all raw user documents (lean gets all DB properties, even those not in schema)
  const users = await User.find({}).lean();
  console.log(`Inspecting ${users.length} total user records...`);

  let migratedCount = 0;

  for (const user of users) {
    if (user.builderApplicationStatus) {
      let status = user.builderApplicationStatus;
      // Convert "started" to "draft" enum value if necessary
      if (status === "started") {
        status = "draft";
      }

      await BuilderApplication.findOneAndUpdate(
        { userId: user._id },
        { status },
        { upsert: true }
      );
      migratedCount++;
      console.log(`[MIGRATED] User: ${user.email} | Builder Application Status: "${status}"`);
    }
  }

  // 2. Clean up/unset the field in the MongoDB collection
  const result = await mongoose.connection.db.collection("users").updateMany(
    { builderApplicationStatus: { $exists: true } },
    { $unset: { builderApplicationStatus: "" } }
  );

  console.log(`\nMigration Complete:`);
  console.log(`- Created/Updated ${migratedCount} BuilderApplication records.`);
  console.log(`- Unset 'builderApplicationStatus' from ${result.modifiedCount} user documents.`);

  process.exit(0);
}

run().catch((err) => {
  console.error("Migration Failed:", err);
  process.exit(1);
});
