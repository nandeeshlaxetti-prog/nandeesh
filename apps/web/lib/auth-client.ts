/**
 * IPC wrapper for desktop authentication
 * Provides fallback when IPC is not available
 */

interface LoginCredentials {
  email: string
  password: string
  remember: boolean
}

interface LoginResponse {
  ok: boolean
  user?: {
    email: string
  }
  error?: string
}

declare global {
  interface Window {
    app?: {
      invoke: (method: string, payload: any) => Promise<any>
    }
  }
}

export async function loginIPC(credentials: LoginCredentials): Promise<LoginResponse> {
  if (typeof window === 'undefined' || !window.app?.invoke) {
    throw new Error('IPC_UNAVAILABLE')
  }

  try {
    const result = await window.app.invoke('auth.login', credentials)
    return result
  } catch (error) {
    throw new Error(`IPC call failed: ${error}`)
  }
}

export function isIPCAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.app?.invoke
}
