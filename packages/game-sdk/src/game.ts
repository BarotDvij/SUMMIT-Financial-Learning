import {
  SDK_VERSION,
  hostToGameMessage,
  type HostToGameMessage,
  type GameToHostMessage,
} from './protocol';

/**
 * Loaded inside a game bundle. Sends `ready`, listens for `init`, and
 * exposes helpers to emit progress/score/complete back to the host.
 *
 * Games target both browser iframes and React Native WebView. In RN the
 * "host" is `window.ReactNativeWebView`; we shim through it transparently.
 */
export interface GameClient {
  ready(capabilities: string[]): void;
  progress(percent: number): void;
  score(score: number): void;
  complete(payload: {
    score: number;
    correctCount: number;
    totalCount: number;
    durationMs: number;
    metrics?: Record<string, number | string | boolean>;
  }): void;
  error(code: string, message: string): void;
  onInit(handler: (msg: Extract<HostToGameMessage, { kind: 'summit:init' }>) => void): void;
  onPause(handler: () => void): void;
  onResume(handler: () => void): void;
  onEnd(handler: () => void): void;
}

interface ReactNativeWebView {
  postMessage(data: string): void;
}

declare global {
  interface Window {
    ReactNativeWebView?: ReactNativeWebView;
  }
}

const send = (msg: GameToHostMessage) => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    return;
  }
  window.parent?.postMessage(msg, '*');
};

const id = () => crypto.randomUUID();

export function createGameClient(): GameClient {
  const initHandlers: Array<(msg: Extract<HostToGameMessage, { kind: 'summit:init' }>) => void> = [];
  const pauseHandlers: Array<() => void> = [];
  const resumeHandlers: Array<() => void> = [];
  const endHandlers: Array<() => void> = [];

  function handle(event: MessageEvent) {
    const data = typeof event.data === 'string' ? safeParseJson(event.data) : event.data;
    const parsed = hostToGameMessage.safeParse(data);
    if (!parsed.success) return;
    const msg = parsed.data;
    switch (msg.kind) {
      case 'summit:init':
        initHandlers.forEach((h) => h(msg));
        break;
      case 'summit:pause':
        pauseHandlers.forEach((h) => h());
        break;
      case 'summit:resume':
        resumeHandlers.forEach((h) => h());
        break;
      case 'summit:end':
        endHandlers.forEach((h) => h());
        break;
    }
  }

  window.addEventListener('message', handle);

  return {
    ready(capabilities) {
      send({ v: SDK_VERSION, id: id(), kind: 'summit:ready', sdkVersion: SDK_VERSION, capabilities });
    },
    progress(percent) {
      send({ v: SDK_VERSION, id: id(), kind: 'summit:progress', percent });
    },
    score(score) {
      send({ v: SDK_VERSION, id: id(), kind: 'summit:score', score });
    },
    complete(payload) {
      send({
        v: SDK_VERSION,
        id: id(),
        kind: 'summit:complete',
        score: payload.score,
        correctCount: payload.correctCount,
        totalCount: payload.totalCount,
        durationMs: payload.durationMs,
        metrics: payload.metrics ?? {},
      });
    },
    error(code, message) {
      send({ v: SDK_VERSION, id: id(), kind: 'summit:error', code, message });
    },
    onInit(h) {
      initHandlers.push(h);
    },
    onPause(h) {
      pauseHandlers.push(h);
    },
    onResume(h) {
      resumeHandlers.push(h);
    },
    onEnd(h) {
      endHandlers.push(h);
    },
  };
}

function safeParseJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
