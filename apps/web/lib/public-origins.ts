type PublicOriginEnvironment = {
  PUBLIC_WEB_ORIGIN?: string;
  ALTERNATE_WEB_ORIGIN?: string;
};

function parseOrigin(name: string, value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name}에는 올바른 URL origin을 입력해야 합니다.`);
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      `${name}에는 경로가 없는 HTTP(S) origin을 입력해야 합니다.`,
    );
  }

  return url.origin;
}

export function getPublicOrigins(
  environment: PublicOriginEnvironment = {
    PUBLIC_WEB_ORIGIN: process.env.PUBLIC_WEB_ORIGIN,
    ALTERNATE_WEB_ORIGIN: process.env.ALTERNATE_WEB_ORIGIN,
  },
): [string, ...string[]] {
  const primary = parseOrigin(
    "PUBLIC_WEB_ORIGIN",
    environment.PUBLIC_WEB_ORIGIN?.trim() || "http://localhost:3000",
  );
  const alternateValue = environment.ALTERNATE_WEB_ORIGIN?.trim();

  if (!alternateValue) return [primary];

  const alternate = parseOrigin("ALTERNATE_WEB_ORIGIN", alternateValue);
  return alternate === primary ? [primary] : [primary, alternate];
}
