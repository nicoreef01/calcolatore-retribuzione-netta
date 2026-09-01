const eurFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const amountFormatter = new Intl.NumberFormat('it-IT', {
  maximumFractionDigits: 0,
})

// it-IT raggruppa le migliaia solo da 5 cifre (minimumGroupingDigits "min2"),
// ma la reference mostra "€ 1.720": il separatore va forzato a 4 cifre.
// Il carattere NON è hard-coded: viene letto dalle parti del formatter stesso.
const GROUP_SEPARATOR = new Intl.NumberFormat('it-IT')
  .formatToParts(12345.67)
  .find((part) => part.type === 'group')?.value ?? '.'

/** Inserisce il separatore di migliaia ogni 3 cifre usando il separatore di it-IT. */
function withForcedGrouping(parts: Intl.NumberFormatPart[]): Intl.NumberFormatPart[] {
  const integerIndex = parts.findIndex((part) => part.type === 'integer')
  if (integerIndex === -1) {
    return parts
  }

  const integer = parts[integerIndex].value
  const alreadyGrouped = parts.some((part) => part.type === 'group') || integer.length < 4
  if (alreadyGrouped) {
    return parts
  }

  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEPARATOR)
  const result = [...parts]
  result[integerIndex] = { ...parts[integerIndex], value: grouped }
  return result
}

function render(parts: Intl.NumberFormatPart[]): string {
  return withForcedGrouping(parts)
    .map((part) => part.value)
    .join('')
}

/**
 * Formatta un importo con simbolo € in prefix ("€ 30.000"), come da reference grafica.
 * Numero e simbolo arrivano da Intl.NumberFormat; nessun separatore scritto a mano.
 */
export function formatCurrency(value: number): string {
  const parts = eurFormatter.formatToParts(Math.abs(value))
  const currencyPart = parts.find((part) => part.type === 'currency')

  if (!currencyPart) {
    return eurFormatter.format(value)
  }

  const numberParts = parts.filter((part) => part.type !== 'currency')
  // Rimuove lo spazio che it-IT mette tra numero e simbolo ("30.000 €" → "30.000").
  while (numberParts.length > 0 && numberParts[numberParts.length - 1].type === 'literal') {
    numberParts.pop()
  }

  return `${currencyPart.value} ${withForcedGrouping(numberParts)
    .map((part) => part.value)
    .join('')}`
}

/** Solo il numero formattato ("30.000"), usato nel campo con prefisso € dedicato. */
export function formatAmount(value: number): string {
  return render(amountFormatter.formatToParts(Math.abs(value)))
}

/** Importo di trattenuta con segno meno in prefix ("- € 2.757"), `amount` è positivo. */
export function formatDeduction(amount: number): string {
  return `- ${formatCurrency(amount)}`
}
