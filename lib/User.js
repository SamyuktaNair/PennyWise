import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"
import { prisma } from "./prisma"


export const checkUser=async ()=>{
    const {userId}=await auth()
    if(!userId){
        return <h2>OO O ! Looks like You haven't Signed In </h2>
    }

    const user=await currentUser()
    if(user){
        try{
            const loggedInUser=await prisma.user.findUnique({
                where:{
                    clerkUserId:userId
                }
            })
            if (!loggedInUser){
                const createUser=await prisma.user.create({
                    data:{
                        clerkUserId:userId,
                        name:`${user.firstName} ${user.lastName}`,
                        imageUrl:user.imageUrl,
                        email:user.emailAddresses[0].emailAddress
                    }
                })
                return createUser
            }
        }
        catch(err){
            console.log("An Error occurred :", err)
        }
    }
    }
    