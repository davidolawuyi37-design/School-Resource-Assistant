type TokenProvider = () => Promise<string | null>;

let tokenProvider: TokenProvider | null = null;

export function setClerkTokenProvider(provider: TokenProvider) {
  tokenProvider = provider;
}

export async function getClerkToken() {
  return tokenProvider ? tokenProvider() : null;
}
