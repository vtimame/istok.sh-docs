import { McpTrace } from "@/components/landing/McpTrace";

export function AgentWorkflow() {
  return (
    <section className="border-t border-border/60 py-24 sm:py-28 lg:py-32 xl:py-36">
      <div className="app-container">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 xl:gap-24">
          <div className="max-w-xl">
            <h2 className="font-cormorant text-4xl font-normal italic leading-[0.98] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Describe the problem.
              <br />
              Istok keeps the work.
            </h2>

            <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
              Your agent creates the task, claims it, records progress and validates the result —
              without turning task management into your job.
            </p>
          </div>

          <AgentWorkflowTrace />
        </div>
      </div>
    </section>
  );
}

function AgentWorkflowTrace() {
  return (
    <McpTrace
      agent="MCP Agent"
      steps={[
        {
          tool: "task_create",
          args: [
            ["title", "Repository indexing"],
            ["description", "Index project files for search"],
          ],
          result: [
            ["task", "#2"],
            ["status", "open"],
            ["revision", "1"],
          ],
        },
        {
          tool: "task_claim",
          args: [["task", "#2"]],
          result: [
            ["run", "active"],
            ["actor", "MCP Agent"],
          ],
        },
        {
          tool: "task_progress",
          args: [
            ["task", "#2"],
            ["body", "Filesystem walker implemented"],
          ],
          result: [["revision", "2"]],
        },
        {
          tool: "run_validate",
          args: [["command", "npm test"]],
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
          args: [
            ["task", "#2"],
            ["validation", "attached"],
          ],
          result: [
            ["status", "done"],
            ["revision", "3"],
          ],
        },
      ]}
    />
  );
}
