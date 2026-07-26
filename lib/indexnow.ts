// IndexNow — instant URL submission to Bing (and Yandex, Seznam…). One POST
// tells Bing a URL is new or changed, so client sites get crawled in hours
// instead of weeks. IndexNow IS the "Bing API" for indexing.
//
// The key is public by design: it is also served as a text file at
// https://<host>/<key>.txt (see app/[indexnowKey]/route.ts) so IndexNow can
// verify ownership. Publishing the key in the client bundle is expected and
// safe — it grants nothing beyond "may submit URLs for this host".

export const INDEXNOW_KEY = "a3f9c2e1b7d84a6f9e0c1b2d3a4f5e6c";

/**
 * Notify IndexNow (Bing) that the given URLs changed. Best-effort and
 * non-throwing: indexing is never allowed to break a publish flow. Returns
 * true when the batch was accepted (HTTP 200/202).
 */
export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  const list = urls.filter((u) => /^https:\/\//.test(u));
  if (list.length === 0) return false;
  let host: string;
  try {
    host = new URL(list[0]).host;
  } catch {
    return false;
  }
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
        urlList: list.slice(0, 10000),
      }),
    });
    return res.status === 200 || res.status === 202;
  } catch {
    return false;
  }
}
