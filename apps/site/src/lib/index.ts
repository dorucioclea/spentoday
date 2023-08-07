// place files you want to import through the `$lib` alias in this folder.

export * as routes from "./routes"

export function debounce(timer: number, action: Function) {
  return () => {
    clearTimeout(timer)
    timer = setTimeout(action, 500)
  }
}

export function isValidSlug(slug: string): boolean {
  if (slug.length > 100) return false

  for (const char of slug) {
    if (!((char >= "a" && char <= "z") || (char >= "0" && char <= "9") || char === "-")) {
      return false
    }
  }

  if (slug.startsWith("-") || slug.endsWith("-")) return false
  if (slug.includes("--")) return false
  return true
}

export function imageSize(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      const width = image.naturalWidth
      const height = image.naturalHeight
      resolve({ width, height })
    }
    image.onerror = reject

    image.src = url
  })
}
