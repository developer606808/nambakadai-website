
import { getSession } from "next-auth/react"

interface RequestOptions extends RequestInit {
  headers?: HeadersInit
  body?: any
}

async function api<T>(url: string, options?: RequestOptions): Promise<T> {
  const session = await getSession()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  }

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`
  }

  const config: RequestInit = {
    ...options,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Something went wrong")
  }

  return response.json()
}

export const apiClient = {
  get: <T>(url: string, options?: RequestOptions) => api<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, data: any, options?: RequestOptions) => api<T>(url, { ...options, method: "POST", body: data }),
  put: <T>(url: string, data: any, options?: RequestOptions) => api<T>(url, { ...options, method: "PUT", body: data }),
  delete: <T>(url: string, options?: RequestOptions) => api<T>(url, { ...options, method: "DELETE" }),
}
