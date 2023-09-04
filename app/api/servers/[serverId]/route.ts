import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid'

export async function PATCH(req: Request, {params}:{params: {serverId: string}}){
  try {
    const profile = await currentProfile()
    
    if(!profile ) return new NextResponse('unauthorized', {status: 401})

    if(!params.serverId) return new NextResponse('Server id missing',{status: 400})

    const {name, imageUrl} = await req.json();

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id
      },
      data:{
        name,
        imgUrl: imageUrl
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log("🚀 ~ file: [api/servers/serverId] edit ~ PATCH ~ error:", error)
    return new NextResponse('Server id invite code error', { status: 500})
    
  }
}
export async function DELETE(req: Request, {params}:{params: {serverId: string}}){
  try {
    const profile = await currentProfile()
    
    if(!profile ) return new NextResponse('unauthorized', {status: 401})

    if(!params.serverId) return new NextResponse('Server id missing',{status: 400})

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id
      },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log("🚀 ~ file: route.ts:51 ~ DELETE ~ error:", error)
    return new NextResponse('Server delete  code error', { status: 500})
    
  }
}