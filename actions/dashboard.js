"use server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
const dashboard=async (data)=>{
    try {
        const {userId}=await auth()
        if(!userId) return <div>Looks Like you forgot to sign in</div>

        const user=await prisma.user.findUnique({
            where:{clerkUserId:userId}
        })
        if(!user) return <div>User not authorised </div>

        const budget =await prisma.budget.findUnique({
        where:{userId}

    })

    const balance=parseFloat(data.balance)

    const existingAccounts=await prisma.account.findMany({
        where:{userId}
    })
    if (existingAccounts.length==0){
        data.isDefault=true
    }
    else{
        if (data.isDefault ==true){
            await prisma.account.updateMany({
                where:{userId,isDefault:true},
                data:{isDefault:false}
            })

            
        }
    }
    const acc=await prisma.account.create({
        data:{
            ...data,
            balance,
            isDefault:true,
            userId

        }
    })

    revalidatePath('/dashboard');
    return {success:true, data}

    } catch (error) {
        throw new Error(error.message)
        
    }
    
}

const recentTransactions=async(name)=>{
    const {userId}=await auth()
    if(!userId) return <div>Looks Like you forgot to sign in</div>
        
        const user=await prisma.user.findUnique({
            where:{clerkUserId:userId}
    })
    if(!user) return <div>User not authorised </div>

    const account=await prisma.account.findMany({
        where:{
            userId,name:name
        }
    })
    const transactions =await prisma.transaction.findMany({
        where:{userId,accountId:account.id}
    })

    return transactions

}
export {dashboard,recentTransactions}
