import { describe, it, expect, beforeEach } from 'vitest'
import { getToken, setToken, removeToken, getAuthHeaders } from '@/shared/utils/token'

describe('token 工具函数', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getToken', () => {
    it('未设置时返回 null', () => {
      expect(getToken()).toBeNull()
    })

    it('已设置时返回 token', () => {
      localStorage.setItem('admin_token', 'test-token-123')
      expect(getToken()).toBe('test-token-123')
    })
  })

  describe('setToken', () => {
    it('正确存储 token', () => {
      setToken('my-token')
      expect(localStorage.getItem('admin_token')).toBe('my-token')
    })
  })

  describe('removeToken', () => {
    it('清除已存储的 token', () => {
      localStorage.setItem('admin_token', 'old-token')
      removeToken()
      expect(localStorage.getItem('admin_token')).toBeNull()
    })
  })

  describe('getAuthHeaders', () => {
    it('有 token 时返回 Authorization 头', () => {
      setToken('bearer-token')
      expect(getAuthHeaders()).toEqual({ Authorization: 'Bearer bearer-token' })
    })

    it('无 token 时返回空对象', () => {
      expect(getAuthHeaders()).toEqual({})
    })
  })
})
