import { NextRequest, NextResponse } from "next/server";

const USER_ID = "indhu_veginetti_07102003";
const EMAIL = "indhu.vegienti2021@vitstudent.ac.in";
const ROLL_NUMBER = "21BAI1927";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { is_success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    const numbers = data.filter((item) => !isNaN(Number(item)));
    const alphabets = data.filter((item) => isNaN(Number(item)));
    const lowercaseAlphabets = alphabets.filter(
      (item) => item.length === 1 && item.toLowerCase() === item
    );
    const highestLowercaseAlphabet =
      lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()!] : [];

    const response = {
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { is_success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ operation_code: 1 });
}
