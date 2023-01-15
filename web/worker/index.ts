// disable service worker logs
// @ts-ignore
self.__WB_DISABLE_DEV_LOGS = true;

let authToken: string | null = null;
let resolveAuthTokenRequest: (value?: never) => void = () => {};

// listen for messages from the window
self.addEventListener("message", (event: MessageEvent<any>) => {
  if (event.data.type === "setAuthToken") {
    authToken = event.data.authToken;
    resolveAuthTokenRequest();
  }
});

async function syncStockData() {
  const stocksCache = await caches.open("stocks");
  await stocksCache.add("https://api.mobilesys.de/stocks?name=");
}

async function syncUserStocks() {
  // to sync user stocks, we need the auth token
  // if no auth token is available, wait for it
  // while the we request the auth token from the window
  if (!authToken) {
    await new Promise(async (resolve) => {
      // save the resolve function to call it later
      resolveAuthTokenRequest = resolve;
      const window = (await self.clients.matchAll({ type: "window" }))[0];
      // send a message to the window to get the auth token
      window.postMessage({
        type: "getAuthToken",
      });
    });
  }

  const user_stocks_cache = await caches.open("user_stocks");
  const request = new Request("https://api.mobilesys.de/users/me/stocks", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  await user_stocks_cache.add(request);
}

async function initializeBackgroundSync() {
  // check if background sync is supported
  if ("periodicSync" in self.registration) {
    // register periodicsync event listener
    self.addEventListener("periodicsync", (event) => {
      //@ts-ignore
      switch (event.tag) {
        case "syncStockData":
          //@ts-ignore
          event.waitUntil(syncStockData());
          break;
        case "syncUserStocks":
          //@ts-ignore
          event.waitUntil(syncUserStocks());
          break;
      }
    });

    // check if background sync is granted
    //@ts-ignore
    const status = await navigator.permissions.query({
      //@ts-ignore
      name: "periodic-background-sync",
    });

    if (status.state === "granted") {
      try {
        // register periodic Sync with a minimum interval of 12 hours
        //@ts-ignore
        await self.registration.periodicSync.register("syncStockData", {
          minInterval: 12 * 60 * 60 * 1000, // 12 hours
        });

        //@ts-ignore
        await self.registration.periodicSync.register("syncUserStocks", {
          minInterval: 12 * 60 * 60 * 1000, // 12 hours
        });
      } catch (error) {
        console.log("periodicSync could not be registered");
      }
    }
  } else {
    console.log("periodicSync not supported");
  }
}

initializeBackgroundSync();

export {};
