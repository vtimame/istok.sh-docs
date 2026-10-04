import type { TraceStep } from "./McpTrace";

// The MCP calls an agent makes for one task, as the landing trace replays them.
export const workflowSteps: TraceStep[] = [
  {
    tool: "task_create",
    args: [
      ["title", "Return 404 for missing orders"],
      ["acceptance", "Unknown orders return 404"],
    ],
    result: [
      ["task", "#18"],
      ["status", "open"],
    ],
  },
  {
    tool: "task_claim",
    args: [["task", "#18"]],
    result: [
      ["run", "active"],
      ["context", "3 records, 4 code snippets"],
    ],
  },
  {
    tool: "task_progress",
    args: [["body", "Handler maps ErrNotFound to 404"]],
    result: [["revision", "2"]],
  },
  {
    tool: "run_validate",
    args: [["command", "go test ./..."]],
    result: [
      ["exit_code", "0"],
      ["validation", "passed"],
    ],
  },
  {
    tool: "run_finish",
    args: [["status", "succeeded"]],
    result: [["run", "finished"]],
  },
  {
    tool: "task_complete",
    args: [["validation", "attached"]],
    result: [["status", "done"]],
  },
];
