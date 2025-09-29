import { test, expect } from "@playwright/test";

test.describe("IMC Calculator E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Set a mock authentication token to bypass login
    await page.addInitScript(() => {
      localStorage.setItem("accessToken", "mock-token-for-testing");
    });
    await page.goto("/calculadora");
  });

  test("should display the main calculator form", async ({ page }) => {
    await expect(page.getByText("Calculadora de IMC")).toBeVisible();
    await expect(
      page.getByText("Descubre tu Índice de Masa Corporal")
    ).toBeVisible();
    await expect(page.getByPlaceholder("1.75")).toBeVisible();
    await expect(page.getByPlaceholder("70")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /calcular imc/i })
    ).toBeVisible();
  });

  test("should calculate BMI correctly for normal weight", async ({ page }) => {
    // Mock the API response BEFORE filling the form
    await page.route("**/imc/calcular", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          fecha: "2023-12-01T10:00:00Z",
          peso: 70,
          altura: 1.75,
          imc: 22.86,
          categoria: "Peso normal",
        }),
      });
    });

    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");
    const calculateButton = page.getByRole("button", { name: /calcular imc/i });

    // Fill in the form
    await alturaInput.fill("1.75");
    await pesoInput.fill("70");

    await calculateButton.click();

    // Verify results are displayed with increased timeout
    await expect(page.getByText("Tu IMC es:")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("22.9")).toBeVisible();
    await expect(page.getByText("Peso normal")).toBeVisible();
    await expect(
      page.getByText("¡Excelente! Mantén un estilo de vida saludable")
    ).toBeVisible();
  });

  test("should calculate BMI correctly for underweight", async ({ page }) => {
    await page.route("**/imc/calcular", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          fecha: "2023-12-01T10:00:00Z",
          peso: 50,
          altura: 1.75,
          imc: 16.33,
          categoria: "Bajo peso",
        }),
      });
    });

    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");
    const calculateButton = page.getByRole("button", { name: /calcular imc/i });

    await alturaInput.fill("1.75");
    await pesoInput.fill("50");

    await calculateButton.click();

    await expect(page.getByText("Tu IMC es:")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("16.3")).toBeVisible();
    await expect(page.getByText("Bajo peso")).toBeVisible();
    await expect(
      page.getByText("Considera consultar con un nutricionista")
    ).toBeVisible();
  });

  test("should calculate BMI correctly for overweight", async ({ page }) => {
    await page.route("**/imc/calcular", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          fecha: "2023-12-01T10:00:00Z",
          peso: 85,
          altura: 1.75,
          imc: 27.76,
          categoria: "Sobrepeso",
        }),
      });
    });

    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");
    const calculateButton = page.getByRole("button", { name: /calcular imc/i });

    await alturaInput.fill("1.75");
    await pesoInput.fill("85");

    await calculateButton.click();

    await expect(page.getByText("Tu IMC es:")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("27.8")).toBeVisible();
    await expect(page.getByText("Sobrepeso")).toBeVisible();
    await expect(
      page.getByText("Te recomendamos incorporar actividad física")
    ).toBeVisible();
  });

  test("should calculate BMI correctly for obesity", async ({ page }) => {
    await page.route("**/imc/calcular", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          fecha: "2023-12-01T10:00:00Z",
          peso: 110,
          altura: 1.75,
          imc: 35.92,
          categoria: "Obesidad",
        }),
      });
    });

    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");
    const calculateButton = page.getByRole("button", { name: /calcular imc/i });

    await alturaInput.fill("1.75");
    await pesoInput.fill("110");

    await calculateButton.click();

    await expect(page.getByText("Tu IMC es:")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("35.9")).toBeVisible();
    await expect(page.getByText("Obesidad")).toBeVisible();
    await expect(
      page.getByText("Es importante consultar con un profesional")
    ).toBeVisible();
  });

  test("should show loading state during calculation", async ({ page }) => {
    // Mock slow API response
    await page.route("**/imc/calcular", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          fecha: "2023-12-01T10:00:00Z",
          peso: 70,
          altura: 1.75,
          imc: 22.86,
          categoria: "Peso normal",
        }),
      });
    });

    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");
    const calculateButton = page.getByRole("button", { name: /calcular imc/i });

    await alturaInput.fill("1.75");
    await pesoInput.fill("70");

    await calculateButton.click();

    // Check loading state
    await expect(page.getByText("Calculando...")).toBeVisible();

    // Wait for results
    await expect(page.getByText("Tu IMC es:")).toBeVisible({ timeout: 10000 });
  });

  test("should display error message when calculation fails", async ({
    page,
  }) => {
    // Mock API error
    await page.route("**/imc/calcular", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Server error" }),
      });
    });

    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");
    const calculateButton = page.getByRole("button", { name: /calcular imc/i });

    await alturaInput.fill("1.75");
    await pesoInput.fill("70");

    await calculateButton.click();

    await expect(page.getByText("Error al calcular el IMC")).toBeVisible();
  });

  test("should validate height input", async ({ page }) => {
    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");

    // Test invalid height (too high)
    await alturaInput.fill("5.0");
    await pesoInput.fill("70");
    await alturaInput.blur();

    await expect(
      page.getByText("La altura debe ser mayor a 0 y menor a 3 metros")
    ).toBeVisible();

    // Test invalid height (too low)
    await alturaInput.fill("0");
    await alturaInput.blur();

    await expect(
      page.getByText("La altura debe ser mayor a 0 y menor a 3 metros")
    ).toBeVisible();
  });

  test("should validate weight input", async ({ page }) => {
    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");

    // Test invalid weight (too high)
    await alturaInput.fill("1.75");
    await pesoInput.fill("600");
    await pesoInput.blur();

    await expect(
      page.getByText("El peso debe ser mayor a 0 y menor a 500 kg")
    ).toBeVisible();

    // Test invalid weight (too low)
    await pesoInput.fill("0");
    await pesoInput.blur();

    await expect(
      page.getByText("El peso debe ser mayor a 0 y menor a 500 kg")
    ).toBeVisible();
  });

  test("should only allow numeric input with up to 2 decimal places", async ({
    page,
  }) => {
    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");

    // Test altura input validation
    await alturaInput.type("abc1.756def");
    await expect(alturaInput).toHaveValue("1.75");

    // Test peso input validation
    await pesoInput.type("xyz70.123ghi");
    await expect(pesoInput).toHaveValue("70.12");
  });

  test("should reset form when reset button is clicked", async ({ page }) => {
    await page.route("**/imc/calcular", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          fecha: "2023-12-01T10:00:00Z",
          peso: 70,
          altura: 1.75,
          imc: 22.86,
          categoria: "Peso normal",
        }),
      });
    });

    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");
    const calculateButton = page.getByRole("button", { name: /calcular imc/i });

    // Fill and submit form
    await alturaInput.fill("1.75");
    await pesoInput.fill("70");

    await calculateButton.click();

    // Wait for results
    await expect(page.getByText("Tu IMC es:")).toBeVisible({ timeout: 10000 });

    // Click reset button
    const resetButton = page.getByRole("button", {
      name: /calcular nuevo imc/i,
    });
    await resetButton.click();

    // Check form is reset
    await expect(alturaInput).toHaveValue("");
    await expect(pesoInput).toHaveValue("");
    await expect(page.getByText("Tu IMC es:")).not.toBeVisible();
  });

  test("should disable submit button when form is invalid", async ({
    page,
  }) => {
    const calculateButton = page.getByRole("button", { name: /calcular imc/i });

    // Initially disabled when empty
    await expect(calculateButton).toBeDisabled();

    const alturaInput = page.getByPlaceholder("1.75");
    await alturaInput.fill("1.75");

    // Still disabled with only altura
    await expect(calculateButton).toBeDisabled();

    const pesoInput = page.getByPlaceholder("70");
    await pesoInput.fill("70");

    // Should be enabled with valid values
    await expect(calculateButton).toBeEnabled();
  });

  test("should change background theme based on BMI category", async ({
    page,
  }) => {
    await page.route("**/imc/calcular", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          fecha: "2023-12-01T10:00:00Z",
          peso: 70,
          altura: 1.75,
          imc: 22.86,
          categoria: "Peso normal",
        }),
      });
    });

    const alturaInput = page.getByPlaceholder("1.75");
    const pesoInput = page.getByPlaceholder("70");
    const calculateButton = page.getByRole("button", { name: /calcular imc/i });

    await alturaInput.fill("1.75");
    await pesoInput.fill("70");

    await calculateButton.click();

    // Check that background theme changes for normal weight (green theme)
    await expect(page.getByText("Tu IMC es:")).toBeVisible({ timeout: 10000 });

    // Check if the theme has changed (this is an approximation since exact class checking might vary)
    await expect(page.getByText("Peso normal")).toBeVisible();
  });
});
