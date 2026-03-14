import { POST } from "../route";

// Mock Salvador do Next.js
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
      cookies: { set: jest.fn() },
    })),
  },
}));

jest.mock("@/services/auth/session.service", () => ({
  getSessionCookieOptions: jest.fn(() => ({ name: "session", cookieOptions: {} })),
}));

describe("API Route: POST /api/logout", () => {
  it("retorna 200 e chama a função de limpar cookie", async () => {
    const response = await POST() as any;
    
    expect(response.status).toBe(200);
    expect(response.cookies.set).toHaveBeenCalled();
  });
});