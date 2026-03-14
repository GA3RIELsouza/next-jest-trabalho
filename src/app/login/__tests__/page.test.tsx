import { render, screen } from "@testing-library/react";
import DashboardPage from "../page";
import * as sessionService from "@/services/auth/session.service";
import { redirect } from "next/navigation";

jest.mock("@/services/auth/session.service");
jest.mock("next/navigation", () => ({ redirect: jest.fn() }));
jest.mock("@/components/dashboard/DashboardClient", () => ({ DashboardClient: () => <div data-testid="client" /> }));

describe("Página: Dashboard (Server Component)", () => {
  it("redireciona para /login se não houver sessão", async () => {
    (sessionService.getSessionUserFromCookies as jest.Mock).mockResolvedValue(null);
    await DashboardPage();
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("renderiza o Dashboard se estiver logado", async () => {
    (sessionService.getSessionUserFromCookies as jest.Mock).mockResolvedValue({ id: "1" });
    const Page = await DashboardPage();
    render(Page);
    expect(screen.getByText("Dashboard protegido")).toBeInTheDocument();
  });
});