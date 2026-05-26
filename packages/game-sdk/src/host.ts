import { gameToHostMessage, type HostToGameMessage } from './protocol';

export interface HostMountOptions {
  /** Where to render the game. Provide a parent element; an iframe will be appended. */
  container: HTMLElement;
  /** URL of the game bundle's HTML entry. */
  bundleUrl: string;
  /** Allowed origin for postMessage validation (default: same as bundleUrl). */
  expectedOrigin?: string;
  sessionId: string;
  userId: string;
  classroomId?: string | null;
  locale?: string;
  reducedMotion?: boolean;
  soundEnabled?: boolean;
  onReady?: (capabilities: string[]) => void;
  onProgress?: (percent: number) => void;
  onScore?: (score: number) => void;
  onComplete?: (payload: {
    score: number;
    correctCount: number;
    totalCount: number;
    durationMs: number;
    metrics: Record<string, number | string | boolean>;
  }) => void;
  onError?: (code: string, message: string) => void;
}

/**
 * Embeds a game into an iframe inside `container` and brokers messages
 * between the embedded game and the host application. Returns an unmount
 * function.
 */
export function mountGameInIframe(opts: HostMountOptions): () => void {
  const iframe = document.createElement('iframe');
  iframe.src = opts.bundleUrl;
  iframe.title = 'SUMMIT game';
  iframe.allow = 'autoplay; fullscreen';
  iframe.sandbox.add(
    'allow-scripts',
    'allow-same-origin',
    'allow-pointer-lock',
  );
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';
  opts.container.appendChild(iframe);

  const expectedOrigin = (() => {
    try {
      return opts.expectedOrigin ?? new URL(opts.bundleUrl, location.origin).origin;
    } catch {
      return '';
    }
  })();

  const send = (msg: HostToGameMessage) => {
    iframe.contentWindow?.postMessage(msg, expectedOrigin || '*');
  };

  const send_init = () =>
    send({
      v: 1,
      id: cryptoRandomId(),
      kind: 'summit:init',
      sessionId: opts.sessionId,
      userId: opts.userId,
      classroomId: opts.classroomId ?? null,
      locale: opts.locale ?? 'en-CA',
      reducedMotion: opts.reducedMotion ?? false,
      soundEnabled: opts.soundEnabled ?? true,
    });

  function handleMessage(event: MessageEvent) {
    if (expectedOrigin && event.origin !== expectedOrigin) return;
    if (event.source !== iframe.contentWindow) return;
    const parsed = gameToHostMessage.safeParse(event.data);
    if (!parsed.success) return;
    const msg = parsed.data;
    switch (msg.kind) {
      case 'summit:ready':
        opts.onReady?.(msg.capabilities);
        send_init();
        break;
      case 'summit:progress':
        opts.onProgress?.(msg.percent);
        break;
      case 'summit:score':
        opts.onScore?.(msg.score);
        break;
      case 'summit:complete':
        opts.onComplete?.({
          score: msg.score,
          correctCount: msg.correctCount,
          totalCount: msg.totalCount,
          durationMs: msg.durationMs,
          metrics: msg.metrics,
        });
        break;
      case 'summit:error':
        opts.onError?.(msg.code, msg.message);
        break;
    }
  }

  window.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('message', handleMessage);
    iframe.remove();
  };
}

function cryptoRandomId() {
  return crypto.randomUUID();
}
