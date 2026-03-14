import { PATCH, DELETE } from "../route";
import * as sessionService from "@/services/auth/session.service";
import { taskService } from "@/services/tasks/task.service";

// Mock Salvador do Next.js
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}));

jest.mock("@/services/auth/session.service");
jest.mock("@/services/tasks/task.service", () => ({
  taskService: { toggleTaskCompletion: jest.fn(), deleteTask: jest.fn() },
}));

describe("API Route: /api/tasks/[taskId]", () => {
  const context = { params: Promise.resolve({ taskId: "t1" }) };

  it("PATCH: retorna 400 se faltar completed", async () => {
    (sessionService.requireSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "1" });
    
    const request = new Request("http://localhost", {
      method: "PATCH", body: JSON.stringify({}) 
    });

    const response = await PATCH(request, context) as any;
    expect(response.status).toBe(400);
  });

  it("DELETE: retorna 200", async () => {
    (sessionService.requireSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "1" });
    
    const request = new Request("http://localhost", { method: "DELETE" });
    const response = await DELETE(request, context) as any;
    
    expect(response.status).toBe(200);
  });
});
