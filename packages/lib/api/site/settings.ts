import type { Fetch } from "../base"
import { BAD_REQUEST, NOT_FOUND, publicFetch, secureFetch, responseJson } from "../base"

type ChangeNameStatus = "not-found" | "problem" | "success" | "fail"

type ChangePasswordStatus =
  | "not-found"
  | "passwords-mismatch"
  | "problem"
  | "success"
  | "fail"

type DeleteAccountStatus = "not-found" | "problem" | "success" | "fail"

export async function changeName(
  fetch: Fetch,
  base: string,
  name: string
): Promise<ChangeNameStatus> {
  var response = await secureFetch(fetch, base, {
    route: "/v1/site/account/name",
    method: "POST",
    body: {
      name: name
    }
  })

  if (!response) return "fail"

  if (response.ok) return "success"

  if (response.status === NOT_FOUND) return "not-found"

  return "problem"
}

export async function uploadUserImage(
  fetch: Fetch,
  base: string,
  input: {
    file: File
  }
): Promise<
  | { status: "not-found" | "not-image" | "problem" | "fail" }
  | { data: string; status: "success" }
> {
  const formData = new FormData()
  formData.append("file", input.file)

  const response = await secureFetch(fetch, base, {
    route: `/v1/site/account/image`,
    method: "POST",
    body: formData
  })
  if (!response) return { status: "fail" }
  if (response.ok) {
    const json = await responseJson<string>(response)
    if (!json) return { status: "problem" }
    return { data: json, status: "success" }
  }

  if (response.status == BAD_REQUEST) return { status: "not-image" }
  if (response.status == NOT_FOUND) return { status: "not-found" }
  return { status: "problem" }
}

export async function changePassword(
  fetch: Fetch,
  base: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ChangePasswordStatus> {
  const response = await secureFetch(fetch, base, {
    route: "/v1/site/account/password",
    method: "POST",
    body: {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    }
  })

  if (!response) return "fail"
  if (response.status === NOT_FOUND) return "not-found"
  if (response.status === BAD_REQUEST) return "passwords-mismatch"
  if (response.ok) return "success"
  return "problem"
}

export async function deleteAccount(
  fetch: Fetch,
  base: string,
  email: string,
  password: string
): Promise<DeleteAccountStatus> {
  const response = await secureFetch(fetch, base, {
    route: "/v1/site/account/delete",
    method: "POST",
    body: {
      email: email,
      password: password
    }
  })

  if (!response) return "fail"
  if (response.status == NOT_FOUND) return "not-found"
  if (response.ok) "success"
  return "problem"
}
