"use server"
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";


const number=(obj)=>{
    const serialised={...obj}
    if(obj.balance){
        serialised.balance=obj.balance.toNumber()
    }
    if(obj.amount){
        serialised.amount=obj.amount.toNumber()
    }
    return serialised
}

export async function updateDefaultAccount(accountId){
    try {
        const{userId}=await auth()
        if(!userId) throw new Error("User not Signed in")

        const user=await prisma.user.findUnique({
            where:{clerkUserId:userId}
        })
        if(!user) throw new Error("User not authorised")

        await prisma.account.updateMany({
            where:{userId:user.id,
                isDefault:true},
            data:{isDefault:false}
        })

        const account=await prisma.account.update({
            where:{
                id:accountId,
                userId:user.id
            },
            data:{
                isDefault:true
            }
        })

        revalidatePath('/dashboard')
        return {success:true,data:number(account)}
        

    
    } catch (error) {
        throw new Error(error)
        
    }
   

}

export async function getAccountDetails(accountId) {
    try {
        const{userId}=await auth()
        if(!userId) throw new Error("User not Signed in")

        const user=await prisma.user.findUnique({
            where:{clerkUserId:userId}
        })
        if(!user) throw new Error("User not authorised")

        const account =await prisma.account.findUnique({
            where:{
                id:accountId,
                userId:user.id
            },
            include:{
                transactions:{
                    orderBy:{date:"desc"},
                },
                _count:{
                    select:{transactions:true},
                }
            }
        })

        if (!account) return null

        return{
            ...number(account),
            transactions:account.transactions.map(number)
        }



    } catch (error) {
        throw new Error(error)
    }
    
}

export async function deleteTransactions(transactionIds) {
    try {
        const{userId}=await auth()
        if(!userId) throw new Error("User not Signed in")

        const user=await prisma.user.findUnique({
            where:{clerkUserId:userId}
        })
        if(!user) throw new Error("User not authorised")

        const transactions =await prisma.transaction.findMany({
            where:{
                id:{in : transactionIds},
                userId:user.id
            }
        })

        const account= await prisma.account.findUnique({
            where:{id:transactions[0].accountId}
        })
        if (!account) throw new Error ("Account not found")

        // const accountBalance=transactions.reduce((acc,transaction)=>{
        //     const change= transaction.type==="Expense" ? transaction.amount : -transaction.amount;

        //     acc[transaction.accountId]=(acc[transaction.accountId] || 0) +change
        //     return acc;
        // },{})
        let balance=0
        transactions.forEach((transaction)=>{
            
            const cost=transaction.type==="Expense"?transaction.amount.toNumber(): -transaction.amount.toNumber()

            balance=balance+cost
        })

        const accountBalance=account.balance.toNumber()+balance

        await prisma.transaction.deleteMany({
            where:{
                id:{in:transactionIds},
                userId:user.id
            }
        })

        const updatedbalance=await prisma.account.update({
            where:{
                id:account.id
            },
            data:{
                balance:accountBalance
            }
        })
        revalidatePath('/dashboard')
        revalidatePath('/accounts/[id]')
        return {success:true}

    } catch (error) {
        throw new Error(error)
    }
}