import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { chechBudgetAlert, generateFinancialInsights, generateMonthlyReports } from "@/lib/inngest/function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    chechBudgetAlert,
    generateMonthlyReports,
    generateFinancialInsights
  ],
});