import { render, screen } from "@testing-library/react";
import { ServerTaskSummary } from "@/components/dashboard/ServerTaskSummary";
import { taskService } from "@/services/tasks/task.service";

jest.mock("@/services/tasks/task.service", () => ({
  taskService: { getSummary: jest.fn() },
}));

describe("ServerTaskSummary", () => {
  it("renderiza os números de sucesso", async () => {
    (taskService.getSummary as jest.Mock).mockResolvedValue({ total: 5, completed: 2, pending: 3 });
    const Component = await ServerTaskSummary({ userId: "123" });
    render(Component);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renderiza mensagem de erro se falhar", async () => {
    (taskService.getSummary as jest.Mock).mockRejectedValue(new Error("Erro"));
    const Component = await ServerTaskSummary({ userId: "123" });
    render(Component);
    expect(screen.getByText(/Resumo indisponível/i)).toBeInTheDocument();
  });
});