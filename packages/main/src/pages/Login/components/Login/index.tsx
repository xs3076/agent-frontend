import { ENV } from '@/config/env';
import $i18n from '@/i18n';
import { Button, Divider, Form } from '@arco-design/web-react';
import React, { useEffect } from 'react';
import Email from '../Form/Email';
import Password from '../Form/Password';
import GithubLogin from './GithubLogin';
import styles from './index.module.less';

interface LoginForm {
  username: string;
  password: string;
}

interface IProps {
  loading: boolean;
  onSubmit: (values: LoginForm) => void;
}

const Login: React.FC<IProps> = ({ onSubmit, loading }) => {
  const [form] = Form.useForm<LoginForm>();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((errorInfo) => {
        console.log('Failed:', errorInfo);
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      username: ENV.defaultUsername,
      password: ENV.defaultPassword,
    });
  }, []);

  const supportThirdPartyLogin =
    window.g_config.config.login_method === 'third_party';

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-title']}>
        {$i18n.get({
          id: 'main.pages.Login.components.Login.index.welcomeToAgentScope',
          dm: '🎉 欢迎使用Spring AI Alibaba Studio',
        })}
      </div>

      {supportThirdPartyLogin && (
        <>
          <div>
            <GithubLogin />
          </div>

          <Divider>
            <div className="text-[12px]">
              {$i18n.get({
                id: 'main.pages.Login.components.Login.index.otherWaysLogin',
                dm: '其他方式登录',
              })}
            </div>
          </Divider>
        </>
      )}

      <Form
        form={form}
        name="login"
        autoComplete="off"
        className={styles['login-form']}
      >
        <Form.Item
          className="mb-0"
          field="username"
          rules={[
            {
              required: true,
              message: $i18n.get({
                id: 'main.pages.Login.components.Login.index.enterAccount',
                dm: '请输入账号',
              }),
            },
          ]}
        >
          <Email disabled={false} />
        </Form.Item>

        <Form.Item
          field="password"
          rules={[
            {
              required: true,
              message: $i18n.get({
                id: 'main.pages.Login.components.Login.index.enterPassword',
                dm: '请输入密码',
              }),
            },
          ]}
        >
          <Password disabled={false} />
        </Form.Item>

        <Form.Item>
          <Button
            autoFocus
            htmlType="submit"
            disabled={false}
            type="primary"
            onClick={handleSubmit}
            className={styles['login-button']}
            loading={loading}
          >
            {$i18n.get({
              id: 'main.pages.Login.components.Login.index.login',
              dm: '登录',
            })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
