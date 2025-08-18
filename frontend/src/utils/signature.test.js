import { describe, it, expect } from 'vitest'
import { generateSignatureWithTimestamp, env } from './signature.js'

describe('M-Team API Signature', () => {
  describe('generateSignatureWithTimestamp', () => {
    it('should generate correct signature for sample 1', () => {
      // Sample 1 数据
      const path = "/torrents"
      const method = "POST"
      const timestamp = 1755528246007
      const expectedSignature = "g0yk8laAzBxGvdV9nVvUqJNlm4Q="

      const result = generateSignatureWithTimestamp(path, method, timestamp)

      expect(result._timestamp).toBe(timestamp)
      expect(result._sgin).toBe(expectedSignature)
    })

    it('should generate correct signature for sample 2', () => {
      // Sample 2 数据
      const path = "/user/profile"
      const method = "POST"
      const timestamp = 1755528362859
      const expectedSignature = "YCFBDpMYc95YExOfBfKAXadc/Yo="

      const result = generateSignatureWithTimestamp(path, method, timestamp)

      expect(result._timestamp).toBe(timestamp)
      expect(result._sgin).toBe(expectedSignature)
    })

    it('should include both _timestamp and _sgin parameters', () => {
      const path = "/test"
      const method = "GET"
      const timestamp = Date.now()

      const result = generateSignatureWithTimestamp(path, method, timestamp)

      expect(result).toHaveProperty('_timestamp')
      expect(result).toHaveProperty('_sgin')
      expect(typeof result._timestamp).toBe('number')
      expect(typeof result._sgin).toBe('string')
    })

    it('should generate different signatures for different paths', () => {
      const timestamp = 1755528246007
      const method = "POST"

      const result1 = generateSignatureWithTimestamp("/path1", method, timestamp)
      const result2 = generateSignatureWithTimestamp("/path2", method, timestamp)

      expect(result1._sgin).not.toBe(result2._sgin)
    })

    it('should generate different signatures for different methods', () => {
      const timestamp = 1755528246007
      const path = "/test"

      const result1 = generateSignatureWithTimestamp(path, "GET", timestamp)
      const result2 = generateSignatureWithTimestamp(path, "POST", timestamp)

      expect(result1._sgin).not.toBe(result2._sgin)
    })

    it('should generate different signatures for different timestamps', () => {
      const path = "/test"
      const method = "GET"

      const result1 = generateSignatureWithTimestamp(path, method, 1755528246007)
      const result2 = generateSignatureWithTimestamp(path, method, 1755528246008)

      expect(result1._sgin).not.toBe(result2._sgin)
    })
  })

  describe('Environment Configuration', () => {
    it('should have correct environment values', () => {
      expect(env.server).toBe("https://api.m-team.cc/api")
      expect(env.secret).toBe("HLkPcWmycL57mfJt")
      expect(env.version).toBe("1.1.4")
    })
  })
})
