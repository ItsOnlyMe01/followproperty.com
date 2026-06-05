import connectDB from "@/lib/db";
import MarketProject from "@/models/MarketProject";
import Builder from "@/models/Builder";
import { normalizeBuilder } from "@/utils/admin/normalization";

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

function inferFields(project) {
  let locationStr = (project.location || "").toLowerCase();
  let nameStr = (project.projectName || "").toLowerCase();
  let builderStr = (project.builderName || "").toLowerCase();
  
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
  else if (locationStr.includes("bangalore") || locationStr.includes("bangalore") || locationStr.includes("bengaluru") || nameStr.includes("bengaluru")) {
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
  // Delhi / Jaipur (excluding highway description false-positives)
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
  
  // Gurgaon Heuristics (no blind defaults)
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
  let configStr = (project.configuration || "").toLowerCase();
  
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

  return {
    ...project,
    state,
    city,
    propertyType
  };
}

export async function POST(req) {
    try {
        await connectDB();

        const projects = await req.json();

        // Enrich projects prior to DB insertion
        const enrichedProjects = projects.map(project => inferFields(project));

        // Resolve builderId for each project in bulk
        const rawBuilderNames = [...new Set(enrichedProjects.map(p => p.builderName).filter(Boolean))];
        const builderNameToIdMap = {};

        for (const rawName of rawBuilderNames) {
            const canonicalName = normalizeBuilder(rawName);
            if (!canonicalName) continue;

            const slug = canonicalName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

            let builder = await Builder.findOne({
                $or: [{ name: canonicalName }, { slug }]
            });

            if (!builder) {
                builder = await Builder.create({
                    name: canonicalName,
                    slug,
                    status: "active"
                });
            }
            builderNameToIdMap[rawName] = builder._id;
        }

        // Attach resolved builderId to enriched projects
        enrichedProjects.forEach(project => {
            if (project.builderName && builderNameToIdMap[project.builderName]) {
                project.builderId = builderNameToIdMap[project.builderName];
            }
        });

        const inserted = await MarketProject.insertMany(
            enrichedProjects
        );

        return Response.json({
            success: true,
            count: inserted.length,
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}