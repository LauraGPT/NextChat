export function getTranscriptionEndpoint(baseUrl: string): string {
  const normalizedBaseUrl = baseUrl
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/v1$/, "");

  return `${normalizedBaseUrl}/v1/audio/transcriptions`;
}

export function getTranscriptionHeaders(
  apiKey: string,
): Record<string, string> {
  const token = apiKey.trim();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type TranscriptionConfig = {
  baseUrl: string;
  model: string;
  apiKey: string;
};

type TranscriptionResponse = {
  text?: string;
  error?: { message?: string };
};

export async function transcribeAudio(
  audio: File,
  config: TranscriptionConfig,
  request: typeof fetch = fetch,
): Promise<string> {
  const form = new FormData();
  form.set("file", audio);

  const model = config.model.trim();
  if (model) form.set("model", model);

  const response = await request(getTranscriptionEndpoint(config.baseUrl), {
    method: "POST",
    headers: getTranscriptionHeaders(config.apiKey),
    body: form,
  });
  const payload = (await response.json()) as TranscriptionResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Transcription request failed");
  }
  if (typeof payload.text !== "string") {
    throw new Error("Transcription response did not include text");
  }

  return payload.text;
}
