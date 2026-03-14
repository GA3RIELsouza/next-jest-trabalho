import { AppError, isAppError } from "@/utils/app-error";

describe("Utilitários - AppError", () => {
  it("deve criar uma instância com code, message e status corretos", () => {
    const error = new AppError("TEST_ERROR", "Mensagem de teste", 400);
    
    expect(error.code).toBe("TEST_ERROR");
    expect(error.message).toBe("Mensagem de teste");
    expect(error.status).toBe(400);
  });

  describe("isAppError", () => {
    it("retorna true para instâncias de AppError", () => {
      const error = new AppError("ERR", "msg", 400);
      expect(isAppError(error)).toBe(true);
    });

    it("retorna false para erros genéricos (Error) ou outros objetos", () => {
      expect(isAppError(new Error("Erro normal do JS"))).toBe(false);
      expect(isAppError(null)).toBe(false);
      expect(isAppError({ message: "Parece erro, mas não é" })).toBe(false);
    });
  });
});