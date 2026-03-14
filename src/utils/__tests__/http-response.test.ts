import { toErrorResponse, badRequest } from "../http-response";
import { AppError } from "../app-error";

// MOCK SALVADOR DO NEXT.JS
// Finge o comportamento do NextResponse para o Jest não quebrar com o erro "Request is not defined"
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}));

describe("Utilitários HTTP - http-response", () => {
  it("toErrorResponse retorna status correto para AppError", async () => {
    const error = new AppError("TESTE", "Erro de teste", 400);
    // Usamos 'as any' porque o retorno agora é o nosso mock simplificado
    const response = toErrorResponse(error) as any;
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.code).toBe("TESTE");
  });

  it("toErrorResponse retorna status 500 para erros genéricos", async () => {
    const error = new Error("Erro fatal do sistema");
    const response = toErrorResponse(error) as any;
    
    expect(response.status).toBe(500);
  });

  it("badRequest lança um AppError com status 400", () => {
    expect(() => badRequest("Dados inválidos")).toThrow(AppError);
    
    try {
      badRequest("Dados inválidos");
    } catch (error: any) {
      expect(error.status).toBe(400);
      expect(error.code).toBe("BAD_REQUEST");
    }
  });
});