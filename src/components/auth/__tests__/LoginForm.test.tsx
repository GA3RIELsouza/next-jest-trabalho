import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";

// 1. MOCK DO NEXT NAVIGATION (Resolve o erro do useSearchParams)
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
}));

// 2. MOCK DO AUTH CONTEXT
const mockLogin = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false,
    error: null,
  }),
}));

describe("Componente: LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar os campos de email, senha e botão de entrar", () => {
    render(<LoginForm />);
    // Usamos getByLabelText que é mais seguro para o RTL encontrar os inputs
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("deve chamar a função de login ao preencher e enviar o formulário", async () => {
    mockLogin.mockResolvedValue({ ok: true });
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    // 3. LIMPAR OS CAMPOS ANTES DE DIGITAR (Resolve o erro do DEMO_EMAIL)
    await userEvent.clear(emailInput);
    await userEvent.clear(passwordInput);

    await userEvent.type(emailInput, "teste@teste.com");
    await userEvent.type(passwordInput, "senha123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("teste@teste.com", "senha123");
    });
  });
});