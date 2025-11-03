// Lazy import SDK to avoid hard dependency at build time

const accessKeyId = process.env.VOLC_TOS_ACCESS_KEY_ID as string | undefined;
const secretAccessKey = process.env.VOLC_TOS_SECRET_ACCESS_KEY as string | undefined;
const region = process.env.VOLC_TOS_REGION as string | undefined; // e.g. cn-hongkong
const endpoint = process.env.VOLC_TOS_ENDPOINT as string | undefined; // e.g. https://tos-cn-hongkong.volces.com 或 https://storybooks.tos-cn-hongkong.volces.com

function normalizeEndpoint(input: string): URL {
  let str = (input || "").trim();
  if (str.startsWith("https://https://")) str = str.replace("https://https://", "https://");
  if (str.startsWith("http://http://")) str = str.replace("http://http://", "http://");
  const lastHttps = str.lastIndexOf("https://");
  const lastHttp = str.lastIndexOf("http://");
  const lastIdx = Math.max(lastHttps, lastHttp);
  if (lastIdx > 0) {
    const schema = str.slice(lastIdx, lastIdx + (lastHttps > lastHttp ? 8 : 7));
    str = schema + str.slice(lastIdx + (lastHttps > lastHttp ? 8 : 7));
  }
  if (!/^https?:\/\//i.test(str)) str = `https://${str}`;
  try {
    return new URL(str);
  } catch {
    return new URL("https://tos-cn-hongkong.volces.com");
  }
}
const bucket = process.env.VOLC_TOS_BUCKET as string | undefined; // e.g. storybooks
const publicBaseUrl = process.env.VOLC_TOS_PUBLIC_BASE_URL as string | undefined; // optional CDN/custom domain

// Note: using official SDK; custom TOS4 signing helpers removed

function buildObjectKey(prefix?: string, ext?: string): string {
  const id = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const date = new Date();
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const base = `${yyyy}/${mm}/${dd}/${id}`;
  const safeExt = (ext && ext.startsWith(".")) ? ext : (ext ? `.${ext}` : "");
  return prefix ? `${prefix.replace(/\/$/, "")}/${base}${safeExt}` : `${base}${safeExt}`;
}

function guessExtFromContentType(contentType?: string | null): string | undefined {
  if (!contentType) return undefined;
  if (contentType.includes("image/png")) return ".png";
  if (contentType.includes("image/jpeg") || contentType.includes("image/jpg")) return ".jpg";
  if (contentType.includes("image/webp")) return ".webp";
  if (contentType.includes("image/gif")) return ".gif";
  return undefined;
}

function toPublicUrl(key: string): string {
  if (publicBaseUrl) return `${publicBaseUrl.replace(/\/$/, "")}/${key}`;
  // Fallback to virtual hosted-style if caller bound DNS; otherwise path-style
  try {
    const ep = normalizeEndpoint(endpoint!);
    const host = ep.host;
    const hasBucketInHost = host.toLowerCase().startsWith(`${String(bucket).toLowerCase()}.`);
    const finalHost = hasBucketInHost ? host : `${bucket}.${host}`;
    return `${ep.protocol}//${finalHost}/${key}`;
  } catch {
    return `${endpoint}/${bucket}/${key}`;
  }
}

function isRelativePath(url: string): boolean {
  return /^\/?(images|samples|public)\//.test(url) || url.startsWith('/') && !/^\/\//.test(url);
}

function sameHostOrAlreadyHosted(url: string): boolean {
  try {
    const u = new URL(url);
    const ep = normalizeEndpoint(endpoint!);
    const hosts = [ep.host];
    if (publicBaseUrl) {
      try { hosts.push(new URL(publicBaseUrl).host); } catch {}
    }
    // also bucket prefixed
    hosts.push(`${bucket}.${ep.host}`);
    return hosts.includes(u.host);
  } catch {
    return false;
  }
}

export async function uploadImageFromUrl(sourceUrl: string, options?: { keyPrefix?: string; objectKey?: string; }): Promise<string> {
  if (!accessKeyId || !secretAccessKey || !region || !endpoint || !bucket) {
    console.warn("[TOS] VOLC TOS env not configured. Returning original URL without upload.");
    // Return original URL if TOS is not configured (graceful fallback)
    return sourceUrl;
  }

  // Bypass upload for local/static or already-hosted URLs
  if (isRelativePath(sourceUrl) || sameHostOrAlreadyHosted(sourceUrl) || sourceUrl.startsWith('data:')) {
    try {
      const srcHost = isRelativePath(sourceUrl) ? 'local' : new URL(sourceUrl).host;
      const epHost = normalizeEndpoint(endpoint!).host;
      console.log('[TOS] Bypass upload:', { fromHost: srcHost, toEndpointHost: epHost, reason: 'local-or-hosted' });
    } catch {}
    return sourceUrl;
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || undefined;

  const ext = guessExtFromContentType(contentType) || 
    (sourceUrl.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/)?.[1] ? `.${sourceUrl.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/)![1]}` : undefined);

  const key = options?.objectKey || buildObjectKey(options?.keyPrefix || "storybook/images", ext);

  try {
    const srcHost = new URL(sourceUrl).host;
    const epHost = normalizeEndpoint(endpoint!).host;
    console.log("[TOS] Upload start:", { fromHost: srcHost, toEndpointHost: epHost, bucket, key });
  } catch {
    console.log("[TOS] Upload start (raw):", { sourceUrl, endpoint, bucket, key });
  }

  // 官方 SDK 客户端（动态导入）
  let TosClient: any;
  try {
    const moduleName = ["@volcengine", "tos-sdk"].join("/");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // Use dynamic module name to avoid static resolution at build time
    // @ts-ignore
    TosClient = (await import(moduleName)).TosClient;
  } catch (e) {
    console.warn("[TOS] @volcengine/tos-sdk is not installed. Returning original URL without upload.");
    // Return original URL if SDK is not available (graceful fallback)
    return sourceUrl;
  }
  const client = new TosClient({
    accessKeyId,
    accessKeySecret: secretAccessKey!,
    region,
    endpoint: normalizeEndpoint(endpoint!).host,
  });

  let result: any;
  try {
    result = await client.putObject({
      bucket: bucket!,
      key,
      body: Buffer.from(arrayBuffer),
      contentType,
      // 如需公开读，可改为 ACLType.ACLPublicRead，并结合桶策略/CDN 一起使用
      // acl: ACLType.ACLPublicRead,
    });
  } catch (e: any) {
    console.error("[TOS] Upload failed:", e?.message || e);
    throw e;
  }

  try {
    console.log("[TOS] Upload response:", result);
  } catch {
    // ignore
  }

  const publicUrl = toPublicUrl(key);
  try {
    const pubHost = new URL(publicUrl).host;
    console.log("[TOS] Upload done:", { publicHost: pubHost, url: publicUrl });
  } catch {
    console.log("[TOS] Upload done (raw):", publicUrl);
  }
  return publicUrl;
}

export async function uploadManyImageUrls(urls: string[], keyPrefix?: string): Promise<string[]> {
  const results = await Promise.allSettled(urls.map(u => uploadImageFromUrl(u, { keyPrefix })));
  return results.map((r, idx) => r.status === "fulfilled" ? r.value : urls[idx]);
}


