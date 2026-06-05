import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import MarketProject from "../models/MarketProject.js";

async function run() {
  console.log("Starting MarketProject Moderation Status Migration...");

  // 1. Load MONGODB_URI from .env file
  const envContent = fs.readFileSync(path.resolve(".env"), "utf8");
  const uriMatch = envContent.match(/MONGODB_URI\s*=\s*(.*)/);
  if (!uriMatch) {
    throw new Error("MONGODB_URI not found in .env");
  }
  const MONGODB_URI = uriMatch[1].trim().replace(/['"]/g, "");

  // 2. Connect to Database
  await mongoose.connect(MONGODB_URI);
  console.log("Database connected successfully.");

  // 3. Count documents missing moderationStatus
  const affectedQuery = { moderationStatus: { $exists: false } };
  const affectedCount = await MarketProject.countDocuments(affectedQuery);
  console.log(`Found ${affectedCount} legacy project documents missing 'moderationStatus'.`);

  if (affectedCount === 0) {
    console.log("No documents require backfilling. Migration is already complete.");
    process.exit(0);
  }

  // 4. Backfill moderationStatus = "approved"
  console.log("Updating documents...");
  const updateResult = await MarketProject.updateMany(
    affectedQuery,
    { $set: { moderationStatus: "approved" } }
  );

  console.log(`Successfully updated ${updateResult.modifiedCount} project documents.`);

  // 5. Verify results
  const postVerificationMissing = await MarketProject.countDocuments(affectedQuery);
  const totalApproved = await MarketProject.countDocuments({ moderationStatus: "approved" });

  console.log("\nMigration Verification Results:");
  console.log(`- Documents still missing 'moderationStatus': ${postVerificationMissing} (Expected: 0)`);
  console.log(`- Total documents with 'moderationStatus = "approved"': ${totalApproved}`);

  console.log("Migration finished successfully.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration Failed:", err);
  process.exit(1);
});
