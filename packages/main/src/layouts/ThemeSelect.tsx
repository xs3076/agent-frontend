export default function () {
  return null;
}

export const prefersColor = {
  get(): 'light' {
    return 'light';
  },
  set(_value: 'light' | 'dark') {
    // no-op: theme switching removed, always light
  },
};
