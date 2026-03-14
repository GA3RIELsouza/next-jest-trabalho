import { readUnverifiedSessionToken } from "../session.edge";

describe("session.edge.ts", () => {
  it("retorna null se não houver token", () => {
    expect(readUnverifiedSessionToken(undefined)).toBeNull();
  });

  it("retorna null para tokens mal formatados", () => {
    expect(readUnverifiedSessionToken("token-invalido")).toBeNull();
  });

  it("decodifica um payload base64 válido", () => {
    const user = { email: "teste@teste.com" };
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = Buffer.from(JSON.stringify({ user, exp })).toString("base64");
    
    const result = readUnverifiedSessionToken(`${payload}.assinatura`);
    expect(result?.user.email).toBe("teste@teste.com");
  });
});