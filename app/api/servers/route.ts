import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"
import { v4 as uuidv4} from 'uuid'

export async function POST(req:Request){
  try {
    const { name, imageUrl } = await req.json()
    const profile =await  currentProfile()

    if(!profile){
      return new NextResponse('unauthorized',{status: 401})
    }

    const server = await db.server.create({
      data:{
        name,
        imgUrl: imageUrl,
        profileId: profile.id,
        inviteCode: uuidv4(),
        channels:{
          create:[
            {name: "general", profileId: profile.id}
          ]
        },
        members:{
          create:[
            {profileId: profile.id , role: MemberRole.ADMIN}
          ]
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log("🚀 ~ file: servers routes `app/servers` ~ POST ~ error:", error)
    return new NextResponse('internal error', {status: 500})
  }
}