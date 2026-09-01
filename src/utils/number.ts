export function formatPercent(percentage: number, decimals = 1): string {
  const formatter = new Intl.NumberFormat('it-IT', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return formatter.format(percentage / 100)
}

/** "% della RAL" usato nelle righe di dettaglio: "9,2% della RAL". */
export function formatPercentOfGross(percentage: number): string {
  return `${formatPercent(percentage)} della RAL`
}

/**
 * Estrae un numero intero da input libero (solo cifre).
 * L'importo RAL del prototipo è a interi: separatori e simboli vengono ignorati.
 */
export function parseAmount(raw: string): number {
  const digits = raw.replace(/[^\d]/g, '')
  return digits.length === 0 ? Number.NaN : Number.parseInt(digits, 10)
}
