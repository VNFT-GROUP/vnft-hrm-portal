/**
 * User Function Type — classifies employees for evaluation purposes.
 *
 * - BACK_OFFICE → evaluated on Attendance + Performance
 * - SALES / MARKETING → evaluated on Attendance + KPI Sales
 *
 * Default: BACK_OFFICE (if not provided, backend defaults to this)
 */
export type UserFunctionType = 'BACK_OFFICE' | 'SALES' | 'MARKETING';

export const FUNCTION_TYPE_LABELS: Record<UserFunctionType, string> = {
  BACK_OFFICE: 'Back Office',
  SALES: 'Sales',
  MARKETING: 'Marketing',
};

export const FUNCTION_TYPE_OPTIONS: { value: UserFunctionType; label: string }[] = [
  { value: 'BACK_OFFICE', label: 'Back Office' },
  { value: 'SALES', label: 'Sales' },
  { value: 'MARKETING', label: 'Marketing' },
];
