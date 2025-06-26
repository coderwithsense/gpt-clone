import { clerkClient } from "@/lib/clerk";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const { userId } = await auth();
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ success: false, message: 'User ID and email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    // const existingUser = await prisma.user.findUnique({
    //   where: { clerkId: userId },
    // });

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (existingUser) {
      // Update existing user
      await prisma.user.update({
        where: { clerkId: userId },
        data: { email },
      });
    } else {
      const clerk = await clerkClient.users.getUser(userId);
      // Create a new user
      await prisma.user.create({
        data: {
          id: userId,
          clerkId: userId,
          email,
          name: `${clerk.firstName ?? ''} ${clerk.lastName ?? ''}`,
        },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'User data saved successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in user API:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred while processing your request'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}