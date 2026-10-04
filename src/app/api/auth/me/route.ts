import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        authenticated: false,
        reason: "ACCESS_TOKEN_MISSING",
      },
      { status: 401 }
    );
  }

  try {
    const backendRes = await fetch(
      `${process.env.BACKEND_URL}/api/v1/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const data =
      await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          authenticated: false,
          reason:
            backendRes.status === 404
              ? "USER_NOT_FOUND"
              : "ACCESS_TOKEN_INVALID",
          message: data.message,
        },
        {
          status: backendRes.status,
        }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: data.user,
    });
  } catch (error) {
    console.error("Auth me error:", error);

    return NextResponse.json(
      {
        authenticated: false,
        reason: "AUTH_SERVICE_ERROR",
      },
      { status: 500 }
    );
  }
}