import type { Fetch } from "./base"
import { BAD_REQUEST, CONFLICT, NOT_FOUND, PROBLEM, publicFetch } from "./base"
import { Api } from "lib"

/*

Possible login situation:
- email not found
- password is incorrect
- ok
- unexpected fail

*/

export async function login(
  fetch: Fetch,
  base: string,
  email: string,
  password: string
): Promise<"ok" | "fail" | "email-not-found" | "bad-password"> {
  var response = await publicFetch(fetch, base, {
    route: "/v1/auth/login",
    method: "POST",
    body: {
      email: email,
      password: password
    }
  })

  if (!response) return "fail"
  if (response.ok) return "ok"
  if (response.status === BAD_REQUEST) return "bad-password"
  if (response.status === NOT_FOUND) return "email-not-found"
  return "fail"
}

/*

Possible register situations
- ok
- email is taken by another account
- password mismatch confirm password 
- fail

*/

export enum RegisterStatus {
  Success,
  EmailIsTaken,
  PasswordsMismatch,
  Fail
}

export type RegisterResult =
  | { data: Response; status: RegisterStatus.EmailIsTaken }
  | {
      data?: undefined
      status:
        | RegisterStatus.Fail
        | RegisterStatus.Success
        | RegisterStatus.PasswordsMismatch
    }

export async function register(
  fetch: Fetch,
  base: string,
  input: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }
): Promise<RegisterResult> {
  const response = await publicFetch(fetch, base, {
    route: "/v1/auth/register",
    method: "POST",
    body: {
      name: input.name,
      email: input.email,
      password: input.password,
      confirmPassword: input.confirmPassword
    }
  })

  if (!response) return { status: RegisterStatus.Fail }
  if (response.ok) return { status: RegisterStatus.Success }
  console.log(response.status)
  if (response.status == PROBLEM) {
    const jsonData = await response.json()
    return { data: jsonData, status: RegisterStatus.EmailIsTaken }
  }
  if (response.status == BAD_REQUEST) return { status: RegisterStatus.PasswordsMismatch }
  return { status: RegisterStatus.Fail }
}

export enum ForgotStatus {
  Success,
  EmailNotFound,
  Fail
}

export async function forgot(
  fetch: Fetch,
  base: string,
  email: string
): Promise<ForgotStatus> {
  const response = await publicFetch(fetch, base, {
    route: "/v1/auth/forgot",
    method: "POST",
    body: {
      email: email
    }
  })

  if (!response) return ForgotStatus.Fail
  if (response.status === NOT_FOUND) return ForgotStatus.EmailNotFound
  if (response.ok) return ForgotStatus.Success
  return ForgotStatus.Fail
}

export enum ResetStatus {
  Success,
  EmailNotFound,
  PasswordsMismatch,
  Fail
}

export async function reset(
  fetch: Fetch,
  base: string,
  email: string,
  token: string,
  password: string,
  confirmPassword: string
): Promise<ResetStatus> {
  const response = await publicFetch(fetch, base, {
    route: "/v1/auth/reset",
    method: "POST",
    body: {
      email: email,
      token: token,
      password: password,
      confirmPassword: confirmPassword
    }
  })

  if (!response) return ResetStatus.Fail
  if (response.status == NOT_FOUND) return ResetStatus.EmailNotFound
  if (response.status == BAD_REQUEST) return ResetStatus.PasswordsMismatch
  if (response.ok) return ResetStatus.Success
  return ResetStatus.Fail
}
