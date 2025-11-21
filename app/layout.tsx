import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Architecte Make IA',
  description: 'Concevez des scénarios Make intelligents avec l\'IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
