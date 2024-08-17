import mongoose, { Schema } from 'mongoose';

const TermsAndConditionsSchema = new mongoose.Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
      unique: true,
    },
    name: String,
    value: Object,
  },
  { timestamps: true }
);

const TermsAndCondition = mongoose.model(
  'TermsAndConditions',
  TermsAndConditionsSchema,
  'termsAndConditions'
);
export default TermsAndCondition;
