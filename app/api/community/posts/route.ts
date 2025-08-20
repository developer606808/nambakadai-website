import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as z from "zod";
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

// Schema for creating a post
const postSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  content: z.string().min(1, { message: "Content is required." }),
  communityId: z.number().int().optional().nullable(),
});

// Schema for updating a post (all fields optional except id)
const updatePostSchema = postSchema.partial().extend({
  id: z.number().int(),
});

export async function GET(request: Request) {
  try {
    // No session check for GET, as posts are public
    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get('communityId');

    const posts = await prisma.post.findMany({
      where: communityId ? { communityId: parseInt(communityId) } : {},
      include: { author: { select: { id: true, name: true, image: true } } }, // Include author details
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = postSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        authorId: user.id,
        communityId: validatedData.communityId,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error("Error creating post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = updatePostSchema.parse(body);

    const { id, ...updateData } = validatedData;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // Authorization: Only author or admin can update
    if (existingPost.authorId !== user.id && user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }

    console.error("Error updating post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromCookie();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse("Post ID is required", { status: 400 });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPost) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // Authorization: Only author or admin can delete
    if (existingPost.authorId !== user.id && user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
