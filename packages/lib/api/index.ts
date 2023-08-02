export * from "./base"
export * from "./auth"
export * from "./dashboard"

export type Image = {
  provider: string // "storj" | "github"
  bucket: string
  key: string
}
const storjShopsPublicKey = "jxacrqaiskr265rjf7wdytj72bcq"

export function imageUrl(image: Image): string | null {
  if (image.provider == "storj") {
    return `https://link.storjshare.io/raw/${storjShopsPublicKey}/${image.bucket}/${image.key}`
  }

  if (image.provider == "github") {
    return `https://raw.githubusercontent.com/flurium/${image.bucket}/main/${image.key}`
  }

  return null
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
