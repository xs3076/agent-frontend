import $i18n from '@/i18n';
import { Button, Dropdown, Input, Menu } from '@arco-design/web-react';
import IconFont from '@/components/ui/IconFont';

import classNames from 'classnames';
import React, { useState } from 'react';
import styles from './index.module.less';
interface SearchProps {
  /** Whether to enable batch operation */
  operationable: boolean;
  /** Custom class name */
  className?: string;
  /** Search callback, triggered when user performs a search */
  onSearch?: (value: string) => void;
  /** Filter change callback, triggered when user changes status or format filter */
  onFilter?: (type: string, value: string) => void;
  /** Batch operation button click callback */
  onBatchOperation?: () => void;
  /** Set upload file modal visible */
  setUploadModalVisible: (visible: boolean) => void;
}

const items: MenuProps['items'] = [
  {
    label: $i18n.get({
      id: 'main.pages.Knowledge.Detail.components.Search.index.allStatuses',
      dm: '全部状态',
    }),
    key: '',
  },
  {
    label: $i18n.get({
      id: 'main.pages.Knowledge.Detail.components.Search.index.pending',
      dm: '待处理',
    }),
    key: 'uploaded',
  },
  {
    label: $i18n.get({
      id: 'main.pages.Knowledge.Detail.components.Search.index.processing',
      dm: '处理中',
    }),
    key: 'processing',
  },
  {
    label: $i18n.get({
      id: 'main.pages.Knowledge.Detail.components.Search.index.completed',
      dm: '处理完成',
    }),
    key: 'processed',
  },
  {
    label: $i18n.get({
      id: 'main.pages.Knowledge.Detail.components.Search.index.failed',
      dm: '处理失败',
    }),
    key: 'failed',
  },
];

const Search: React.FC<SearchProps> = ({
  operationable,
  className,
  onSearch,
  onFilter,
  onBatchOperation,
  setUploadModalVisible,
}) => {
  const [statusName, setStatusName] = useState('');

  return (
    <div className={classNames(styles['search-container'], className)}>
      <div className={styles['search-content']}>
        <Input
          prefix={<IconFont type="spark-search-line" />}
          className={styles['search-input']}
          placeholder={$i18n.get({
            id: 'main.pages.Knowledge.Detail.components.Search.index.enterFileName',
            dm: '请输入文件名',
          })}
          onPressEnter={(e) =>
            onSearch && onSearch((e.target as HTMLInputElement).value)
          }
        />

        <div className={styles['select-group']}>
          <Dropdown
            droplist={
              <Menu onClickMenuItem={(key) => {
                onFilter?.('index_status', key);
                const item = items.find((i: any) => i.key === key);
                if (item) setStatusName(item.label as string);
              }}>
                {items.map((item: any) => (
                  <Menu.Item key={item.key}>{item.label}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <div className="flex items-center gap-1.5">
              <Button type="textCompact">
                {statusName ||
                  $i18n.get({
                    id: 'main.pages.Knowledge.Detail.components.Search.index.allStatuses',
                    dm: '全部状态',
                  })}
              </Button>
              <IconFont
                type="spark-down-line"
                className={styles['dropdown-icon']}
              />
            </div>
          </Dropdown>
        </div>
        {!operationable && (
          <div className="flex items-center gap-2">
            <Button type="default" onClick={onBatchOperation}>
              {$i18n.get({
                id: 'main.pages.Knowledge.Detail.components.Search.index.batchOperation',
                dm: '批量操作',
              })}
            </Button>
            <Button
              type="primary"
              icon={<IconFont type="spark-plus-line" />}
              onClick={() => setUploadModalVisible(true)}
            >
              {$i18n.get({
                id: 'main.pages.Knowledge.Detail.components.Search.index.uploadFile',
                dm: '上传文件',
              })}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
