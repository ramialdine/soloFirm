/** Data needed to fill an LLC Articles of Organization form */
export interface LlcFormData {
  /** Business name (will have ", LLC" appended if not already present) */
  businessName: string;
  /** Team size — used to infer tax treatment and management structure */
  teamSize: string;
  /** State the business operates in */
  state: string;
}

/** Supported states for PDF form filling */
export type SupportedFormState = "Rhode Island";

export function isSupportedFormState(state: string): state is SupportedFormState {
  return state === "Rhode Island";
}
