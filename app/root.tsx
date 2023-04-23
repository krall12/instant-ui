import type { LinksFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import styles from '~/assets/tailwind.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

const queryClient = new QueryClient({
  defaultOptions: {
    // queries: { suspense: true },
  },
})

export default function App() {
  return (
    <Providers>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className="p-4">
          <Suspense fallback="Loading...">
            <Outlet />
          </Suspense>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </Providers>
  )
}

function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
