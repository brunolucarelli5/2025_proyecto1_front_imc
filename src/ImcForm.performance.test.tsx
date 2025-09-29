import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ImcForm from './ImcForm'
import { apiService } from './services/service'
import type { CalculoImc } from './services/types'

vi.mock('./services/service')
const mockApiService = vi.mocked(apiService)

interface UnitTestMetrics {
  testName: string;
  renderTime: number;
  interactionTime: number;
  apiResponseTime: number;
  totalTime: number;
  success: boolean;
  timestamp: Date;
}

class UnitTestPerformanceTracker {
  private metrics: UnitTestMetrics[] = [];
  private testStartTime: number = 0;
  private renderStartTime: number = 0;
  private interactionStartTime: number = 0;
  private apiStartTime: number = 0;

  startTest(testName: string) {
    this.testStartTime = performance.now();
    console.log(`🧪 Starting unit test: ${testName}`);
  }

  startRender() {
    this.renderStartTime = performance.now();
  }

  endRender(): number {
    return performance.now() - this.renderStartTime;
  }

  startInteraction() {
    this.interactionStartTime = performance.now();
  }

  endInteraction(): number {
    return performance.now() - this.interactionStartTime;
  }

  startApiCall() {
    this.apiStartTime = performance.now();
  }

  endApiCall(): number {
    return performance.now() - this.apiStartTime;
  }

  endTest(testName: string, success: boolean, renderTime: number = 0, interactionTime: number = 0, apiResponseTime: number = 0) {
    const totalTime = performance.now() - this.testStartTime;

    const metric: UnitTestMetrics = {
      testName,
      renderTime,
      interactionTime,
      apiResponseTime,
      totalTime,
      success,
      timestamp: new Date()
    };

    this.metrics.push(metric);

    console.log(`✅ Unit test metrics for ${testName}:`, {
      'Tiempo de render (ms)': renderTime.toFixed(2),
      'Tiempo de interacción (ms)': interactionTime.toFixed(2),
      'Tiempo de respuesta API (ms)': apiResponseTime.toFixed(2),
      'Tiempo total (ms)': totalTime.toFixed(2),
      'Éxito': success
    });

    return metric;
  }

  calculateUnitTestStats() {
    const successfulTests = this.metrics.filter(m => m.success);
    const totalTests = this.metrics.length;

    if (successfulTests.length === 0) {
      return {
        averageRenderTime: 0,
        averageInteractionTime: 0,
        averageApiTime: 0,
        averageTotalTime: 0,
        successRate: 0,
        totalTests
      };
    }

    return {
      averageRenderTime: successfulTests.reduce((sum, m) => sum + m.renderTime, 0) / successfulTests.length,
      averageInteractionTime: successfulTests.reduce((sum, m) => sum + m.interactionTime, 0) / successfulTests.length,
      averageApiTime: successfulTests.reduce((sum, m) => sum + m.apiResponseTime, 0) / successfulTests.length,
      averageTotalTime: successfulTests.reduce((sum, m) => sum + m.totalTime, 0) / successfulTests.length,
      successRate: (successfulTests.length / totalTests) * 100,
      totalTests
    };
  }

  printUnitTestReport() {
    const stats = this.calculateUnitTestStats();
    console.log('\n🔬 === REPORTE DE MÉTRICAS UNIT TESTS ===');
    console.log(`⚡ Tiempo promedio de render: ${stats.averageRenderTime.toFixed(2)}ms`);
    console.log(`🖱️  Tiempo promedio de interacción: ${stats.averageInteractionTime.toFixed(2)}ms`);
    console.log(`🌐 Tiempo promedio de API: ${stats.averageApiTime.toFixed(2)}ms`);
    console.log(`⏱️  Tiempo total promedio: ${stats.averageTotalTime.toFixed(2)}ms`);
    console.log(`✅ Tasa de éxito: ${stats.successRate.toFixed(2)}%`);
    console.log(`📊 Total de tests: ${stats.totalTests}`);
    console.log('========================================\n');
  }
}

const unitTestTracker = new UnitTestPerformanceTracker();

