import { render, screen } from "@testing-library/react";
import { AppProviders } from "../AppProviders";
import { useAuth } from "@/context/AuthContext";

// Mock do router do Next.js
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Componente bobo para testar se o provider repassa as coisas
const TestChild = () => {
  const { user } = useAuth();
  return <div data-testid="child">{user ? user.email : "Ninguem"}</div>;
};

describe("Componente: AppProviders", () => {
  it("engloba os filhos com o AuthProvider repassando o initialUser", () => {
    const mockUser = { id: "1", name: "A", email: "teste@provider.com" };
    
    render(
      <AppProviders initialUser={mockUser}>
        <TestChild />
      </AppProviders>
    );

    expect(screen.getByTestId("child")).toHaveTextContent("teste@provider.com");
  });
});