import mongoose, { Schema } from "mongoose";

const RFPSchema = new Schema(
  {
    email: { type: String, required: true },
    rawDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Closed"],
      default: "Draft",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // CRUCIAL: Storing the AI's JSON output
    // We use Schema.Types.Mixed or 'Object' to allow flexible JSON data
    structuredRequirements: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RFP", RFPSchema);
