import { render, screen } from "@testing-library/react";
import RootLayout from "../app/layout";
import * as sessionService from "@/services/auth/session.service";

jest.mock("@/services/auth/session.service");
jest.mock("@/components/providers/AppProviders", () => ({
  AppProviders: ({ children }: { children: React.ReactNode }) => <div data-testid="providers">{children}</div>,
}));

describe("Layout Principal", () => {
  it("deve renderizar os filhos dentro do AppProviders", async () => {
    (sessionService.getSessionUserFromCookies as jest.Mock).mockResolvedValue(null);
    
    const Layout = await RootLayout({ children: <div data-testid="child">Conteúdo</div> });
    render(Layout);
    
    expect(screen.getByTestId("providers")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});