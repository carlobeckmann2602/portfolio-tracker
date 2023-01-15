// disable service worker logs
// @ts-ignore
self.__WB_DISABLE_DEV_LOGS = true;

async function syncContent() {
  console.log("Syncing content");
  const stocksCache = await caches.open("stocks");
  await stocksCache.add("https://api.mobilesys.de/stocks?name=");

  const user_stocks_cache = await caches.open("user_stocks");
  const request = new Request("https://api.mobilesys.de/users/me/stocks", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
      if (event.tag === "content-sync") {
        // See the "Think before you sync" section for
        // checks you could perform before syncing.
        //@ts-ignore
        event.waitUntil(syncContent());
      }
      // Other logic for different tags as needed.
    });

    // check if background sync is granted
    //@ts-ignore
    const status = await navigator.permissions.query({
      //@ts-ignore
      name: "periodic-background-sync",
    });

    if (status.state === "granted") {
      //@ts-ignore
      const registration = await navigator.serviceWorker.ready;
      try {
        //@ts-ignore
        await registration.periodicSync.register("content-sync", {
          minInterval: 12 * 60 * 60 * 1000, // 12 hours
        });
      } catch (error) {
        // Periodic background sync cannot be used.
      }
    }
  } else {
    console.log("periodicSync not supported");
  }
}

initializeBackgroundSync();

export {};
