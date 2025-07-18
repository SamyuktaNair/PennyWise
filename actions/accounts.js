"use server"
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { success } from "zod";

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
        if(!userId) return <div>Looks Like you forgot to sign in</div>

        const user=await prisma.user.findUnique({
            where:{clerkUserId:userId}
        })
        if(!user) return <div>User not authorised </div>

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