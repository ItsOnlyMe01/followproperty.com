import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import MarketProject from "../models/MarketProject.js";

const CITY_TO_STATE = {
  "Gurgaon": "Haryana",
  "Noida": "Uttar Pradesh",
  "Delhi": "Delhi",
  "Mumbai": "Maharashtra",
  "Pune": "Maharashtra",
  "Hyderabad": "Telangana",
  "Bengaluru": "Karnataka",
  "Chennai": "Tamil Nadu",
  "Ahmedabad": "Gujarat",
  "Kolkata": "West Bengal",
  "Jaipur": "Rajasthan",
  "Lucknow": "Uttar Pradesh"
};

const GURGAON_BUILDERS = [
  "dlf", "m3m", "emaar", "signature global", "smartworld", "whiteland", 
  "puri", "ss group", "ss one", "tulip", "ganga", "conscient", "tarc", 
  "hero", "experion", "adani", "sobha", "godrej", "vatika", "krisumi", 
  "elan", "unitech", "emperium", "bestech", "orris", "ireo", "central park",
  "ashiana", "microtek", "paras", "chintels", "spaze", "raheja", "satya",
  "ansal", "huda", "cghs"
];

const GURGAON_KEYWORDS = [
  "gurgaon", "gurugram", "dwarka expressway", "golf course", "sohna", 
  "pataudi", "spr", "nh-8", "nh-48", "vatika road", "gwal pahari", 
  "southern peripheral", "extension road", "delhi-jaipur", "jaipur-delhi",
  "palam vihar", "sushant lok", "civil lines"
];

async function run() {
  console.log("Starting MarketProjects Database Enrichment...");
  
  const envContent = fs.readFileSync(path.resolve("e:/goan/site/.env"), "utf8");
  const uriMatch = envContent.match(/MONGODB_URI\s*=\s*(.*)/);
  if (!uriMatch) {
    throw new Error("MONGODB_URI not found in .env");
  }
  const MONGODB_URI = uriMatch[1].trim().replace(/['"]/g, "");

  await mongoose.connect(MONGODB_URI);
  console.log("Database connected successfully.");

  const projects = await MarketProject.find({});
  console.log(`Retrieved ${projects.length} documents to enrich.`);

  let updatedCount = 0;

  for (const doc of projects) {
    let locationStr = (doc.location || "").toLowerCase();
    let nameStr = (doc.projectName || "").toLowerCase();
    let builderStr = (doc.builderName || "").toLowerCase();
    
    let city = "";
    
    // Noida
    if (locationStr.includes("noida") || nameStr.includes("noida")) {
      city = "Noida";
    } 
    // Mumbai
    else if (locationStr.includes("mumbai") || nameStr.includes("mumbai")) {
      city = "Mumbai";
    } 
    // Pune
    else if (locationStr.includes("pune") || nameStr.includes("pune")) {
      city = "Pune";
    } 
    // Bengaluru
    else if (locationStr.includes("bangalore") || nameStr.includes("bangalore") || locationStr.includes("bengaluru") || nameStr.includes("bengaluru")) {
      city = "Bengaluru";
    } 
    // Chennai
    else if (locationStr.includes("chennai") || nameStr.includes("chennai")) {
      city = "Chennai";
    } 
    // Hyderabad
    else if (locationStr.includes("hyderabad") || nameStr.includes("hyderabad")) {
      city = "Hyderabad";
    } 
    // Ahmedabad
    else if (locationStr.includes("ahmedabad") || nameStr.includes("ahmedabad")) {
      city = "Ahmedabad";
    } 
    // Kolkata
    else if (locationStr.includes("kolkata") || nameStr.includes("kolkata")) {
      city = "Kolkata";
    } 
    // Lucknow
    else if (locationStr.includes("lucknow") || nameStr.includes("lucknow")) {
      city = "Lucknow";
    } 
    // Delhi / Jaipur (excluding highway)
    else if (
      (locationStr.includes("delhi") || nameStr.includes("delhi") || locationStr.includes("jaipur") || nameStr.includes("jaipur")) &&
      !locationStr.includes("expressway") && 
      !locationStr.includes("highway") && 
      !locationStr.includes("nh-48")
    ) {
      if (locationStr.includes("delhi") || nameStr.includes("delhi")) {
        city = "Delhi";
      } else if (locationStr.includes("jaipur") || nameStr.includes("jaipur")) {
        city = "Jaipur";
      }
    }
    
    // Gurgaon Heuristics
    if (!city) {
      const isGurgaonKeyword = GURGAON_KEYWORDS.some(kw => locationStr.includes(kw) || nameStr.includes(kw));
      const isGurgaonBuilder = GURGAON_BUILDERS.some(b => builderStr.includes(b) || nameStr.includes(b));
      
      if (isGurgaonKeyword || isGurgaonBuilder || locationStr.includes("sector") || locationStr.includes("sec ")) {
        city = "Gurgaon";
      }
    }

    const state = city ? (CITY_TO_STATE[city] || "") : "";
    
    // Property Type Detection
    let propertyType = "Residential";
    let configStr = (doc.configuration || "").toLowerCase();
    
    if (nameStr.includes("plot") || locationStr.includes("plot") || configStr.includes("plot") || nameStr.includes("sco") || locationStr.includes("sco")) {
      propertyType = "Plot";
    } else if (nameStr.includes("industrial") || locationStr.includes("industrial") || configStr.includes("industrial") || nameStr.includes("warehouse")) {
      propertyType = "Industrial";
    } else if (nameStr.includes("farmhouse") || locationStr.includes("farmhouse") || configStr.includes("farmhouse") || nameStr.includes("farm")) {
      propertyType = "Farmhouse";
    } else if (
      nameStr.includes("commercial") || locationStr.includes("commercial") || configStr.includes("commercial") ||
      nameStr.includes("office") || nameStr.includes("retail") || nameStr.includes("shop") || nameStr.includes("mall") ||
      nameStr.includes("it park") || nameStr.includes("plaza") || nameStr.includes("centre") || nameStr.includes("center") ||
      nameStr.includes("gallery") || nameStr.includes("galleria")
    ) {
      propertyType = "Commercial";
    }

    doc.state = state;
    doc.city = city;
    doc.propertyType = propertyType;

    await doc.save();
    updatedCount++;
  }

  console.log(`Migration Complete! Successfully enriched ${updatedCount} / ${projects.length} project documents.`);
  process.exit(0);
}

run().catch(err => {
  console.error("Migration Failed:", err);
  process.exit(1);
});
