import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskComposer } from "../TaskComposer";

describe("Componente: TaskComposer", () => {
  it("renderiza o input e o botão", () => {
    render(<TaskComposer onCreate={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Nova tarefa/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Adicionar/i })).toBeInTheDocument();
  });

  it("exibe erro se tentar adicionar tarefa sem título", async () => {
    render(<TaskComposer onCreate={jest.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /Adicionar/i }));
    expect(screen.getByText("Digite um título para a tarefa.")).toBeInTheDocument();
  });

  it("chama a função onCreate e limpa o campo em caso de sucesso", async () => {
    const mockCreate = jest.fn().mockResolvedValue(undefined);
    render(<TaskComposer onCreate={mockCreate} />);
    
    const input = screen.getByPlaceholderText(/Nova tarefa/i);
    await userEvent.type(input, "Estudar React");
    await userEvent.click(screen.getByRole("button", { name: /Adicionar/i }));
    
    expect(mockCreate).toHaveBeenCalledWith("Estudar React");
    expect(input).toHaveValue("");
  });
});