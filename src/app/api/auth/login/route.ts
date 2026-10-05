

import { NextResponse } from "next/server";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/actions/cookies";

export async function POST(request: Request) {
  const body = await request.text();
  const incomingCookie = request.headers.get("cookie") ?? "";

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(incomingCookie ? { Cookie: incomingCookie } : {}),
      },
      body,
      cache: "no-store",
      credentials:"include"
    }
  );

  const data = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json(
      data,
      {
        status: backendRes.status,
      }
    );
  }

  const {
    accessToken,
    refreshToken,
    user,
    message,
  } = data as {
    accessToken?: string;
    refreshToken?: string;
    user: unknown;
    message: string;
  };

  if (!accessToken) {
    return NextResponse.json(
      {
        message: "Access token missing from server response",
      },
      { status: 500 }
    );
  }

  const response = NextResponse.json(
    {
      message,
      user,
    },
    {
      status: backendRes.status,
    }
  );

  setAccessTokenCookie(response, accessToken);

  if (refreshToken) {
    setRefreshTokenCookie(response, refreshToken);
  }

  const setCookies =
    backendRes.headers.getSetCookie?.() ?? [];

  for (const cookie of setCookies) {
    response.headers.append(
      "set-cookie",
      cookie
    );
  }

  return response;
}