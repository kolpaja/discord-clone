import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid'

export async function PATCH(req: Request, {params}:{params: {serverId: string}}){
  try {
    const profile = await currentProfile()
    
    if(!profile ) return new NextResponse('unauthorized', {status: 401})

    if(!params.serverId) return new NextResponse('Server id missing',{status: 400})

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id
      },
      data:{
        inviteCode: uuidv4()
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log("🚀 ~ file: [api/servers/serverId] ~ PATCH ~ error:", error)
    return new NextResponse('Server id invite code error', { status: 500})
    
  }
}