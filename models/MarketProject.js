// models/MarketProject.js

import mongoose from "mongoose";

const MarketProjectSchema = new mongoose.Schema(
    {
        projectName: { type: String, index: true },
        location: String,
        launchedDate: String,
        launchingPrice: String,
        possessionDate: String,
        builderName: String,
        units: String,
        totalArea: String,
        towers: String,
        apartmentsPerFloor: String,
        configuration: String,
        status: String,
        marketPrice: String,
        perSqftRate: String,
        perSqftRentalAvg: String,
        monthlyRentRange: String,
        superArea: String,
        avgAreaSqft: String,
        gps: String,
        unitSize: String,
        
        // Added for founder-approved project selection
        state: { type: String, index: true },
        city: { type: String, index: true },
        propertyType: { type: String, index: true },
    },
    {
        timestamps: true,
    }
);

// Compound index for extremely fast query matching on State + City + PropertyType + ProjectName prefix
MarketProjectSchema.index({ state: 1, city: 1, propertyType: 1, projectName: 1 });

export default mongoose.models.MarketProject ||
    mongoose.model("MarketProject", MarketProjectSchema);