describe('ImcForm Component - Unit Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    unitTestTracker.printUnitTestReport();
  })

  it('Performance Test 1: Render speed measurement', async () => {
    const testName = 'Component Render Speed';
    unitTestTracker.startTest(testName);
    let success = false;

    try {
      unitTestTracker.startRender();
      render(<ImcForm />);
      const renderTime = unitTestTracker.endRender();

      expect(screen.getByText('Calculadora de IMC')).toBeInTheDocument();
      expect(screen.getByLabelText(/altura/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/peso/i)).toBeInTheDocument();

      success = true;
      unitTestTracker.endTest(testName, success, renderTime);
    } catch (error) {
      unitTestTracker.endTest(testName, false);
      throw error;
    }
  });

  it('Performance Test 2: Form interaction responsiveness', async () => {
    const testName = 'Form Interaction Speed';
    unitTestTracker.startTest(testName);
    let success = false;

    try {
      const user = userEvent.setup();

      unitTestTracker.startRender();
      render(<ImcForm />);
      const renderTime = unitTestTracker.endRender();

      const alturaInput = screen.getByLabelText(/altura/i);
      const pesoInput = screen.getByLabelText(/peso/i);

      unitTestTracker.startInteraction();
      await user.type(alturaInput, '1.75');
      await user.type(pesoInput, '70');
      const interactionTime = unitTestTracker.endInteraction();

      expect(alturaInput).toHaveValue('1.75');
      expect(pesoInput).toHaveValue('70');

      success = true;
      unitTestTracker.endTest(testName, success, renderTime, interactionTime);
    } catch (error) {
      unitTestTracker.endTest(testName, false);
      throw error;
    }
  });

  it('Performance Test 3: API call simulation and response time', async () => {
    const testName = 'API Response Performance';
    unitTestTracker.startTest(testName);
    let success = false;

    try {
      const user = userEvent.setup();
      const mockResult: CalculoImc = {
        fecha_calculo: new Date('2023-12-01'),
        peso: 70,
        altura: 1.75,
        imc: 22.86,
        categoria: 'Normal'
      };

      // Simulate API delay
      mockApiService.calcular.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockResult), 100); // 100ms simulated delay
        });
      });

      unitTestTracker.startRender();
      render(<ImcForm />);
      const renderTime = unitTestTracker.endRender();

      const alturaInput = screen.getByLabelText(/altura/i);
      const pesoInput = screen.getByLabelText(/peso/i);
      const submitButton = screen.getByRole('button', { name: /calcular imc/i });

      unitTestTracker.startInteraction();
      await user.type(alturaInput, '1.75');
      await user.type(pesoInput, '70');
      const interactionTime = unitTestTracker.endInteraction();

      unitTestTracker.startApiCall();
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Tu IMC es:')).toBeInTheDocument();
      });
      const apiTime = unitTestTracker.endApiCall();

      expect(mockApiService.calcular).toHaveBeenCalledWith(1.75, 70);
      expect(screen.getByText('22.9')).toBeInTheDocument();

      success = true;
      unitTestTracker.endTest(testName, success, renderTime, interactionTime, apiTime);
    } catch (error) {
      unitTestTracker.endTest(testName, false);
      throw error;
    }
  });

  it('Performance Test 4: Form validation speed', async () => {
    const testName = 'Form Validation Performance';
    unitTestTracker.startTest(testName);
    let success = false;

    try {
      const user = userEvent.setup();

      unitTestTracker.startRender();
      render(<ImcForm />);
      const renderTime = unitTestTracker.endRender();

      const alturaInput = screen.getByLabelText(/altura/i);

      unitTestTracker.startInteraction();
      await user.type(alturaInput, '5.0'); // Invalid value
      await user.tab(); // Trigger validation
      const interactionTime = unitTestTracker.endInteraction();

      await waitFor(() => {
        expect(screen.getByText('La altura debe ser mayor a 0 y menor a 3 metros.')).toBeInTheDocument();
      });

      success = true;
      unitTestTracker.endTest(testName, success, renderTime, interactionTime);
    } catch (error) {
      unitTestTracker.endTest(testName, false);
      throw error;
    }
  });

  it('Performance Test 5: Multiple calculation cycles', async () => {
    const testName = 'Multiple Calculation Cycles';
    unitTestTracker.startTest(testName);
    let success = false;

    try {
      const user = userEvent.setup();
      const mockResult1: CalculoImc = {
        fecha_calculo: new Date('2023-12-01'),
        peso: 70,
        altura: 1.75,
        imc: 22.86,
        categoria: 'Normal'
      };
      const mockResult2: CalculoImc = {
        fecha_calculo: new Date('2023-12-01'),
        peso: 85,
        altura: 1.75,
        imc: 27.76,
        categoria: 'Sobrepeso'
      };

      mockApiService.calcular
        .mockResolvedValueOnce(mockResult1)
        .mockResolvedValueOnce(mockResult2);

      unitTestTracker.startRender();
      render(<ImcForm />);
      const renderTime = unitTestTracker.endRender();

      const alturaInput = screen.getByLabelText(/altura/i);
      const pesoInput = screen.getByLabelText(/peso/i);
      const submitButton = screen.getByRole('button', { name: /calcular imc/i });

      unitTestTracker.startInteraction();

      // First calculation
      await user.type(alturaInput, '1.75');
      await user.type(pesoInput, '70');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Normal')).toBeInTheDocument();
      });

      // Reset and second calculation
      const resetButton = screen.getByRole('button', { name: /calcular nuevo imc/i });
      await user.click(resetButton);

      await user.type(alturaInput, '1.75');
      await user.type(pesoInput, '85');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Sobrepeso')).toBeInTheDocument();
      });

      const interactionTime = unitTestTracker.endInteraction();

      success = true;
      unitTestTracker.endTest(testName, success, renderTime, interactionTime);
    } catch (error) {
      unitTestTracker.endTest(testName, false);
      throw error;
    }
  });

  it('Performance Test 6: Input formatting speed', async () => {
    const testName = 'Input Formatting Performance';
    unitTestTracker.startTest(testName);
    let success = false;

    try {
      const user = userEvent.setup();

      unitTestTracker.startRender();
      render(<ImcForm />);
      const renderTime = unitTestTracker.endRender();

      const alturaInput = screen.getByLabelText(/altura/i);
      const pesoInput = screen.getByLabelText(/peso/i);

      unitTestTracker.startInteraction();

      // Test rapid input with formatting
      await user.type(alturaInput, '1.756789'); // Should format to 1.75
      await user.type(pesoInput, '70.123456'); // Should format to 70.12

      const interactionTime = unitTestTracker.endInteraction();

      expect(alturaInput).toHaveValue('1.75');
      expect(pesoInput).toHaveValue('70.12');

      success = true;
      unitTestTracker.endTest(testName, success, renderTime, interactionTime);
    } catch (error) {
      unitTestTracker.endTest(testName, false);
      throw error;
    }
  });

  it('Performance Test 7: Theme switching performance', async () => {
    const testName = 'Theme Switching Performance';
    unitTestTracker.startTest(testName);
    let success = false;

    try {
      const user = userEvent.setup();
      const mockResults = [
        { fecha_calculo: new Date('2023-12-01'), peso: 50, altura: 1.75, imc: 16.33, categoria: 'Bajo peso' },
        { fecha_calculo: new Date('2023-12-01'), peso: 70, altura: 1.75, imc: 22.86, categoria: 'Normal' },
        { fecha_calculo: new Date('2023-12-01'), peso: 85, altura: 1.75, imc: 27.76, categoria: 'Sobrepeso' },
        { fecha_calculo: new Date('2023-12-01'), peso: 110, altura: 1.75, imc: 35.92, categoria: 'Obeso' }
      ];

      mockApiService.calcular
        .mockResolvedValueOnce(mockResults[0])
        .mockResolvedValueOnce(mockResults[1])
        .mockResolvedValueOnce(mockResults[2])
        .mockResolvedValueOnce(mockResults[3]);

      unitTestTracker.startRender();
      render(<ImcForm />);
      const renderTime = unitTestTracker.endRender();

      const alturaInput = screen.getByLabelText(/altura/i);
      const pesoInput = screen.getByLabelText(/peso/i);
      const submitButton = screen.getByRole('button', { name: /calcular imc/i });

      unitTestTracker.startInteraction();

      // Test multiple category changes to measure theme switching
      for (let i = 0; i < mockResults.length; i++) {
        const result = mockResults[i];

        await user.clear(alturaInput);
        await user.clear(pesoInput);
        await user.type(alturaInput, result.altura.toString());
        await user.type(pesoInput, result.peso.toString());
        await user.click(submitButton);

        await waitFor(() => {
          expect(screen.getByText(result.categoria)).toBeInTheDocument();
        });

        if (i < mockResults.length - 1) {
          const resetButton = screen.getByRole('button', { name: /calcular nuevo imc/i });
          await user.click(resetButton);
        }
      }

      const interactionTime = unitTestTracker.endInteraction();

      success = true;
      unitTestTracker.endTest(testName, success, renderTime, interactionTime);
    } catch (error) {
      unitTestTracker.endTest(testName, false);
      throw error;
    }
  });

  it('Performance Test 8: Error handling performance', async () => {
    const testName = 'Error Handling Performance';
    unitTestTracker.startTest(testName);
    let success = false;

    try {
      const user = userEvent.setup();

      mockApiService.calcular.mockRejectedValue(new Error('Server error'));

      unitTestTracker.startRender();
      render(<ImcForm />);
      const renderTime = unitTestTracker.endRender();

      const alturaInput = screen.getByLabelText(/altura/i);
      const pesoInput = screen.getByLabelText(/peso/i);
      const submitButton = screen.getByRole('button', { name: /calcular imc/i });

      unitTestTracker.startInteraction();
      await user.type(alturaInput, '1.75');
      await user.type(pesoInput, '70');

      unitTestTracker.startApiCall();
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error al calcular el IMC. Verifica si el backend está corriendo.')).toBeInTheDocument();
      });
      const apiTime = unitTestTracker.endApiCall();
      const interactionTime = unitTestTracker.endInteraction();

      success = true;
      unitTestTracker.endTest(testName, success, renderTime, interactionTime, apiTime);
    } catch (error) {
      unitTestTracker.endTest(testName, false);
      throw error;
    }
  });

  it('Performance Test 9: Component unmount/remount cycle', async () => {
    const testName = 'Mount/Unmount Performance';
    unitTestTracker.startTest(testName);
    let success = false;

    try {
      unitTestTracker.startRender();

      // Multiple mount/unmount cycles to test performance
      for (let i = 0; i < 3; i++) {
        const { unmount } = render(<ImcForm />);

        expect(screen.getByText('Calculadora de IMC')).toBeInTheDocument();

        act(() => {
          unmount();
        });
      }

      const renderTime = unitTestTracker.endRender();

      success = true;
      unitTestTracker.endTest(testName, success, renderTime);
    } catch (error) {
      unitTestTracker.endTest(testName, false);
      throw error;
    }
  });

  it('Performance Test 10: Stress test with rapid interactions', async () => {
    const testName = 'Rapid Interaction Stress Test';
    unitTestTracker.startTest(testName);
    let success = false;

    try {
      const user = userEvent.setup();

      unitTestTracker.startRender();
      render(<ImcForm />);
      const renderTime = unitTestTracker.endRender();

      const alturaInput = screen.getByLabelText(/altura/i);
      const pesoInput = screen.getByLabelText(/peso/i);

      unitTestTracker.startInteraction();

      // Rapid typing and clearing
      for (let i = 0; i < 5; i++) {
        await user.type(alturaInput, '1.75');
        await user.clear(alturaInput);
        await user.type(pesoInput, '70');
        await user.clear(pesoInput);
      }

      // Final valid input
      await user.type(alturaInput, '1.75');
      await user.type(pesoInput, '70');

      const interactionTime = unitTestTracker.endInteraction();

      expect(alturaInput).toHaveValue('1.75');
      expect(pesoInput).toHaveValue('70');

      success = true;
      unitTestTracker.endTest(testName, success, renderTime, interactionTime);
    } catch (error) {
      unitTestTracker.endTest(testName, false);
      throw error;
    }
  });
});