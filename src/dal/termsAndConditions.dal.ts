import TermsAndCondition from '../models/termsAndCoditions';

export async function getTermsAndConditions(id: string) {
  return await TermsAndCondition.findOne({ id: id }).then((tc) => {
    return tc;
  });
}

export async function getTermsAndConditionsFromName(name: string) {
  return await TermsAndCondition.findOne({ name: name }).then((tc) => {
    return tc;
  });
}
