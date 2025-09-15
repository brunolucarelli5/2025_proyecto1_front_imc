import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CalculoImc, RegisterDTO, LoginDTO } from './types'

// Simple mock for axios
const mockGet = vi.fn()
const mockPost = vi.fn()

vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: mockGet,
      post: mockPost,
      defaults: {},
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() }
      }
    })
  }
}))

// Import after mocking
const { apiService } = await import('./service')

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })


  describe('getHistorial', () => {
    it('should fetch paginated history with default parameters', async () => {
      const mockResponse = {
        data: [
          {
            fecha: new Date('2023-12-01'),
            fecha_calculo: new Date('2023-12-01'),
            peso: 70,
            altura: 1.75,
            imc: 22.86,
            categoria: 'Peso normal'
          }
        ],
        total: 1
      }

      mockGet.mockResolvedValue({ data: mockResponse })

      const result = await apiService.getHistorial()
      expect(result).toEqual(mockResponse)
    })

    it('should fetch paginated history with custom parameters', async () => {
      const mockResponse = {
        data: [],
        total: 0
      }

      mockGet.mockResolvedValue({ data: mockResponse })

      await apiService.getHistorial(2, 10, 'asc')

      expect(mockGet).toHaveBeenCalledWith('/imc/pag', {
        params: {
          pag: 2,
          mostrar: 10,
          sort: 'asc'
        }
      })
    })
  })

  describe('calcular', () => {
    it('should calculate IMC successfully', async () => {
      const mockResult: CalculoImc = {
        fecha: new Date('2023-12-01'),
        fecha_calculo: new Date('2023-12-01'),
        peso: 70,
        altura: 1.75,
        imc: 22.86,
        categoria: 'Peso normal'
      }

      mockPost.mockResolvedValue({ data: mockResult })

      const result = await apiService.calcular(1.75, 70)
      expect(result).toEqual(mockResult)
      expect(mockPost).toHaveBeenCalledWith('/imc/calcular', { altura: 1.75, peso: 70 })
    })

    it('should handle calculation errors', async () => {
      const errorMessage = 'Invalid data'
      mockPost.mockRejectedValue(new Error(errorMessage))

      await expect(apiService.calcular(1.75, 70)).rejects.toThrow(errorMessage)
    })
  })

  describe('register', () => {
    it('should register user successfully', async () => {
      const registerData: RegisterDTO = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      }

      const mockResponse = { data: { message: 'User registered successfully' } }
      mockPost.mockResolvedValue(mockResponse)

      const result = await apiService.register(registerData)
      expect(result).toEqual(mockResponse)
      expect(mockPost).toHaveBeenCalledWith('/users/register', registerData)
    })
  })

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData: LoginDTO = {
        email: 'test@example.com',
        password: 'password123'
      }

      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: { email: 'test@example.com' }
        }
      }

      mockPost.mockResolvedValue(mockResponse)

      const result = await apiService.login(loginData)
      expect(result).toEqual(mockResponse)
      expect(mockPost).toHaveBeenCalledWith('/auth/login', loginData)
    })

    it('should handle login errors', async () => {
      const loginData: LoginDTO = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      const error = new Error('Invalid credentials')
      mockPost.mockRejectedValue(error)

      await expect(apiService.login(loginData)).rejects.toThrow('Invalid credentials')
    })
  })
})