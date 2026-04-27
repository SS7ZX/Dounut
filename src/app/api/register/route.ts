import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // 2. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save the new user to Supabase
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          name: name,
          email: email,
          password: hashedPassword, // Saving the hashed version!
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "User created successfully!", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong during registration." },
      { status: 500 }
    );
  }
}