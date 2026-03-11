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
    ).rejects.toMatchObject({
        status: 401
    });
    // Verificar status 401
  });

  it("lança AppError 401 quando a senha está incorreta", async () => {
    await expect(
      authenticateUser({ email: "aluno@authtask.dev", password: "errada" })
    ).rejects.toMatchObject({
        status: 401
    });
    // Verificar status 401
  });

  it("sanitiza o user ID corretamente", () => {
    const result = sanitizeUserId(" User@123 ");
    expect(result).toBe("user_123");
  });
});

describe("sanitizeUserId", () => {
  it("normaliza e limpa o userId", () => {
    expect(sanitizeUserId("  User@123  ")).toBe("user_123");
  });
});