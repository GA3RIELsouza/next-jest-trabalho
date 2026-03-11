import { authenticateUser, sanitizeUserId } from "@/services/auth/auth.service";
import { AppError } from "@/utils/app-error";

describe("authenticateUser", () => {
  it("retorna usuário quando credenciais são válidas", async () => {
    const user = await authenticateUser({
      email: "aluno@authtask.dev",
      password: "123456",
    });
    expect(user).toMatchObject({ email: "aluno@authtask.dev", name: "Aluno Demo" });
  });

  it("lança AppError 401 quando credenciais são inválidas", async () => {
    await expect(
      authenticateUser({ email: "errado@test.com", password: "123456" })
    ).rejects.toThrow(AppError);
    // Verificar status 401
  });
});

describe("sanitizeUserId", () => {
  it("normaliza e limpa o userId", () => {
    expect(sanitizeUserId("  User@123  ")).toBe("user_123");
  });
});