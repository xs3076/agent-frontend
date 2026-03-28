import $i18n from '@/i18n';
import { setArcoDarkMode } from '@/arco-theme';
import { getGlobalConfig } from '@/services/globalConfig';
import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import jaJP from '@arco-design/web-react/es/locale/ja-JP';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import '@arco-design/web-react/dist/css/arco.css';
import { useRequest } from 'ahooks';
import 'dayjs/locale/zh-cn';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import styles from './index.module.less';
import { prefersColor } from './ThemeSelect';

// Get current language preset
const langPreset = $i18n.getCurrentLanguage();

/**
 * Pure layout component
 * Provides theme configuration and basic layout structure
 */
export default function PureLayout(props: {
  children: React.ReactNode | React.ReactNode[];
}) {
  // Check for dark mode preference
  const darkMode = prefersColor.get() === 'dark';
  // Set locale based on current language
  const locale = {
    zh: zhCN,
    en: enUS,
    ja: jaJP,
  }[langPreset];

  const { loading } = useRequest(getGlobalConfig);

  // Apply dark mode via Arco theme attribute
  useEffect(() => {
    setArcoDarkMode(darkMode);
  }, [darkMode]);

  if (loading) return null;

  return (
    <ErrorBoundary
      FallbackComponent={(...args) => {
        return <h1> something error </h1>;
      }}
    >
      <ConfigProvider locale={locale}>
        <div className={styles['main']}>{props.children}</div>
      </ConfigProvider>
    </ErrorBoundary>
  );
}
