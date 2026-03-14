import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardClient } from "../DashboardClient";

// Mock do Contexto de Autenticação
const mockLogout = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "aluno@authtask.dev" },
    logout: mockLogout,
  }),
}));

// Mock do Fetch Global para simular a API real (Mock Avançado - Etapa 6)
global.fetch = jest.fn();

describe("Componente: DashboardClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza tela de carregamento e depois exibe as tarefas da API", async () => {
    const mockTasks = [{ id: "1", title: "Estudar Jest", completed: false }];
    
    // Simula sucesso no GET da API
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: mockTasks }),
    });

    render(<DashboardClient />);
    
    // Verifica loading inicial
    expect(screen.getByText("Carregando tarefas...")).toBeInTheDocument();
    
    // Aguarda carregar e verifica a tarefa na tela
    await waitFor(() => {
      expect(screen.queryByText("Carregando tarefas...")).not.toBeInTheDocument();
      expect(screen.getByText("Estudar Jest")).toBeInTheDocument();
    });
  });

  it("trata erro 500 da API ao carregar tarefas (Mock avançado)", async () => {
    // Simula erro do servidor
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Erro interno no servidor" }),
    });

    render(<DashboardClient />);

    await waitFor(() => {
      expect(screen.getByText("Erro interno no servidor")).toBeInTheDocument();
    });
  });

  it("cria uma nova tarefa com sucesso", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ tasks: [] }) }) // Mock do GET inicial
      .mockResolvedValueOnce({ ok: true, json: async () => ({ task: { id: "2", title: "Nova Tarefa API", completed: false } }) }); // Mock do POST

    render(<DashboardClient />);
    await waitFor(() => expect(screen.queryByText("Carregando tarefas...")).not.toBeInTheDocument());
    
    // Digita e envia a nova tarefa
    const input = screen.getByPlaceholderText(/Nova tarefa/i);
    await userEvent.type(input, "Nova Tarefa API");
    await userEvent.click(screen.getByRole("button", { name: /Adicionar/i }));

    // Aguarda a tarefa aparecer na tela
    await waitFor(() => {
      expect(screen.getByText("Nova Tarefa API")).toBeInTheDocument();
    });
  });

  it("chama a função de logout ao clicar no botão", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: [] }),
    });

    render(<DashboardClient />);
    await waitFor(() => expect(screen.queryByText("Carregando tarefas...")).not.toBeInTheDocument());

    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    await userEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });
});