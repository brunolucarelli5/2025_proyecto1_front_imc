import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ImcForm from './ImcForm'
import { apiService } from './services/service'
import type { CalculoImc } from './services/types'

vi.mock('./services/service')
const mockApiService = vi.mocked(apiService)

describe('ImcForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders IMC calculator form correctly', () => {
    render(<ImcForm />)

    expect(screen.getByText('Calculadora de IMC')).toBeInTheDocument()
    expect(screen.getByText('Descubre tu Índice de Masa Corporal con nuestra herramienta avanzada')).toBeInTheDocument()
    expect(screen.getByLabelText(/altura/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/peso/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calcular imc/i })).toBeInTheDocument()
  })

  it('updates form fields when user types valid numbers', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const alturaInput = screen.getByLabelText(/altura/i)
    const pesoInput = screen.getByLabelText(/peso/i)

    await user.type(alturaInput, '1.75')
    await user.type(pesoInput, '70')

    expect(alturaInput).toHaveValue('1.75')
    expect(pesoInput).toHaveValue('70')
  })

  it('validates and formats altura input to 2 decimal places', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const alturaInput = screen.getByLabelText(/altura/i)

    // Try to input more than 2 decimal places
    await user.type(alturaInput, '1.756')

    // Should only allow 2 decimal places
    expect(alturaInput).toHaveValue('1.75')
  })

  it('validates and formats peso input to 2 decimal places', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const pesoInput = screen.getByLabelText(/peso/i)

    // Try to input more than 2 decimal places
    await user.type(pesoInput, '70.567')

    // Should only allow 2 decimal places
    expect(pesoInput).toHaveValue('70.56')
  })

  it('prevents non-numeric input in altura field', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const alturaInput = screen.getByLabelText(/altura/i)

    await user.type(alturaInput, 'abc1.75def')

    // Should only allow the numeric part
    expect(alturaInput).toHaveValue('1.75')
  })

  it('prevents non-numeric input in peso field', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const pesoInput = screen.getByLabelText(/peso/i)

    await user.type(pesoInput, 'abc70def')

    // Should only allow the numeric part
    expect(pesoInput).toHaveValue('70')
  })

  it('shows validation error for altura out of range on blur', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const alturaInput = screen.getByLabelText(/altura/i)

    await user.type(alturaInput, '5.0')
    await user.tab() // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText('La altura debe ser mayor a 0 y menor a 3 metros.')).toBeInTheDocument()
    })
  })

  it('shows validation error for peso out of range on blur', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const pesoInput = screen.getByLabelText(/peso/i)

    await user.type(pesoInput, '600')
    await user.tab() // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText('El peso debe ser mayor a 0 y menor a 500 kg.')).toBeInTheDocument()
    })
  })

  it('calculates IMC successfully and displays result', async () => {
    const user = userEvent.setup()
    const mockResult: CalculoImc = {
      fecha: new Date('2023-12-01'),
      fecha_calculo: new Date('2023-12-01'),
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'Peso normal'
    }

    mockApiService.calcular.mockResolvedValue(mockResult)

    render(<ImcForm />)

    const alturaInput = screen.getByLabelText(/altura/i)
    const pesoInput = screen.getByLabelText(/peso/i)
    const submitButton = screen.getByRole('button', { name: /calcular imc/i })

    await user.type(alturaInput, '1.75')
    await user.type(pesoInput, '70')
    await user.click(submitButton)

    expect(mockApiService.calcular).toHaveBeenCalledWith(1.75, 70)

    await waitFor(() => {
      expect(screen.getByText('Tu IMC es:')).toBeInTheDocument()
      expect(screen.getByText('22.9')).toBeInTheDocument() // Rounded to 1 decimal
      expect(screen.getByText('Peso normal')).toBeInTheDocument()
    })
  })

  it('displays loading state during calculation', async () => {
    const user = userEvent.setup()

    // Create a promise that we can control
    let resolvePromise: (value: CalculoImc) => void
    const mockPromise = new Promise<CalculoImc>((resolve) => {
      resolvePromise = resolve
    })

    mockApiService.calcular.mockReturnValue(mockPromise)

    render(<ImcForm />)

    const alturaInput = screen.getByLabelText(/altura/i)
    const pesoInput = screen.getByLabelText(/peso/i)
    const submitButton = screen.getByRole('button', { name: /calcular imc/i })

    await user.type(alturaInput, '1.75')
    await user.type(pesoInput, '70')
    await user.click(submitButton)

    // Should show loading state
    expect(screen.getByText('Calculando...')).toBeInTheDocument()

    // Resolve the promise
    const mockResult: CalculoImc = {
      fecha: new Date('2023-12-01'),
      fecha_calculo: new Date('2023-12-01'),
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'Peso normal'
    }
    resolvePromise!(mockResult)

    await waitFor(() => {
      expect(screen.queryByText('Calculando...')).not.toBeInTheDocument()
      expect(screen.getByText('Tu IMC es:')).toBeInTheDocument()
    })
  })

  it('displays error message when calculation fails', async () => {
    const user = userEvent.setup()

    mockApiService.calcular.mockRejectedValue(new Error('Server error'))

    render(<ImcForm />)

    const alturaInput = screen.getByLabelText(/altura/i)
    const pesoInput = screen.getByLabelText(/peso/i)
    const submitButton = screen.getByRole('button', { name: /calcular imc/i })

    await user.type(alturaInput, '1.75')
    await user.type(pesoInput, '70')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Error al calcular el IMC. Verifica si el backend está corriendo.')).toBeInTheDocument()
    })
  })

  it('validates form before submission', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const submitButton = screen.getByRole('button', { name: /calcular imc/i })

    // Try to submit with empty fields
    await user.click(submitButton)

    expect(mockApiService.calcular).not.toHaveBeenCalled()
  })

  it('shows validation error for invalid altura values on submit', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const alturaInput = screen.getByLabelText(/altura/i)
    const pesoInput = screen.getByLabelText(/peso/i)
    const submitButton = screen.getByRole('button', { name: /calcular imc/i })

    await user.type(alturaInput, '5.0') // Invalid altura
    await user.type(pesoInput, '70')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('La altura debe ser mayor a 0 y menor a 3 metros.')).toBeInTheDocument()
    })

    expect(mockApiService.calcular).not.toHaveBeenCalled()
  })

  it('shows validation error for invalid peso values on submit', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const alturaInput = screen.getByLabelText(/altura/i)
    const pesoInput = screen.getByLabelText(/peso/i)
    const submitButton = screen.getByRole('button', { name: /calcular imc/i })

    await user.type(alturaInput, '1.75')
    await user.type(pesoInput, '600') // Invalid peso
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('El peso debe ser mayor a 0 y menor a 500 kg.')).toBeInTheDocument()
    })

    expect(mockApiService.calcular).not.toHaveBeenCalled()
  })

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup()
    const mockResult: CalculoImc = {
      fecha: new Date('2023-12-01'),
      fecha_calculo: new Date('2023-12-01'),
      peso: 70,
      altura: 1.75,
      imc: 22.86,
      categoria: 'Peso normal'
    }

    mockApiService.calcular.mockResolvedValue(mockResult)

    render(<ImcForm />)

    const alturaInput = screen.getByLabelText(/altura/i)
    const pesoInput = screen.getByLabelText(/peso/i)
    const submitButton = screen.getByRole('button', { name: /calcular imc/i })

    // Fill form and submit
    await user.type(alturaInput, '1.75')
    await user.type(pesoInput, '70')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Tu IMC es:')).toBeInTheDocument()
    })

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /calcular nuevo imc/i })
    await user.click(resetButton)

    // Form should be reset
    expect(alturaInput).toHaveValue('')
    expect(pesoInput).toHaveValue('')
    expect(screen.queryByText('Tu IMC es:')).not.toBeInTheDocument()
  })

  it('displays appropriate health advice for each BMI category', async () => {
    const user = userEvent.setup()

    const categories = [
      {
        result: { fecha: new Date('2023-12-01'), fecha_calculo: new Date('2023-12-01'), peso: 50, altura: 1.75, imc: 16.3, categoria: 'Bajo peso' },
        expectedAdvice: 'Considera consultar con un nutricionista para desarrollar un plan personalizado de ganancia de peso saludable.'
      },
      {
        result: { fecha: new Date('2023-12-01'), fecha_calculo: new Date('2023-12-01'), peso: 70, altura: 1.75, imc: 22.86, categoria: 'Peso normal' },
        expectedAdvice: '¡Excelente! Mantén un estilo de vida saludable con ejercicio regular y alimentación balanceada.'
      },
      {
        result: { fecha: new Date('2023-12-01'), fecha_calculo: new Date('2023-12-01'), peso: 85, altura: 1.75, imc: 27.8, categoria: 'Sobrepeso' },
        expectedAdvice: 'Te recomendamos incorporar actividad física regular y mantener una dieta balanceada y nutritiva.'
      },
      {
        result: { fecha: new Date('2023-12-01'), fecha_calculo: new Date('2023-12-01'), peso: 110, altura: 1.75, imc: 36.0, categoria: 'Obesidad' },
        expectedAdvice: 'Es importante consultar con un profesional de la salud para desarrollar un plan integral y personalizado.'
      }
    ]

    for (const { result, expectedAdvice } of categories) {
      mockApiService.calcular.mockResolvedValue(result)

      const { unmount } = render(<ImcForm />)

      const alturaInput = screen.getByLabelText(/altura/i)
      const pesoInput = screen.getByLabelText(/peso/i)
      const submitButton = screen.getByRole('button', { name: /calcular imc/i })

      await user.clear(alturaInput)
      await user.clear(pesoInput)
      await user.type(alturaInput, result.altura.toString())
      await user.type(pesoInput, result.peso.toString())
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(expectedAdvice)).toBeInTheDocument()
      })

      // Reset for next iteration
      const resetButton = screen.getByRole('button', { name: /calcular nuevo imc/i })
      await user.click(resetButton)

      // Unmount component to avoid conflicts
      unmount()
    }
  })

  it('disables submit button when form is invalid', async () => {
    const user = userEvent.setup()
    render(<ImcForm />)

    const submitButton = screen.getByRole('button', { name: /calcular imc/i })

    // Initially disabled when empty
    expect(submitButton).toBeDisabled()

    const alturaInput = screen.getByLabelText(/altura/i)
    await user.type(alturaInput, '1.75')

    // Still disabled with only altura
    expect(submitButton).toBeDisabled()

    const pesoInput = screen.getByLabelText(/peso/i)
    await user.type(pesoInput, '70')

    // Should be enabled with valid values
    expect(submitButton).toBeEnabled()
  })
})