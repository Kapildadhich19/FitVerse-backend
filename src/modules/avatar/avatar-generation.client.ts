import { env } from '../../config/env.js';
import { AppError } from '../../shared/errors/app-error.js';

export type GenerationTaskStatus = 'processing' | 'completed' | 'failed';

type GenerationImages = Record<'front' | 'left' | 'right' | 'back', string>;

type GenerationStatus = {
  taskId: string;
  status: GenerationTaskStatus;
  progress: number;
  error: string | null;
};

function getHeaders() {
  if (!env.AI_SERVICE_TOKEN) {
    throw new AppError(
      503,
      'Avatar generation is not configured',
      'AI_SERVICE_NOT_CONFIGURED',
    );
  }

  return {
    Authorization: `Bearer ${env.AI_SERVICE_TOKEN}`,
  };
}

async function request(path: string, init: RequestInit = {}) {
  let response: Response;

  try {
    response = await fetch(new URL(path, env.AI_SERVICE_URL), {
      ...init,
      headers: {
        ...getHeaders(),
        ...init.headers,
      },
      signal: AbortSignal.timeout(env.AI_SERVICE_TIMEOUT_MS),
    });
  } catch {
    throw new AppError(
      503,
      'Avatar generation service is unavailable',
      'AI_SERVICE_UNAVAILABLE',
    );
  }

  if (!response.ok) {
    let detail = 'Avatar generation service request failed';
    try {
      const body = (await response.json()) as { detail?: string };
      detail = body.detail || detail;
    } catch {
      // Keep the generic message when the service returned a non-JSON error.
    }

    throw new AppError(
      response.status === 503 ? 503 : 502,
      detail,
      'AI_SERVICE_ERROR',
    );
  }

  return response;
}

export const avatarGenerationClient = {
  async create(images: GenerationImages) {
    const response = await request('/v1/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images }),
    });
    return (await response.json()) as {
      taskId: string;
      status: GenerationTaskStatus;
    };
  },

  async status(taskId: string) {
    const response = await request(
      `/v1/generations/${encodeURIComponent(taskId)}`,
    );
    return (await response.json()) as GenerationStatus;
  },

  async artifact(taskId: string, artifactName: 'model' | 'thumbnail') {
    const response = await request(
      `/v1/generations/${encodeURIComponent(taskId)}/artifacts/${artifactName}`,
    );
    return {
      buffer: Buffer.from(await response.arrayBuffer()),
      mimeType:
        response.headers.get('content-type') ?? 'application/octet-stream',
      fileName: artifactName === 'model' ? 'avatar.glb' : 'avatar.png',
    };
  },
};
