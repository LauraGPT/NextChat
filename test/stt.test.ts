import { jest } from "@jest/globals";

import {
  getTranscriptionEndpoint,
  getTranscriptionHeaders,
  transcribeAudio,
} from "../app/utils/stt";

describe("FunASR-compatible transcription requests", () => {
  test("normalizes a server base URL to the OpenAI transcription endpoint", () => {
    expect(getTranscriptionEndpoint("http://127.0.0.1:10095/")).toBe(
      "http://127.0.0.1:10095/v1/audio/transcriptions",
    );
    expect(getTranscriptionEndpoint("http://127.0.0.1:10095/v1")).toBe(
      "http://127.0.0.1:10095/v1/audio/transcriptions",
    );
  });

  test("only emits bearer authorization when the user configured a token", () => {
    expect(getTranscriptionHeaders("")).toEqual({});
    expect(getTranscriptionHeaders(" local-token ")).toEqual({
      Authorization: "Bearer local-token",
    });
  });

  test("sends the OpenAI-compatible multipart contract and returns text", async () => {
    const request = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ text: "transcribed speech" }),
    });
    const audio = new File(["audio"], "recording.webm", {
      type: "audio/webm",
    });

    await expect(
      transcribeAudio(
        audio,
        {
          baseUrl: "http://127.0.0.1:10095",
          model: "FunAudioLLM/Fun-ASR-Nano-2512",
          apiKey: "local-token",
        },
        request,
      ),
    ).resolves.toBe("transcribed speech");

    const [endpoint, init] = request.mock.calls[0];
    expect(endpoint).toBe("http://127.0.0.1:10095/v1/audio/transcriptions");
    expect(init.headers).toEqual({ Authorization: "Bearer local-token" });
    expect(init.body.get("model")).toBe("FunAudioLLM/Fun-ASR-Nano-2512");
    expect(init.body.get("file")).toBeInstanceOf(File);
  });
});
