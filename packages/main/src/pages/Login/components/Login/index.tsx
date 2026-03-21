import { ENV } from '@/config/env';
import $i18n from '@/i18n';
import { Button } from '@spark-ai/design';
import { RobotOutlined } from '@ant-design/icons';
import { Checkbox, Divider, Form } from 'antd';
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
      <div className={styles['login-header']}>
        <div className={styles['login-icon']}>
          <RobotOutlined />
        </div>
        <div className={styles['login-title']}>
          {$i18n.get({
            id: 'main.pages.Login.components.Login.index.welcomeBack',
            dm: '欢迎回来',
          })}
        </div>
        <div className={styles['login-subtitle']}>
          {$i18n.get({
            id: 'main.pages.Login.components.Login.index.pleaseLoginVAgent',
            dm: '请登录您的 VAgent 账号',
          })}
        </div>
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
        layout="vertical"
      >
        <Form.Item
          name="username"
          label={$i18n.get({
            id: 'main.pages.Login.components.Login.index.accountLabel',
            dm: '账号',
          })}
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
          name="password"
          label={$i18n.get({
            id: 'main.pages.Login.components.Login.index.passwordLabel',
            dm: '密码',
          })}
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

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>
            {$i18n.get({
              id: 'main.pages.Login.components.Login.index.rememberMe',
              dm: '记住我',
            })}
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            autoFocus
            htmlType="submit"
            tooltipContent={
              false
                ? $i18n.get({
                    id: 'main.pages.Login.components.Login.index.notSupportedAccountPasswordLogin',
                    dm: '暂不支持账号密码登录',
                  })
                : undefined
            }
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
