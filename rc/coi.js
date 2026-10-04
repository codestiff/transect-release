// CROSS-ORIGIN ISOLATION FOR A STATIC HOST (docs/plans/055). GitHub Pages
// cannot send the two headers a threaded web runtime needs
// (SharedArrayBuffer), so this service worker adds them to the page's own
// responses. The page registers it and reloads once; if the browser will not
// run it, the page stays un-isolated and loads the single-threaded runtime.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.cache === "only-if-cached" && r.mode !== "same-origin") return;
  e.respondWith(fetch(r).then((res) => {
    if (res.status === 0) return res;
    const h = new Headers(res.headers);
    h.set("Cross-Origin-Embedder-Policy", "require-corp");
    h.set("Cross-Origin-Opener-Policy", "same-origin");
    h.set("Cross-Origin-Resource-Policy", "cross-origin");
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  }).catch((err) => { throw err; }));
});
