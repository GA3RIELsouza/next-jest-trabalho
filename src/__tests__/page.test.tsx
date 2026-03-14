import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Página: Home", () => {
  it("deve renderizar o título e os links de navegação", () => {
    render(<Home />);
    expect(screen.getByText("AuthTask Manager")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /entrar no sistema/i })).toBeInTheDocument();
  });
});