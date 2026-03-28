export const arcoTheme = {
  '--color-primary-6': '#722ED1',
  '--color-primary-5': '#8B4FD8',
  '--color-primary-4': '#A472DF',
  '--color-primary-3': '#BD95E6',
  '--color-primary-2': '#D6B8ED',
  '--color-primary-1': '#EFDBF4',
  '--border-radius-small': '4px',
  '--border-radius-medium': '6px',
  '--border-radius-large': '8px',
};

export function setArcoDarkMode(dark: boolean) {
  if (dark) {
    document.body.setAttribute('arco-theme', 'dark');
  } else {
    document.body.removeAttribute('arco-theme');
  }
}
