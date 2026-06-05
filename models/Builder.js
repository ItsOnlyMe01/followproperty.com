import mongoose from "mongoose";

const BuilderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Builder name is required"],
      trim: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, "Builder slug is required"],
      trim: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Builder = mongoose.models.Builder || mongoose.model("Builder", BuilderSchema);

export default Builder;
