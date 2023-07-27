import type { Fetch } from "./base"
import { BAD_REQUEST, CONFLICT, NOT_FOUND, callPublic } from "./base"

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
  var response = await callPublic(fetch, base, "/v1/auth/login", "POST", {
    email: email,
    password: password
  })
  console.log(response)
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
  const response = await callPublic(fetch, base, "/v1/auth/register", "POST", {
    name: input.name,
    email: input.email,
    password: input.password,
    confirmPassword: input.confirmPassword
  })

  if (!response) return RegisterStatus.Fail
  if (response.ok) return RegisterStatus.Success
  if (response.status == CONFLICT) return RegisterStatus.EmailIsTaken
  if (response.status == BAD_REQUEST) return RegisterStatus.PasswordsMismatch
  return RegisterStatus.Fail
}
