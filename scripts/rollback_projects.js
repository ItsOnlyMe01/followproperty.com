import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import MarketProject from "../models/MarketProject.js";

async function run() {
  console.log("Starting MarketProjects Database Rollback...");
  
  const envContent = fs.readFileSync(path.resolve("e:/goan/site/.env"), "utf8");
  const uriMatch = envContent.match(/MONGODB_URI\s*=\s*(.*)/);
  if (!uriMatch) {
    throw new Error("MONGODB_URI not found in .env");
  }
  const MONGODB_URI = uriMatch[1].trim().replace(/['"]/g, "");

  await mongoose.connect(MONGODB_URI);
  console.log("Database connected successfully.");

  const result = await MarketProject.updateMany(
    {},
    { $unset: { state: "", city: "", propertyType: "" } }
  );

  console.log(`Rollback Complete! Successfully removed fields from ${result.modifiedCount} project documents.`);
  process.exit(0);
}

run().catch(err => {
  console.error("Rollback Failed:", err);
  process.exit(1);
});
