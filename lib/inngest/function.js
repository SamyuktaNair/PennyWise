import { sendEmail } from "@/actions/send-email";
import { prisma } from "../prisma";
import { inngest } from "./client";
import Email from "@/emails/template";

export const chechBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets=await step.run('fetch-budget',async()=>{
        return await prisma.budget.findMany({
            include:{
                user:{
                    include:{
                        accounts:{
                            where:{
                                isDefault: true
                            }
                        }
                    }
                }
            }
        })
    })

    for(const budget of budgets){
        const defaultAccount=budget.user.accounts[0]
        if(!defaultAccount) continue

        await step.run(`check-budget-${budget.id}`,async()=>{
            
            const currentDate= new Date()
            const startOfMonth=new Date(
             currentDate.getFullYear(),
             currentDate.getMonth(),
             1
            )
 
            const endOfMonth=new Date(
             currentDate.getFullYear(),
             currentDate.getMonth() + 1,
             0
            )

            const expenses=await prisma.transaction.aggregate({
                where:{
                    userId:budget.userId,
                    accountId:defaultAccount.id,
                    type:"Expense",
                    date:{
                        gte:startOfMonth,
                        lte:endOfMonth
                    }
                },
                _sum:{
                    amount:true
                }
            })

            const totalExpenses=expenses._sum.amount?.toNumber() || 0;
            const budgetAmount=budget.amount
            const percentageUsed=(totalExpenses/budgetAmount) *100

            if(percentageUsed>=80 && (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent),new Date()))) {

                //send email
                await sendEmail({
                    to:budget.user.email,
                    subject:`Budget Alert for ${defaultAccount.name}`,
                    react:Email({
                        userName:budget.user.name,
                        type:"budget-alert",
                        data:{
                            percentageUsed,
                            budgetAmount:parseInt(budgetAmount).toFixed(1),
                            totalExpenses:parseInt(totalExpenses).toFixed(1),
                            accountName:defaultAccount.name,
                        }
                    })
                })

                //update lastalertsend in db
                await prisma.budget.update({
                    where:{id:budget.id},
                    data:{lastAlertSent: new Date()}
                })
            }
        })
    }
  },
);

function isNewMonth(lastAlertDate,currentDate){
    return(
        lastAlertDate.getMonth() !==currentDate.getMonth() ||
        lastAlertDate.getFullYear() !==currentDate.getFullYear()
    )
}