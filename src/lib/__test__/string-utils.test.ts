import { describe, expect, test } from 'bun:test'
import {
  generateId,
  generateRandomPassword,
  generateProfilePicture,
  generateVehicleName,
  vehicleLabel,
  toTitleCase,
  formatRupiah,
  generateReferralCode,
} from '../string-utils'

describe('string-utils', () => {
  describe('generateId', () => {
    test('returns a 32-char uppercase hex string', () => {
      const id = generateId()
      expect(id).toHaveLength(32)
      expect(id).toMatch(/^[0-9A-F]+$/)
    })

    test('generates unique values', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()))
      expect(ids.size).toBeGreaterThan(99)
    })
  })

  describe('generateRandomPassword', () => {
    test('returns default 5-digit numeric string', () => {
      const pw = generateRandomPassword()
      expect(pw).toHaveLength(5)
      expect(pw).toMatch(/^\d{5}$/)
    })

    test('respects custom length', () => {
      expect(generateRandomPassword(8)).toHaveLength(8)
      expect(generateRandomPassword(3)).toHaveLength(3)
    })
  })

  describe('generateProfilePicture', () => {
    test('returns ui-avatars URL with encoded name', () => {
      const url = generateProfilePicture('John Doe')
      expect(url).toBe('https://ui-avatars.com/api/?name=John Doe&background=random')
    })
  })

  describe('generateVehicleName', () => {
    test('combines parts in title case', () => {
      const name = generateVehicleName('toyota', 'avanza', 'minibus', 2022)
      expect(name).toBe('Toyota Avanza Minibus 2022')
    })
  })

  describe('vehicleLabel', () => {
    test('includes plate number when provided', () => {
      expect(vehicleLabel('Avanza', 'B1234ABC')).toBe('Avanza (B1234ABC)')
    })

    test('falls back when plate is null', () => {
      expect(vehicleLabel('Avanza', null)).toBe('Avanza (tanpa plat)')
    })

    test('falls back when plate is empty string', () => {
      expect(vehicleLabel('Avanza', '')).toBe('Avanza (tanpa plat)')
    })

    test('trims whitespace from plate', () => {
      expect(vehicleLabel('Avanza', '  B1  ')).toBe('Avanza (B1)')
    })
  })

  describe('toTitleCase', () => {
    test('capitalizes each word', () => {
      expect(toTitleCase('hello world')).toBe('Hello World')
    })

    test('handles multiple spaces', () => {
      expect(toTitleCase('hello   world')).toBe('Hello World')
    })

    test('handles empty string', () => {
      expect(toTitleCase('')).toBe('')
    })

    test('lowercases extra capitals', () => {
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World')
    })
  })

  describe('formatRupiah', () => {
    test('formats number with thousand separators', () => {
      expect(formatRupiah(1500000)).toBe('Rp.1.500.000')
    })

    test('handles small numbers', () => {
      expect(formatRupiah(500)).toBe('Rp.500')
    })

    test('handles zero', () => {
      expect(formatRupiah(0)).toBe('Rp.0')
    })
  })

  describe('generateReferralCode', () => {
    test('returns default 5-char alphanumeric', () => {
      const code = generateReferralCode()
      expect(code).toHaveLength(5)
      expect(code).toMatch(/^[A-Z0-9]+$/)
    })

    test('respects custom length', () => {
      expect(generateReferralCode(10)).toHaveLength(10)
    })
  })
})
