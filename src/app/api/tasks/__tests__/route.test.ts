import { GET, POST } from "../route";
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
  taskService: { listTasks: jest.fn(), createTask: jest.fn() },
}));

describe("API Route: /api/tasks", () => {
  it("GET: deve retornar 200", async () => {
    (sessionService.requireSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "1" });
    (taskService.listTasks as jest.Mock).mockResolvedValue([{ id: "t1" }]);

    const response = await GET() as any;
    expect(response.status).toBe(200);
  });

  it("POST: deve retornar 201", async () => {
    (sessionService.requireSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "1" });
    (taskService.createTask as jest.Mock).mockResolvedValue({ id: "t2" });

    const request = new Request("http://localhost", {
      method: "POST", body: JSON.stringify({ title: "Nova" })
    });

    const response = await POST(request) as any;
    expect(response.status).toBe(201);
  });
});