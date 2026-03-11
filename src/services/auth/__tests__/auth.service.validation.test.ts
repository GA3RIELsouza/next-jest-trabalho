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

  it ("retorna erro quando a senha está vazia", () => {
    const result = validateLoginPayload({ email: "alguem@gmail.com", password: "" });
    expect(result.password).toBe("Senha é obrigatória.");
  });

  it("retorna erro quando a senha é curta", () => {
    const result = validateLoginPayload({ email: "alguem@gmail.com", password: "a" });
    expect(result.password).toBe("Senha deve conter pelo menos 6 caracteres.");
  });

  it("não retorna erro quando o e-mail e senha foram informados", () => {
    const result = validateLoginPayload({ email: "aluno@authtask.dev", password: "123456" });
    expect(result).toStrictEqual({});
  });

  it("faz trim não retorna erro quando o e-mail e senha foram informados com espaços", () => {
    const result = validateLoginPayload({ email: "  aluno@authtask.dev  ", password: "  123456  " });
    expect(result).toStrictEqual({});
  });
});

describe("hasValidationErrors", () => {
  it("retorna false quando não há erros", () => {
    expect(hasValidationErrors({})).toBe(false);
  });

  it("retorna true quando há erros", () => {
    expect(hasValidationErrors({ email: "E-mail é obrigatório." })).toBe(true);
  });
});