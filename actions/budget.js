"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { success } from "zod";

export async function getBudget(accountId) {
    try {
            const{userId}=await auth()
            if(!userId)  throw new Error("User not Signed in")

    
            const user=await prisma.user.findUnique({
                where:{clerkUserId:userId}
            })
            if(!user) throw new Error("User not Authorised")

           const budget=await prisma.budget.findFirst({
            where:{
                userId:user.id
            }
           })
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
                userId:user.id,
                type:"Expense",
                date:{
                    gte: startOfMonth,
                    lte: endOfMonth
                },
                accountId
            },
            _sum:{
                amount:true,
            }
           
           })

           return {
            budget: budget ? {...budget,amount: budget.amount.toNumber()} :null,
            currentExpenses:expenses._sum.amount ? expenses._sum.amount.toNumber():0
           }
            
    
        
        } catch (error) {
            throw new Error(error)
            
        }
       
}

export async function updateBudget(amount){
    try {
        const{userId}=await auth()
        if(!userId)  throw new Error("User not Signed in")


        const user=await prisma.user.findUnique({
            where:{clerkUserId:userId}
        })
        if(!user) throw new Error("User not Authorised")

        const budget=await prisma.budget.upsert({
            where:{
                userId:user.id
            },
            update:{
                amount
            },
            create:{
                userId:user.id,
                amount
            }
        })
        revalidatePath("/dashboard")
        return{
            success:true,
            date:{...budget,amount:budget.amount.toNumber()}
        }

    } catch (error) {
        throw new Error(error)
    }
}