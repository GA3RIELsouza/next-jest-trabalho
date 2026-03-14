import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../AuthContext";

// Componente de teste para consumir o contexto
const TestConsumer = () => {
  const { user, login, logout, isLoading } = useAuth();
  return (
    <div>
      <span data-testid="user-email">{user ? user.email : "Deslogado"}</span>
      <span data-testid="loading-status">{isLoading ? "Carregando" : "Livre"}</span>
      <button onClick={() => login("teste@teste.com", "123")}>Fazer Login</button>
      <button onClick={logout}>Fazer Logout</button>
    </div>
  );
};

// Mocks
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));
global.fetch = jest.fn();

describe("Contexto: AuthContext", () => {
  beforeEach(() => jest.clearAllMocks());

  it("deve fornecer o valor inicial para os filhos", () => {
    const mockUser = { id: "1", email: "aluno@teste.com", name: "Aluno" };
    render(
      <AuthProvider initialUser={mockUser}>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("user-email")).toHaveTextContent("aluno@teste.com");
  });

  it("deve lançar erro se useAuth for usado fora do provider", () => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Esconde o erro feio no terminal
    expect(() => render(<TestConsumer />)).toThrow("useAuth deve ser usado dentro de");
  });

  it("login bem-sucedido: atualiza user e redireciona", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: "2", email: "novo@teste.com", name: "Novo" } }),
    });

    render(<AuthProvider initialUser={null}><TestConsumer /></AuthProvider>);
    
    await userEvent.click(screen.getByRole("button", { name: "Fazer Login" }));

    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("novo@teste.com");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("login com erro: retorna dados do erro e não atualiza user", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Senha incorreta", errors: { password: "Erro" } }),
    });

    render(<AuthProvider initialUser={null}><TestConsumer /></AuthProvider>);
    
    await userEvent.click(screen.getByRole("button", { name: "Fazer Login" }));

    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("Deslogado");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("logout: limpa o usuário e redireciona", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(
      <AuthProvider initialUser={{ id: "1", email: "aluno@teste.com", name: "Aluno" }}>
        <TestConsumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Fazer Logout" }));

    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("Deslogado");
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});