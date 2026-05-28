import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexReactClient } from "convex/react";
import { routeTree } from './routeTree.gen'

export let convexClient: ConvexReactClient | null = null;
let convexQueryClient: ConvexQueryClient | null = null;
let queryClient: QueryClient | null = null;

export function getRouter() {
  // 1. Multi-source URL lookup (Namecheap-compatible)
  const CONVEX_URL = 
    (typeof window !== 'undefined' && (window as any).VITE_CONVEX_URL) || 
    (import.meta as any).env.VITE_CONVEX_URL ||
    (typeof process !== 'undefined' && process.env?.VITE_CONVEX_URL);

  if (!CONVEX_URL) {
    console.error('CRITICAL: VITE_CONVEX_URL is missing.');
  }
  
  if (!convexClient && CONVEX_URL) {
    convexClient = new ConvexReactClient(CONVEX_URL)
    convexQueryClient = new ConvexQueryClient(convexClient)
  }

  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          queryKeyHashFn: convexQueryClient!.hashFn(),
          queryFn: convexQueryClient!.queryFn(),
        },
      },
    })
    convexQueryClient!.connect(queryClient)
  }

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: 'intent',
      context: { queryClient },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0, 
      defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
      defaultNotFoundComponent: () => <p>not found</p>,
    }),
    queryClient,
  )

  return router
}
