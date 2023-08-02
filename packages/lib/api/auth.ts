import type { Fetch } from "./base"
import { BAD_REQUEST, CONFLICT, NOT_FOUND, publicFetch } from "./base"

/*

Possible login situation:
- email not found
- password is incorrect
- ok
- unexpected fail

*/

export enum LoginStatus {
  Success,
  EmailNotFound,
  IncorrectPassword,
  Fail
}

export async function login(
  fetch: Fetch,
  base: string,
  email: string,
  password: string
): Promise<LoginStatus> {
  var response = await publicFetch(fetch, base, {
    route: "/v1/auth/login",
    method: "POST",
    body: {
      email: email,
      password: password
    }
  })

  if (!response) return LoginStatus.Fail

  if (response.ok) return LoginStatus.Success

  // bad request: incorrect password
  if (response.status === BAD_REQUEST) return LoginStatus.IncorrectPassword

  // not found: user wiht this email not found
  if (response.status === NOT_FOUND) return LoginStatus.EmailNotFound

  return LoginStatus.Fail
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

export async function register(
  fetch: Fetch,
  base: string,
  input: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }
): Promise<RegisterStatus> {
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

  if (!response) return RegisterStatus.Fail
  if (response.ok) return RegisterStatus.Success
  if (response.status == CONFLICT) return RegisterStatus.EmailIsTaken
  if (response.status == BAD_REQUEST) return RegisterStatus.PasswordsMismatch
  return RegisterStatus.Fail
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