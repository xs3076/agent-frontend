import $i18n from '@/i18n';
import { authGithubLogin } from '@/services/login';
import { IconGithub } from '@arco-design/web-react/icon';
import { Button } from '@arco-design/web-react';
import styles from './index.module.less';

export default function () {
  return (
    <Button
      onClick={async () => {
        const { data: authUrl } = await authGithubLogin();
        location.href = authUrl;
      }}
      icon={<IconGithub />}
      className={styles['other-login']}
      block
    >
      {$i18n.get({
        id: 'main.pages.Login.components.Login.index.useGithubLogin',
        dm: '使用 GitHub 登录',
      })}
    </Button>
  );
}
