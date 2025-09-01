"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

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
const dashboard=async (data)=>{
    try {
        const {userId}=await auth()
        if(!userId) throw new Error("Looks like u forgot to sign in");

        const user=await prisma.user.findUnique({
            where:{clerkUserId:userId}
        })
        if(!user) throw new Error("User not authorised");

    
    //console.log("Received isDefault:", data.isDefault);


    const balance=parseFloat(data.balance)

    const existingAccounts=await prisma.account.findMany({
        where:{userId:user.id}
    })
    if (existingAccounts.length==0){
        data.isDefault=true
    }
    else{
        if (data.isDefault ==true){
            await prisma.account.updateMany({
                where:{userId:user.id,
                    isDefault:true},
                data:{isDefault:false}
            })

            
        }
    }
    // console.log("Creating account with data:", {
    //     ...data,
    //     balance,
    //     userId: user.id,
    //   });
      
    const acc=await prisma.account.create({
        data:{
            ...data,
            balance,
            
            userId:user.id

        }
    })

    const account={
        ...acc,
        balance:acc.balance.toNumber()
    }

    revalidatePath('/dashboard');
    return {success:true, data,account}

    } catch (error) {
        throw new Error(error.message)
        
    }
    
}

const getUserAccounts=async ()=>{
    try {
        const {userId}=await auth()
        if (!userId) throw new Error("Looks like u forgot to sign in")

        const user=await prisma.user.findUnique({
            where:{
                clerkUserId:userId
            }
        })
        
        if(!user) throw new Error("User not authorised")

        const acc=await prisma.account.findMany({
            where:{
                userId:user.id
            },
            orderBy:{
                created_at:"desc"
            },
            include:{
                _count:{
                    select:{
                        transactions:true,
                    }
                }
            }
        })

        const accounts=acc.map(number)
        return accounts
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
export {dashboard,recentTransactions,getUserAccounts}
