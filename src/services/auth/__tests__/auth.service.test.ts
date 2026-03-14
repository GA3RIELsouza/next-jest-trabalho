import { buildTaskService, validateTaskTitle } from "@/services/tasks/task.service";
import { AppError } from "@/utils/app-error";

// Mock exigido pelo guia para isolar o banco de dados
const mockRepository = {
  listByUser: jest.fn(),
  createForUser: jest.fn(),
  updateCompletion: jest.fn(),
  deleteForUser: jest.fn(),
};

const service = buildTaskService({ repository: mockRepository });

describe("Task Service", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("validateTaskTitle", () => {
    it("lança AppError 400 se o título for vazio", () => {
      expect(() => validateTaskTitle("   ")).toThrow(AppError);
    });

    it("lança AppError 400 se o título for muito curto", () => {
      expect(() => validateTaskTitle("ab")).toThrow(AppError);
    });

    it("lança AppError 400 se o título for muito longo", () => {
      expect(() => validateTaskTitle("a".repeat(121))).toThrow(AppError);
    });

    it("retorna o título limpo (trimmed) se for válido", () => {
      expect(validateTaskTitle("  Fazer exercícios  ")).toBe("Fazer exercícios");
    });
  });

  describe("buildTaskService", () => {
    it("lança AppError se userId for vazio no listTasks", async () => {
      await expect(service.listTasks(" ")).rejects.toThrow(AppError);
    });

    it("listTasks chama repository.listByUser", async () => {
      await service.listTasks("user_123");
      expect(mockRepository.listByUser).toHaveBeenCalledWith("user_123");
    });

    it("createTask chama repository.createForUser", async () => {
      await service.createTask({ userId: "user_1", title: "Nova" });
      expect(mockRepository.createForUser).toHaveBeenCalledWith("user_1", "Nova");
    });

    it("deleteTask chama repository.deleteForUser", async () => {
      await service.deleteTask({ userId: "u1", taskId: "t1" });
      expect(mockRepository.deleteForUser).toHaveBeenCalledWith("u1", "t1");
    });

    it("toggleTaskCompletion chama repository.updateCompletion", async () => {
      await service.toggleTaskCompletion({ userId: "u1", taskId: "t1", completed: true });
      expect(mockRepository.updateCompletion).toHaveBeenCalledWith("u1", "t1", true);
    });

    it("getSummary retorna o cálculo correto de tarefas", async () => {
      mockRepository.listByUser.mockResolvedValue([
        { completed: true },
        { completed: true },
        { completed: false }
      ]);
      const summary = await service.getSummary("user1");
      expect(summary).toEqual({ total: 3, completed: 2, pending: 1 });
    });
  });
});