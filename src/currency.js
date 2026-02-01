const COP_FORMATTER = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const COP_NUMBER_FORMATTER = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 0,
});

/**
 * Format a number as COP currency, e.g. 45000 -> "$ 45.000"
 */
export function formatCOP(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return COP_FORMATTER.format(0);
  return COP_FORMATTER.format(Math.round(n));
}

/**
 * Format digits-only string with thousands separators, e.g. "45000" -> "45.000"
 */
export function formatCOPInput(digits) {
  const onlyDigits = String(digits ?? '').replace(/\D/g, '');
  if (!onlyDigits) return '';
  const n = Number(onlyDigits);
  if (!Number.isFinite(n)) return '';
  return COP_NUMBER_FORMATTER.format(n);
}

/**
 * Parse an input string to digits-only (keeps only 0-9).
 */
export function parseCOPInput(input) {
  return String(input ?? '').replace(/\D/g, '');
}

