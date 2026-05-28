import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { convexClient } from '../router'
import appCss from '~/styles/app.css?url'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'App',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  notFoundComponent: () => <div>Route not found</div>,
  component: RootComponent,
})

function RootComponent() {
  if (!convexClient) {
    return <div>Initializing client...</div>
  }

  return (
    <ConvexAuthProvider client={convexClient}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ConvexAuthProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
        <script src="https://checkout.flutterwave.com/v3.js" async></script>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
