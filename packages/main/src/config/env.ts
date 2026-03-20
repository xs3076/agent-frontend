declare global {
  interface Window {
    _env_?: Record<string, string>;
  }
}

function getEnv(key: string, fallback = ''): string {
  return window._env_?.[key] ?? fallback;
}

export const ENV = {
  get backEnd() {
    return getEnv('APP_BACK_END', 'java');
  },
  get defaultUsername() {
    return getEnv('APP_DEFAULT_USERNAME');
  },
  get defaultPassword() {
    return getEnv('APP_DEFAULT_PASSWORD');
  },
};
