// Minimal Firestore REST client for public, unauthenticated reads. Works in the
// browser and in Node (snapshot script). Security rules decide what is readable.
import { FIRESTORE_PROJECT_ID } from "./config";

type RestValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { timestampValue: string }
  | { stringValue: string }
  | { arrayValue: { values?: RestValue[] } }
  | { mapValue: { fields?: Record<string, RestValue> } };

export interface RestDocument {
  name: string;
  fields?: Record<string, RestValue>;
}

export const decodeValue = (value: RestValue): unknown => {
  if ("nullValue" in value) return null;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("timestampValue" in value) return new Date(value.timestampValue).toISOString();
  if ("stringValue" in value) return value.stringValue;
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue.fields ?? {});
  // Unsupported types (bytes, references, geo points) are not used by content.
  return undefined;
};

const decodeFields = (fields: Record<string, RestValue>) =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]),
  );

// Returns the doc fields plus `id` (the last path segment of its name).
export const decodeDocument = (doc: RestDocument): Record<string, unknown> => ({
  ...decodeFields(doc.fields ?? {}),
  id: doc.name.slice(doc.name.lastIndexOf("/") + 1),
});

const base = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents`;

const request = async (url: string, init: RequestInit, timeoutMs: number) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

// Null when the doc does not exist or is not readable; throws on network errors.
export const getPublicDocument = async (path: string, timeoutMs = 8000) => {
  const response = await request(`${base}/${path}`, {}, timeoutMs);
  if (response.status === 404 || response.status === 403) return null;
  if (!response.ok) throw new Error(`Firestore ${response.status}`);
  return decodeDocument((await response.json()) as RestDocument);
};

// Published docs of one collection. The `published == true` filter is required
// for the security rules to allow an unauthenticated list.
export const listPublished = async (collectionId: string, timeoutMs = 8000) => {
  const response = await request(
    `${base}:runQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId }],
          where: {
            fieldFilter: {
              field: { fieldPath: "published" },
              op: "EQUAL",
              value: { booleanValue: true },
            },
          },
        },
      }),
    },
    timeoutMs,
  );
  if (!response.ok) throw new Error(`Firestore ${response.status}`);
  const rows = (await response.json()) as { document?: RestDocument }[];
  return rows.flatMap((row) => (row.document ? [decodeDocument(row.document)] : []));
};
