import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, USER_COOKIE_NAME } from "../auth/schema";
import { TokenSessionSchema, TokenStateSchema, TokenUserSchema, type TokenUser } from "./schema";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const user = TokenUserSchema.parse(payload);
    return user;
  } catch (error) {
    return null;
  }
}

export async function getSessionFromToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const session = TokenSessionSchema.parse(payload);
    return session;
  } catch (error) {
    return null;
  }
}

/** for route.ts files. (make sure the route exports `dynamic = "force-dynamic"`). */
export async function getUserFromRequestCookie(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

export async function getSessionFromRequestCookie(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return getSessionFromToken(token);
}

/** for server component files (or in server actions) */
export async function getUserFromCookie() {
  const token = cookies().get(USER_COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

export async function createTokenFromUser(user: TokenUser) {
  const jwt = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).sign(SECRET);
  return jwt;
}

export async function createSessionToken() {
  const jwt = await new SignJWT({ csrf: crypto.randomUUID() }).setProtectedHeader({ alg: "HS256" }).sign(SECRET);
  return jwt;
}

export async function createStateToken({ csrf, route }: { csrf: string; route: string }) {
  const jwt = await new SignJWT({ csrf, route }).setProtectedHeader({ alg: "HS256" }).sign(SECRET);
  return jwt;
}

export async function verifyStateToken(token: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const state = TokenStateSchema.parse(payload);
    return state;
  } catch (error) {
    return null;
  }
}
