import { POST } from "../route";
import * as authService from "@/services/auth/auth.service";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
      cookies: { set: jest.fn() },
    })),
  },
}));

jest.mock("@/services/auth/auth.service");
jest.mock("@/services/auth/session.service", () => ({
  createSessionToken: jest.fn(() => "token"),
  getSessionCookieOptions: jest.fn(() => ({ name: "n", cookieOptions: {} })),
}));

describe("API: Login", () => {
  it("deve retornar 200 e setar cookie ao autenticar", async () => {
    (authService.validateLoginPayload as jest.Mock).mockReturnValue({});
    (authService.hasValidationErrors as jest.Mock).mockReturnValue(false);
    (authService.authenticateUser as jest.Mock).mockResolvedValue({ id: "1", email: "a@a.com" });

    const req = new Request("http://l", { method: "POST", body: JSON.stringify({ email: "a@a.com", password: "123" }) });
    const res = await POST(req) as any;
    
    expect(res.status).toBe(200);
    expect(res.cookies.set).toHaveBeenCalled();
  });
});