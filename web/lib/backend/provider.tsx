import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { PropsWithChildren } from "react";
import { AuthProvider } from "./auth/context";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window === "undefined" ? undefined : window.localStorage,
  throttleTime: 300,
});

export function BackendApiProvider({ children }: PropsWithChildren) {
  return (
    <PersistQueryClientProvider client={client} persistOptions={{ persister }}>
      <ReactQueryDevtools />
      <AuthProvider>{children}</AuthProvider>
    </PersistQueryClientProvider>
  );
}
