import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import MarketProject from "../models/MarketProject.js";
import Builder from "../models/Builder.js";
import { normalizeBuilder } from "../utils/admin/normalization.js";

async function run() {
  console.log("Starting Builder Migration (Builder Collection V1)...");
  
  const envContent = fs.readFileSync(path.resolve("e:/goan/site/.env"), "utf8");
  const uriMatch = envContent.match(/MONGODB_URI\s*=\s*(.*)/);
  if (!uriMatch) {
    throw new Error("MONGODB_URI not found in .env");
  }
  const MONGODB_URI = uriMatch[1].trim().replace(/['"]/g, "");

  await mongoose.connect(MONGODB_URI);
  console.log("Database connected successfully.");

  // 1. Read unique builder names from MarketProjects
  const uniqueRawBuilderNames = await MarketProject.distinct("builderName");
  console.log(`Found ${uniqueRawBuilderNames.length} unique raw builder names in MarketProjects.`);

  const builderMap = new Map();
  let createdCount = 0;
  let skippedCount = 0;

  // 2. Create Builder records and generate slugs
  for (const rawName of uniqueRawBuilderNames) {
    if (!rawName || !rawName.trim()) {
      continue;
    }

    const canonicalName = normalizeBuilder(rawName);
    if (!canonicalName) {
      continue;
    }

    const slug = canonicalName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // 3. Avoid duplicates (check by name or slug)
    let builder = await Builder.findOne({
      $or: [{ name: canonicalName }, { slug }]
    });

    if (!builder) {
      builder = await Builder.create({
        name: canonicalName,
        slug,
        status: "active"
      });
      createdCount++;
      console.log(`[CREATED] Builder: "${canonicalName}" | Slug: "${slug}"`);
    } else {
      skippedCount++;
    }

    // Map raw name and canonical name to the builder document id
    builderMap.set(rawName, builder._id);
    builderMap.set(canonicalName, builder._id);
  }

  console.log(`\nBuilder Creation Stats:`);
  console.log(`- Created: ${createdCount}`);
  console.log(`- Existing/Reused: ${skippedCount}`);

  // 4. Update MarketProjects with builderId
  console.log("\nUpdating MarketProject documents with builderId references...");
  const projects = await MarketProject.find({});
  let updatedCount = 0;

  for (const doc of projects) {
    if (!doc.builderName) {
      continue;
    }

    const canonicalName = normalizeBuilder(doc.builderName);
    const builderId = builderMap.get(doc.builderName) || builderMap.get(canonicalName);

    if (builderId) {
      doc.builderId = builderId;
      await doc.save();
      updatedCount++;
    } else {
      console.warn(`[WARNING] No builder resolved for project: "${doc.projectName}" (Builder: "${doc.builderName}")`);
    }
  }

  console.log(`\nMigration Complete! Linked ${updatedCount} / ${projects.length} project documents.`);
  process.exit(0);
}

run().catch(err => {
  console.error("Migration Failed:", err);
  process.exit(1);
});
