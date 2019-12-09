export const ACTIVE_TRIAL_STATUSES = [
  // These CTRP statuses appear in results:
  'Active',
  'Approved',
  'Enrolling by Invitation',
  'In Review',
  'Temporarily Closed to Accrual',
  'Temporarily Closed to Accrual and Intervention',
  // These CTRP statuses DO NOT appear in results:
  /// "Administratively Complete",
  /// "Closed to Accrual",
  /// "Closed to Accrual and Intervention",
  /// "Complete",
  /// "Withdrawn"
];

export const ACTIVE_RECRUITMENT_STATUSES = [
  // These statuses appear in results:
  'active',
  'approved',
  'enrolling_by_invitation',
  'in_review',
  'temporarily_closed_to_accrual',
  // These statuses DO NOT appear in results:
  /// "closed_to_accrual",
  /// "completed",
  /// "administratively_complete",
  /// "closed_to_accrual_and_intervention",
  /// "withdrawn"
];

// Specify which fields will be returned in the TrialsResults Object from clinicaltrialsapi
export const SEARCH_RETURNS_FIELDS = [
  'nci_id',
  'nct_id',
  'brief_title',
  'sites.org_name',
  'sites.org_postal_code',
  'eligibility.structured',
  'current_trial_status',
  'sites.org_va',
  'sites.org_country',
  'sites.org_state_or_province',
  'sites.org_city',
  'sites.org_coordinates',
  'sites.recruitment_status',
  'diseases',
];

//These are the two catch all buckets that we must add to the bottom of the list.
//ORDER will matter here.
export const OTHER_MAIN_TYPES = [
  'C2916', //Carcinoma not in main type (Other Carcinoma)
  'C3262', //Neoplasm not in main type (Other Neoplasm)
  'C2991', //Disease or Disorder (Other Disease)
];

export const NIH_ZIPCODE = "20892";