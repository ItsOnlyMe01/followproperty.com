import mongoose from "mongoose";

const BuilderApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      required: true,
      default: "draft",
    },
    builderName: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    contactPersonName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    reraNumber: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const BuilderApplication =
  mongoose.models.BuilderApplication ||
  mongoose.model("BuilderApplication", BuilderApplicationSchema);

export default BuilderApplication;
