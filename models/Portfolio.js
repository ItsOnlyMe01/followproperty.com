import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference ID is required'],
    },
    firebaseUid: {
      type: String,
      required: [true, 'Firebase UID is required'],
      index: true,
    },
    builderName: {
      type: String,
      required: [true, 'Builder name is required'],
      trim: true,
    },
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    unitName: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      required: [true, 'Project type is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Locality is required'],
      trim: true,
    },
    superArea: {
      type: Number,
      required: [true, 'Super area is required'],
    },
    carpetArea: {
      type: Number,
      required: [true, 'Carpet area is required'],
    },
    totalPricePaid: {
      type: Number,
      required: [true, 'Total price paid is required'],
    },
    floorNumber: {
      type: Number,
    },
    parkingSpots: {
      type: Number,
    },
    possessionStatus: {
      type: String,
      required: [true, 'Possession status is required'],
      trim: true,
    },
    possessionDateMonth: {
      type: String,
      trim: true,
    },
    possessionDateYear: {
      type: String,
      trim: true,
    },
    expectedPossessionMonth: {
      type: String,
      trim: true,
    },
    expectedPossessionYear: {
      type: String,
      trim: true,
    },
    currentUse: {
      type: String,
      required: [true, 'Current use is required'],
      trim: true,
    },
    ongoingLoan: {
      type: String,
      required: [true, 'Ongoing loan indicator is required'],
      trim: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    monthlyEMI: {
      type: Number,
    },
    rentalIncome: {
      type: String,
      required: [true, 'Rental income indicator is required'],
      trim: true,
    },
    monthlyRent: {
      type: Number,
    },
    alertBuilder: {
      type: Boolean,
      default: true,
    },
    alertProject: {
      type: Boolean,
      default: true,
    },
    alertCity: {
      type: Boolean,
      default: true,
    },
    alertState: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Prevent mongoose from recreating the model on hot reloads
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

export default Portfolio;
