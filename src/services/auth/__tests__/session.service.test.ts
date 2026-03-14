import {
  createSessionToken,
  verifySessionToken,
  getSessionCookieOptions,
  requireSessionUserFromCookies
} from "../session.service";
import { AppError } from "@/utils/app-error";

// Mock do Next Headers (cookies)
const mockCookieGet = jest.fn();
jest.mock("next/headers", () => ({
  cookies: () => ({
    get: mockCookieGet,
  }),
}));

describe("Serviço de Sessão (session.service.ts)", () => {
  const mockUser = { id: "1", name: "Teste", email: "t@t.com" };
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, AUTH_SESSION_SECRET: "secreto" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("Tokens", () => {
    it("cria um token válido que pode ser verificado em seguida", () => {
      const token = createSessionToken(mockUser);
      expect(typeof token).toBe("string");
      expect(token).toContain("."); // Deve ter o payload e a assinatura separados por ponto

      const decoded = verifySessionToken(token);
      expect(decoded?.user).toEqual(mockUser);
      expect(decoded?.exp).toBeGreaterThan(Date.now() / 1000);
    });

    it("retorna null se tentar verificar token inválido ou falso", () => {
      expect(verifySessionToken(undefined)).toBeNull();
      expect(verifySessionToken("token-sem-assinatura")).toBeNull();
      expect(verifySessionToken("payloadFalso.assinaturaFalsa")).toBeNull();
    });

    it("retorna null se a assinatura do token for adulterada", () => {
      const token = createSessionToken(mockUser);
      const [payload] = token.split(".");
      const tokenAdulterado = `${payload}.assinaturaFakeInvalida`;
      
      expect(verifySessionToken(tokenAdulterado)).toBeNull();
    });
  });

  describe("Opções de Cookie", () => {
    it("retorna opções padrão do cookie", () => {
      const options = getSessionCookieOptions();
      expect(options.name).toBe("authtask_session");
      expect(options.cookieOptions.httpOnly).toBe(true);
      expect(options.cookieOptions.maxAge).toBe(28800); // 8 horas padrão
    });

    it("permite sobrescrever o maxAge do cookie", () => {
      const options = getSessionCookieOptions({ maxAge: 0 });
      expect(options.cookieOptions.maxAge).toBe(0);
    });
  });

  describe("Busca de usuário (requireSessionUserFromCookies)", () => {
    it("retorna o usuário se o cookie for válido", async () => {
      const validToken = createSessionToken(mockUser);
      mockCookieGet.mockReturnValue({ value: validToken });

      const user = await requireSessionUserFromCookies();
      expect(user).toEqual(mockUser);
    });

    it("lança AppError 401 se o cookie não existir ou for inválido", async () => {
      mockCookieGet.mockReturnValue(null); // Simula ausência de cookie

      await expect(requireSessionUserFromCookies()).rejects.toThrow(AppError);
      
      try {
        await requireSessionUserFromCookies();
      } catch (error: any) {
        expect(error.status).toBe(401);
      }
    });
  });
});