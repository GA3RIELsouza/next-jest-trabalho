import { hasValidationErrors, validateLoginPayload } from "@/services/auth/auth.service";

describe("validateLoginPayload", () => {
  it("retorna erro quando e-mail está vazio", () => {
    const result = validateLoginPayload({ email: "", password: "123456" });
    expect(result.email).toBe("E-mail é obrigatório.");
  });

  it("retorna erro quando formato de e-mail é inválido", () => {
    const result = validateLoginPayload({ email: "invalido", password: "123456" });
    expect(result.email).toBe("Formato de e-mail inválido.");
  });

  // ... demais cenários
});

describe("hasValidationErrors", () => {
  it("retorna false quando não há erros", () => {
    expect(hasValidationErrors({})).toBe(false);
  });

  it("retorna true quando há erros", () => {
    expect(hasValidationErrors({ email: "E-mail é obrigatório." })).toBe(true);
  });
});