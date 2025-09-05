export function generateOtp(length = 6): string {
  const digits = "0123456789"
  let code = ""
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)]
  }
  return code
}

export function expiryTimestamp(minutes = 10): string {
  // ISO string for consistent storage
  const d = new Date(Date.now() + minutes * 60 * 1000)
  return d.toISOString()
}

export function isExpired(input?: string | Date | null): boolean {
  if (!input) return true
  let expMs: number
  if (input instanceof Date) {
    expMs = input.getTime()
  } else {
    const parsed = Date.parse(input)
    if (Number.isNaN(parsed)) return true
    expMs = parsed
  }
  return Date.now() > expMs
}
