/**
 * NPI check digit: Luhn over "80840" + the first 9 digits (the 80840 prefix is the
 * health-industry issuer number the NPI standard uses).
 */
export const getNpiCheckDigit = (firstNineDigits: string) => {
  const digits = `80840${firstNineDigits}`
  let sum = 0
  // The check digit will be appended, so the rightmost digit here is doubled first.
  for (let i = digits.length - 1, double = true; i >= 0; i--, double = !double) {
    let value = Number(digits[i])
    if (double) {
      value *= 2
      if (value > 9) value -= 9
    }
    sum += value
  }
  return (10 - (sum % 10)) % 10
}

export const isValidNpi = (value: string) =>
  /^\d{10}$/.test(value) && getNpiCheckDigit(value.slice(0, 9)) === Number(value[9])

/** Builds a valid NPI from 9 digits (used by the seed data). */
export const buildNpi = (firstNineDigits: string) =>
  `${firstNineDigits}${getNpiCheckDigit(firstNineDigits)}`
