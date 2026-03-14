import { GET, POST } from "../route";
import * as sessionService from "@/services/auth/session.service";
import { taskService } from "@/services/tasks/task.service";

jest.mock("@/services/auth/session.service");
jest.mock("@/services/tasks/task.service", () => ({
  taskService: {
    listTasks: jest.fn(),
    createTask: jest.fn(),
  },
}));

describe("API Route: /api/tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET: deve retornar a lista de tarefas do usuário logado com status 200", async () => {
    const mockUser = { id: "user_123" };
    const mockTasks = [{ id: "t1", title: "Estudar Jest" }];
    
 
    (sessionService.requireSessionUserFromCookies as jest.Mock).mockResolvedValue(mockUser);
    
    (taskService.listTasks as jest.Mock).mockResolvedValue(mockTasks);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.tasks).toEqual(mockTasks);
    expect(taskService.listTasks).toHaveBeenCalledWith("user_123");
  });

  it("POST: deve criar uma tarefa e retornar status 201", async () => {
    const mockUser = { id: "user_123" };
    const mockTask = { id: "t2", title: "Nova tarefa" };
    
    (sessionService.requireSessionUserFromCookies as jest.Mock).mockResolvedValue(mockUser);
    (taskService.createTask as jest.Mock).mockResolvedValue(mockTask);

    // Cria a requisição simulada
    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "Nova tarefa" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.task).toEqual(mockTask);
    expect(taskService.createTask).toHaveBeenCalledWith({
      userId: "user_123",
      title: "Nova tarefa",
    });
  });
});