type HttpMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH"

type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => Promise<Response>

function formBody(body?: FormData | object): BodyInit | null {
  if (!body) return null

  if (body instanceof FormData) return body

  return JSON.stringify(body)
}

export async function callSecure(
  fetch: Fetch,
  route: string | URL,
  method: HttpMethod = "GET",
  body?: FormData | object
): Promise<Response | null> {
  try {
    const response = await fetch(route, {
      method: method,
      credentials: "include",
      headers: {
        accept: "application/json",
        "double-submit": "uhe1"
      },
      body: formBody(body)
    })

    return response
  } catch {
    return null
  }
}

export async function callPublic(
  fetch: Fetch,
  route: string | URL,
  method: HttpMethod = "GET",
  body?: FormData | object
): Promise<Response | null> {
  try {
    const response = await fetch(route, {
      method: method,
      headers: {
        accept: "application/json"
      },
      body: formBody(body)
    })

    return response
  } catch {
    return null
  }
}

export type Image = {
  provider: "storj" | "github"
  bucket: string
  key: string
}
const storjShopsPublicKey = "jxacrqaiskr265rjf7wdytj72bcq"

export function imageUrl(image: Image): string | null {
  if (image.provider == "storj") {
    return `https://link.storjshare.io/raw/${storjShopsPublicKey}/${image.bucket}/${image.key}`
  }

  // image.provider == "github"
  return `https://raw.githubusercontent.com/flurium/${image.bucket}/main/${image.key}`
}

// async function upload() {
// console.log(files)
// const file = files[0]
// if (!file) {
//   console.log("no file")
//   return
// }
// const formData = new FormData()
// formData.append("file", file)
// const response = await Api.callSecure(fetch, "/api/test/upload", "POST", formData)
// if (!response) {
//   console.log("fail")
//   return
// }
// console.log(response)
// url = await response.text()
// }
