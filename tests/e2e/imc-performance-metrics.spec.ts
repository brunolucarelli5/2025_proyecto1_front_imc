import { test, expect, Page } from '@playwright/test';

interface PerformanceMetrics {
  taskCompletionTime: number;
  clickCount: number;
  success: boolean;
  testName: string;
  timestamp: Date;
}

class PerformanceTracker {
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;
  private clickCount: number = 0;

  startTracking(testName: string) {
    this.startTime = Date.now();
    this.clickCount = 0;
    console.log(`📊 Starting performance tracking for: ${testName}`);
  }

  trackClick() {
    this.clickCount++;
  }

  endTracking(testName: string, success: boolean): PerformanceMetrics {
    const completionTime = Date.now() - this.startTime;
    const metric: PerformanceMetrics = {
      taskCompletionTime: completionTime,
      clickCount: this.clickCount,
      success: success,
      testName: testName,
      timestamp: new Date()
    };

    this.metrics.push(metric);
    console.log(`✅ Performance metrics for ${testName}:`, {
      'Tiempo de finalización (ms)': completionTime,
      'Número de clics': this.clickCount,
      'Tarea exitosa': success
    });

    return metric;
  }

  getMetrics(): PerformanceMetrics[] {
    return this.metrics;
  }

  calculateAverageMetrics() {
    const successfulTasks = this.metrics.filter(m => m.success);
    const totalTasks = this.metrics.length;

    if (successfulTasks.length === 0) {
      return {
        averageCompletionTime: 0,
        averageClickCount: 0,
        successRate: 0,
        totalTasks: totalTasks
      };
    }

    const avgTime = successfulTasks.reduce((sum, m) => sum + m.taskCompletionTime, 0) / successfulTasks.length;
    const avgClicks = successfulTasks.reduce((sum, m) => sum + m.clickCount, 0) / successfulTasks.length;
    const successRate = (successfulTasks.length / totalTasks) * 100;

    return {
      averageCompletionTime: Math.round(avgTime),
      averageClickCount: Math.round(avgClicks * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
      totalTasks: totalTasks
    };
  }

  printFinalReport() {
    const stats = this.calculateAverageMetrics();
    console.log('\n📈 === REPORTE FINAL DE MÉTRICAS ===');
    console.log(`🎯 Tiempo promedio de concreción de tarea: ${stats.averageCompletionTime}ms`);
    console.log(`🖱️  Número promedio de clics necesario: ${stats.averageClickCount}`);
    console.log(`✅ Tasa de éxito del cálculo de IMC: ${stats.successRate}%`);
    console.log(`📊 Total de tareas ejecutadas: ${stats.totalTasks}`);
    console.log('=====================================\n');
  }
}

// Global performance tracker
const performanceTracker = new PerformanceTracker();

// Helper function to wrap click actions with tracking
async function trackedClick(page: Page, locator: any, tracker: PerformanceTracker) {
  tracker.trackClick();
  await locator.click();
}

test.describe('IMC Calculator - Performance Metrics Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set a mock authentication token to bypass login
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'mock-token-for-testing');
    });
    await page.goto('/calculadora');
  });

  test.afterAll(async () => {
    // Print final performance report
    performanceTracker.printFinalReport();
  });

  test('Métrica 1: Cálculo IMC Normal - Medir tiempo y clics', async ({ page }) => {
    const testName = 'Cálculo IMC Normal';
    performanceTracker.startTracking(testName);

    let success = false;

    try {
      // Mock the API response
      await page.route('**/imc/calcular', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            fecha: '2023-12-01T10:00:00Z',
            peso: 70,
            altura: 1.75,
            imc: 22.86,
            categoria: 'Normal'
          }),
        });
      });

      const alturaInput = page.getByPlaceholder('1.75');
      const pesoInput = page.getByPlaceholder('70');
      const calculateButton = page.getByRole('button', { name: /calcular imc/i });

      // Tracked interactions
      await alturaInput.click();
      performanceTracker.trackClick();
      await alturaInput.fill('1.75');

      await pesoInput.click();
      performanceTracker.trackClick();
      await pesoInput.fill('70');

      await trackedClick(page, calculateButton, performanceTracker);

      // Verify successful calculation
      await expect(page.getByText('Tu IMC es:')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('22.9')).toBeVisible();

      success = true;
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
    }

    performanceTracker.endTracking(testName, success);
  });

  test('Métrica 2: Cálculo IMC Bajo Peso - Validar eficiencia', async ({ page }) => {
    const testName = 'Cálculo IMC Bajo Peso';
    performanceTracker.startTracking(testName);

    let success = false;

    try {
      await page.route('**/imc/calcular', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            fecha: '2023-12-01T10:00:00Z',
            peso: 50,
            altura: 1.75,
            imc: 16.33,
            categoria: 'Bajo peso'
          }),
        });
      });

      const alturaInput = page.getByPlaceholder('1.75');
      const pesoInput = page.getByPlaceholder('70');
      const calculateButton = page.getByRole('button', { name: /calcular imc/i });

      await alturaInput.click();
      performanceTracker.trackClick();
      await alturaInput.fill('1.75');

      await pesoInput.click();
      performanceTracker.trackClick();
      await pesoInput.fill('50');

      await trackedClick(page, calculateButton, performanceTracker);

      await expect(page.getByText('Tu IMC es:')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('16.3')).toBeVisible();
      await expect(page.getByText('Bajo peso')).toBeVisible();

      success = true;
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
    }

    performanceTracker.endTracking(testName, success);
  });

  test('Métrica 3: Cálculo IMC Sobrepeso - Optimización de flujo', async ({ page }) => {
    const testName = 'Cálculo IMC Sobrepeso';
    performanceTracker.startTracking(testName);

    let success = false;

    try {
      await page.route('**/imc/calcular', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            fecha: '2023-12-01T10:00:00Z',
            peso: 85,
            altura: 1.75,
            imc: 27.76,
            categoria: 'Sobrepeso'
          }),
        });
      });

      const alturaInput = page.getByPlaceholder('1.75');
      const pesoInput = page.getByPlaceholder('70');
      const calculateButton = page.getByRole('button', { name: /calcular imc/i });

      await alturaInput.click();
      performanceTracker.trackClick();
      await alturaInput.fill('1.75');

      await pesoInput.click();
      performanceTracker.trackClick();
      await pesoInput.fill('85');

      await trackedClick(page, calculateButton, performanceTracker);

      await expect(page.getByText('Tu IMC es:')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('27.8')).toBeVisible();
      await expect(page.getByText('Sobrepeso')).toBeVisible();

      success = true;
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
    }

    performanceTracker.endTracking(testName, success);
  });

  test('Métrica 4: Cálculo IMC Obesidad - Análisis de rendimiento', async ({ page }) => {
    const testName = 'Cálculo IMC Obesidad';
    performanceTracker.startTracking(testName);

    let success = false;

    try {
      await page.route('**/imc/calcular', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            fecha: '2023-12-01T10:00:00Z',
            peso: 110,
            altura: 1.75,
            imc: 35.92,
            categoria: 'Obeso'
          }),
        });
      });

      const alturaInput = page.getByPlaceholder('1.75');
      const pesoInput = page.getByPlaceholder('70');
      const calculateButton = page.getByRole('button', { name: /calcular imc/i });

      await alturaInput.click();
      performanceTracker.trackClick();
      await alturaInput.fill('1.75');

      await pesoInput.click();
      performanceTracker.trackClick();
      await pesoInput.fill('110');

      await trackedClick(page, calculateButton, performanceTracker);

      await expect(page.getByText('Tu IMC es:')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('35.9')).toBeVisible();
      await expect(page.getByText('Obeso')).toBeVisible();

      success = true;
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
    }

    performanceTracker.endTracking(testName, success);
  });

  test('Métrica 5: Flujo completo con Reset - Medir eficiencia de reinicio', async ({ page }) => {
    const testName = 'Flujo Completo con Reset';
    performanceTracker.startTracking(testName);

    let success = false;

    try {
      await page.route('**/imc/calcular', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            fecha: '2023-12-01T10:00:00Z',
            peso: 70,
            altura: 1.75,
            imc: 22.86,
            categoria: 'Normal'
          }),
        });
      });

      const alturaInput = page.getByPlaceholder('1.75');
      const pesoInput = page.getByPlaceholder('70');
      const calculateButton = page.getByRole('button', { name: /calcular imc/i });

      // Primera calculación
      await alturaInput.click();
      performanceTracker.trackClick();
      await alturaInput.fill('1.75');

      await pesoInput.click();
      performanceTracker.trackClick();
      await pesoInput.fill('70');

      await trackedClick(page, calculateButton, performanceTracker);

      await expect(page.getByText('Tu IMC es:')).toBeVisible({ timeout: 10000 });

      // Reset y nueva calculación
      const resetButton = page.getByRole('button', { name: /calcular nuevo imc/i });
      await trackedClick(page, resetButton, performanceTracker);

      // Verificar que se reseteo
      await expect(alturaInput).toHaveValue('');
      await expect(pesoInput).toHaveValue('');

      // Segunda calculación con nuevos valores
      await alturaInput.click();
      performanceTracker.trackClick();
      await alturaInput.fill('1.80');

      await pesoInput.click();
      performanceTracker.trackClick();
      await pesoInput.fill('75');

      await trackedClick(page, calculateButton, performanceTracker);

      await expect(page.getByText('Tu IMC es:')).toBeVisible({ timeout: 10000 });

      success = true;
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
    }

    performanceTracker.endTracking(testName, success);
  });

  test('Métrica 6: Validación de errores - Tiempo de recuperación', async ({ page }) => {
    const testName = 'Validación de Errores';
    performanceTracker.startTracking(testName);

    let success = false;

    try {
      const alturaInput = page.getByPlaceholder('1.75');
      const pesoInput = page.getByPlaceholder('70');

      // Intentar con valores inválidos para medir tiempo de validación
      await alturaInput.click();
      performanceTracker.trackClick();
      await alturaInput.fill('5.0'); // Altura inválida

      await pesoInput.click();
      performanceTracker.trackClick();
      await pesoInput.fill('70');

      await alturaInput.blur(); // Trigger validation

      // Verificar mensaje de error
      await expect(page.getByText('La altura debe ser mayor a 0 y menor a 3 metros')).toBeVisible();

      // Corregir valor y proceder
      await alturaInput.click();
      performanceTracker.trackClick();
      await alturaInput.clear();
      await alturaInput.fill('1.75');

      // Mock successful API call
      await page.route('**/imc/calcular', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            fecha: '2023-12-01T10:00:00Z',
            peso: 70,
            altura: 1.75,
            imc: 22.86,
            categoria: 'Normal'
          }),
        });
      });

      const calculateButton = page.getByRole('button', { name: /calcular imc/i });
      await trackedClick(page, calculateButton, performanceTracker);

      await expect(page.getByText('Tu IMC es:')).toBeVisible({ timeout: 10000 });

      success = true;
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
    }

    performanceTracker.endTracking(testName, success);
  });

  test('Métrica 7: Error de API - Manejo de fallos', async ({ page }) => {
    const testName = 'Error de API';
    performanceTracker.startTracking(testName);

    let success = false;

    try {
      // Mock API error
      await page.route('**/imc/calcular', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' }),
        });
      });

      const alturaInput = page.getByPlaceholder('1.75');
      const pesoInput = page.getByPlaceholder('70');
      const calculateButton = page.getByRole('button', { name: /calcular imc/i });

      await alturaInput.click();
      performanceTracker.trackClick();
      await alturaInput.fill('1.75');

      await pesoInput.click();
      performanceTracker.trackClick();
      await pesoInput.fill('70');

      await trackedClick(page, calculateButton, performanceTracker);

      // Verificar que el error se maneja correctamente
      await expect(page.getByText('Error al calcular el IMC')).toBeVisible();

      // En caso de error, consideramos que el sistema manejó correctamente la situación
      success = true;
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
    }

    performanceTracker.endTracking(testName, success);
  });

  test('Métrica 8: Carga rápida de formulario - Tiempo de inicialización', async ({ page }) => {
    const testName = 'Carga Rápida de Formulario';
    performanceTracker.startTracking(testName);

    let success = false;

    try {
      // Verificar que el formulario carga rápidamente
      await expect(page.getByText('Calculadora de IMC')).toBeVisible({ timeout: 5000 });
      await expect(page.getByPlaceholder('1.75')).toBeVisible();
      await expect(page.getByPlaceholder('70')).toBeVisible();
      await expect(page.getByRole('button', { name: /calcular imc/i })).toBeVisible();

      success = true;
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
    }

    performanceTracker.endTracking(testName, success);
  });

  test('Métrica 9: Entrada por teclado optimizada - Mínimos clics', async ({ page }) => {
    const testName = 'Entrada por Teclado Optimizada';
    performanceTracker.startTracking(testName);

    let success = false;

    try {
      await page.route('**/imc/calcular', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            fecha: '2023-12-01T10:00:00Z',
            peso: 72,
            altura: 1.78,
            imc: 22.73,
            categoria: 'Normal'
          }),
        });
      });

      const alturaInput = page.getByPlaceholder('1.75');
      const pesoInput = page.getByPlaceholder('70');

      // Usar navegación por teclado para minimizar clics
      await alturaInput.focus();
      performanceTracker.trackClick(); // Focus cuenta como interacción
      await alturaInput.fill('1.78');

      // Navegar con Tab
      await page.keyboard.press('Tab');
      await pesoInput.fill('72');

      // Enviar con Enter
      await page.keyboard.press('Enter');
      performanceTracker.trackClick(); // Enter cuenta como interacción

      await expect(page.getByText('Tu IMC es:')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('22.7')).toBeVisible();

      success = true;
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
    }

    performanceTracker.endTracking(testName, success);
  });

  test('Métrica 10: Rendimiento con animaciones - Tiempo real de UI', async ({ page }) => {
    const testName = 'Rendimiento con Animaciones';
    performanceTracker.startTracking(testName);

    let success = false;

    try {
      await page.route('**/imc/calcular', async route => {
        // Simular latencia de red real
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            fecha: '2023-12-01T10:00:00Z',
            peso: 70,
            altura: 1.75,
            imc: 22.86,
            categoria: 'Normal'
          }),
        });
      });

      const alturaInput = page.getByPlaceholder('1.75');
      const pesoInput = page.getByPlaceholder('70');
      const calculateButton = page.getByRole('button', { name: /calcular imc/i });

      await alturaInput.click();
      performanceTracker.trackClick();
      await alturaInput.fill('1.75');

      await pesoInput.click();
      performanceTracker.trackClick();
      await pesoInput.fill('70');

      await trackedClick(page, calculateButton, performanceTracker);

      // Verificar estado de carga
      await expect(page.getByText('Calculando...')).toBeVisible();

      // Esperar resultado con animaciones
      await expect(page.getByText('Tu IMC es:')).toBeVisible({ timeout: 10000 });

      // Verificar que las animaciones completaron
      await page.waitForTimeout(1000); // Tiempo para animaciones
      await expect(page.getByText('22.9')).toBeVisible();

      success = true;
    } catch (error) {
      console.error(`Error in ${testName}:`, error);
    }

    performanceTracker.endTracking(testName, success);
  });
});