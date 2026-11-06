// Reads a token Supabase has already verified. Only OAuth tokens carry a client_id, normal web sessions do not.
export function isOAuthClientToken(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    return typeof payload.client_id === "string" && payload.client_id.length > 0;
  } catch {
    return false;
  }
}
