import { redirect } from 'next/navigation'

export default function HomePage() {
  // Server-side redirect - no loading screen
  redirect('/login')
}