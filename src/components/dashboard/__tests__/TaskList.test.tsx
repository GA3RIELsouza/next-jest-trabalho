import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "../TaskList";

describe("Componente: TaskList", () => {
  const mockTasks = [
    { id: "1", title: "Tarefa Pendente", completed: false, createdAt: 0, updatedAt: 0 },
    { id: "2", title: "Tarefa Concluída", completed: true, createdAt: 0, updatedAt: 0 }
  ];

  it("exibe mensagem quando não há tarefas", () => {
    render(<TaskList tasks={[]} onToggle={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("Nenhuma tarefa cadastrada ainda.")).toBeInTheDocument();
  });

  it("renderiza a lista de tarefas corretamente", () => {
    render(<TaskList tasks={mockTasks} onToggle={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("Tarefa Pendente")).toBeInTheDocument();
    expect(screen.getByText("Tarefa Concluída")).toBeInTheDocument();
  });

  it("chama onToggle ao clicar no checkbox", async () => {
    const mockToggle = jest.fn();
    render(<TaskList tasks={mockTasks} onToggle={mockToggle} onDelete={jest.fn()} />);
    
    const checkboxes = screen.getAllByRole("checkbox");
    await userEvent.click(checkboxes[0]); // Clica na primeira tarefa
    
    expect(mockToggle).toHaveBeenCalledWith("1", true);
  });

  it("chama onDelete ao clicar no botão de deletar", async () => {
    const mockDelete = jest.fn();
    render(<TaskList tasks={mockTasks} onToggle={jest.fn()} onDelete={mockDelete} />);
    
    const deleteButtons = screen.getAllByRole("button", { name: /Deletar/i });
    await userEvent.click(deleteButtons[1]); // Clica no botão da segunda tarefa
    
    expect(mockDelete).toHaveBeenCalledWith("2");
  });
});