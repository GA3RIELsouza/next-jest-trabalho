import { render, screen } from "@testing-library/react";
import LoginPage from "../page";
import * as sessionService from "@/services/auth/session.service";
import { redirect, useSearchParams } from "next/navigation";

// Mocks do Next Navigation
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("@/services/auth/session.service");

// Mock do LoginForm para evitar problemas com hooks internos durante o teste de página
jest.mock("@/components/auth/LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form">Mock Login Form</div>,
}));

describe("Página: Login (Server Component)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redireciona para o dashboard se o usuário já estiver logado", async () => {
    // Simula usuário logado
    (sessionService.getSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "1" });
    
    await LoginPage();
    
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("renderiza o formulário se o usuário não estiver logado", async () => {
    // Simula usuário deslogado
    (sessionService.getSessionUserFromCookies as jest.Mock).mockResolvedValue(null);
    
    const Page = await LoginPage();
    render(Page);
    
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});