import { firestoreTaskRepository } from "../task.repository";
import { AppError } from "@/utils/app-error";

// Configura variáveis de ambiente falsas para o teste passar pela verificação
const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  process.env = {
    ...originalEnv,
    FIREBASE_PROJECT_ID: "mock-project",
    FIREBASE_WEB_API_KEY: "mock-key",
  };
  global.fetch = jest.fn();
});

afterAll(() => {
  process.env = originalEnv;
});

describe("task.repository.ts", () => {
  
  describe("listByUser", () => {
    it("retorna uma lista de tarefas ordenadas por data", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({
          documents: [
            { name: "task1", fields: { title: { stringValue: "Antiga" }, createdAt: { integerValue: "10" } } },
            { name: "task2", fields: { title: { stringValue: "Nova" }, createdAt: { integerValue: "20" } } }
          ]
        })
      });

      const tasks = await firestoreTaskRepository.listByUser("user1");
      expect(tasks).toHaveLength(2);
      // A tarefa "Nova" (createdAt 20) deve vir antes da "Antiga" (createdAt 10)
      expect(tasks[0].title).toBe("Nova"); 
    });

    it("retorna array vazio se o status for 404 (usuário sem tarefas)", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: 404 });
      const tasks = await firestoreTaskRepository.listByUser("user1");
      expect(tasks).toEqual([]);
    });

    it("lança erro se a resposta não for ok e não for 404", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ status: 500, ok: false });
      await expect(firestoreTaskRepository.listByUser("u")).rejects.toThrow(AppError);
    });
  });

  describe("createForUser", () => {
    it("cria uma tarefa e retorna o objeto formatado", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: "tasks/t1",
          fields: { title: { stringValue: "Comprar pão" } }
        })
      });

      const task = await firestoreTaskRepository.createForUser("user1", "Comprar pão");
      expect(task.title).toBe("Comprar pão");
      expect(task.id).toBe("t1");
    });

    it("lança erro se o firestore retornar null/inválido", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => null });
      await expect(firestoreTaskRepository.createForUser("u", "t")).rejects.toThrow("Resposta inválida");
    });
  });

  describe("updateCompletion", () => {
    it("atualiza a tarefa e retorna os dados novos", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: "tasks/t1",
          fields: { completed: { booleanValue: true } }
        })
      });

      const task = await firestoreTaskRepository.updateCompletion("user1", "t1", true);
      expect(task.completed).toBe(true);
    });
  });

  describe("deleteForUser", () => {
    it("chama o fetch com método DELETE", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
      await firestoreTaskRepository.deleteForUser("user1", "t1");
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "DELETE" }));
    });
  });

  describe("Configuração (Edge cases)", () => {
    it("lança erro se as variáveis de ambiente não existirem", async () => {
      process.env.FIREBASE_PROJECT_ID = ""; // Apaga a variável mockada
      await expect(firestoreTaskRepository.listByUser("user1")).rejects.toThrow(/Defina FIREBASE_PROJECT_ID/);
    });
  });
});