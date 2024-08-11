import mongoose from 'mongoose';

const TermsAndConditionsSchema = new mongoose.Schema(
  {
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
