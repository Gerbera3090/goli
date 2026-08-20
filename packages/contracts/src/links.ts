import { z } from "zod";

export const slugPattern = /^[가-힣a-z0-9_-]+$/u;

export const slugSchema = z
  .string()
  .trim()
  .transform((value) => value.normalize("NFC").toLowerCase())
  .pipe(
    z
      .string()
      .min(2, "slug는 두 글자 이상이어야 합니다.")
      .max(64, "slug는 64자 이하여야 합니다.")
      .regex(
        slugPattern,
        "slug에는 한글, 영문 소문자, 숫자, 밑줄, 하이픈만 사용할 수 있습니다.",
      ),
  );

const reservedSlugs = new Set(["_next", "api", "go", "manage"]);

export const creatableSlugSchema = slugSchema.refine(
  (slug) => !reservedSlugs.has(slug),
  "서비스에서 사용하는 이름은 slug로 만들 수 없습니다.",
);

export const httpUrlSchema = z
  .string()
  .trim()
  .min(1, "이동할 URL을 입력해 주세요.")
  .max(2048, "URL은 2,048자 이하여야 합니다.")
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "http 또는 https URL을 입력해 주세요.")
  .transform((value) => new URL(value).toString());

function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split(".").map(Number);

  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return false;
  }

  const [first = 0, second = 0] = parts;

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 0) ||
    (first === 192 && second === 168) ||
    (first === 198 && (second === 18 || second === 19)) ||
    first >= 224
  );
}

function parseIpv6(hostname: string): number[] | null {
  const halves = hostname.split("::");

  if (halves.length > 2) return null;

  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves[1] ? halves[1].split(":") : [];
  const missingGroups = 8 - left.length - right.length;

  if (missingGroups < 0 || (halves.length === 1 && missingGroups !== 0)) {
    return null;
  }

  const groups = [
    ...left,
    ...Array.from({ length: missingGroups }, () => "0"),
    ...right,
  ].map((group) => Number.parseInt(group, 16));

  if (
    groups.length !== 8 ||
    groups.some(
      (group) => !Number.isInteger(group) || group < 0 || group > 0xffff,
    )
  ) {
    return null;
  }

  return groups;
}

function isPrivateIpv6(hostname: string): boolean {
  const groups = parseIpv6(hostname);

  if (!groups) return false;

  const [first = 0] = groups;
  const isUnspecifiedOrLoopback =
    groups.slice(0, 7).every((group) => group === 0) &&
    (groups[7] === 0 || groups[7] === 1);
  const isUniqueLocal = first >= 0xfc00 && first <= 0xfdff;
  const isLinkLocal = first >= 0xfe80 && first <= 0xfebf;
  const isMulticast = first >= 0xff00;
  const isIpv4Mapped =
    groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff;

  if (isIpv4Mapped) {
    const high = groups[6] ?? 0;
    const low = groups[7] ?? 0;
    const mappedIpv4 = [high >> 8, high & 0xff, low >> 8, low & 0xff].join(".");
    return isPrivateIpv4(mappedIpv4);
  }

  return isUnspecifiedOrLoopback || isUniqueLocal || isLinkLocal || isMulticast;
}

function isPrivateHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local")
  ) {
    return true;
  }

  if (isPrivateIpv4(normalized)) {
    return true;
  }

  return normalized.includes(":") && isPrivateIpv6(normalized);
}

export const createTargetUrlSchema = httpUrlSchema.refine((value) => {
  const url = new URL(value);

  return !url.username && !url.password && !isPrivateHostname(url.hostname);
}, "로그인 정보가 포함된 주소나 내부 네트워크 주소는 사용할 수 없습니다.");

export const createLinkRequestSchema = z
  .object({
    targetUrl: createTargetUrlSchema,
    slug: creatableSlugSchema.optional(),
  })
  .strict();

export const linkSchema = z.object({
  id: z.number().int().positive(),
  slug: slugSchema,
  targetUrl: httpUrlSchema,
  createdByUserId: z.literal(0),
  shortPath: z.string().regex(/^\/[^/]+$/),
  createdAt: z.string().datetime(),
});

export const resolveLinkResponseSchema = linkSchema.pick({
  slug: true,
  targetUrl: true,
});

export type CreateLinkRequest = z.infer<typeof createLinkRequestSchema>;
export type LinkResponse = z.infer<typeof linkSchema>;
export type ResolveLinkResponse = z.infer<typeof resolveLinkResponseSchema>;
