export const MAX_REPAIR_LOOPS = 3;
export const BUDGET_WARNING_RATIO = 0.8;

const normalize = (error: string) => error.trim().replace(/\s+/g, " ").toLowerCase();

export function afterFailure(task: { attempts: number; lastError: string | null }, error: string) {
  const attempts = task.attempts + 1;

  if (task.lastError !== null && normalize(task.lastError) === normalize(error)) {
    return {
      status: "error" as const,
      attempts,
      stop: true,
      reason: "The same error happened twice. Stop and ask the user.",
    };
  }
  if (attempts > MAX_REPAIR_LOOPS) {
    return {
      status: "error" as const,
      attempts,
      stop: true,
      reason: `All ${MAX_REPAIR_LOOPS} repair loops are used. Stop and ask the user.`,
    };
  }
  return {
    status: "pending" as const,
    attempts,
    stop: false,
    reason: `Repair loop ${attempts} of ${MAX_REPAIR_LOOPS}. The task is ready to try again.`,
  };
}

export function budgetState(budget: {
  tokensUsed: number;
  tokensLimit: number;
  stepsUsed: number;
  stepsLimit: number;
}) {
  const used = Math.max(budget.tokensUsed / budget.tokensLimit, budget.stepsUsed / budget.stepsLimit);
  return {
    percent: Math.round(used * 100),
    warning: used >= BUDGET_WARNING_RATIO,
    exceeded: used >= 1,
  };
}
