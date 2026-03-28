import $i18n from '@/i18n';
import IconButton from '@/components/ui/IconButton';
import { Dropdown, Menu } from '@arco-design/web-react';
import React from 'react';
// @ts-ignore
import { useNavigate } from 'umi';

const SettingDropdown: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = window.g_config.user?.type === 'admin';

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleDirectNavigate = () => {
    navigate('/setting/modelService');
  };

  const settingButton = (
    <IconButton
      icon="spark-setting-line"
      bordered={false}
      onClick={!isAdmin ? handleDirectNavigate : undefined}
    />
  );

  if (isAdmin) {
    const droplist = (
      <Menu onClickMenuItem={handleMenuClick}>
        <Menu.Item key="/setting/account">
          {$i18n.get({
            id: 'main.layouts.SettingDropdown.accountManagement',
            dm: '账号管理',
          })}
        </Menu.Item>
        <Menu.Item key="/setting/modelService">
          {$i18n.get({
            id: 'main.pages.Setting.ModelService.index.modelServiceManagement',
            dm: '模型服务管理',
          })}
        </Menu.Item>
        <Menu.Item key="/setting/apiKeys">
          {$i18n.get({
            id: 'main.layouts.SettingDropdown.apiKeyManagement',
            dm: 'API KEY管理',
          })}
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown droplist={droplist} trigger="click">
        <div>{settingButton}</div>
      </Dropdown>
    );
  } else {
    return settingButton;
  }
};

export default SettingDropdown;
