import $i18n from '@/i18n';
import Markdown from '@/components/ui/Markdown';
import { IFileSearchResult } from '@/types/chat';
import { Collapse, Typography, Tooltip } from '@arco-design/web-react';
import cls from 'classnames';
import styles from './index.module.less';
const ResultItem = (props: { item: IFileSearchResult }) => {
  const { item } = props;
  return (
    <div className={styles.resultItem}>
      <Collapse bordered={false}>
        <Collapse.Item
          name="knowledge"
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Tooltip content={item.doc_name}>
                <Typography.Text
                  ellipsis
                  style={{ maxWidth: '400px' }}
                >
                  {item.doc_name}
                </Typography.Text>
              </Tooltip>
              <div className={styles.header}>
                <span style={{ width: 'max-content' }}>
                  {$i18n.get({
                    id: 'main.components.SparkChat.components.Steps.Knowledge.index.score',
                    dm: '得分：',
                  })}
                </span>
                {item.score ? Number(item.score).toFixed(2) : '0%'}
              </div>
            </div>
          }
        >
          <div className="p-[8px_12px]" style={{ backgroundColor: 'var(--color-bg-1)' }}>
            <div className={cls(styles.resultCon, styles.textContent)}>
              <Markdown content={item.text || ''} />
            </div>
          </div>
        </Collapse.Item>
      </Collapse>
    </div>
  );
};
export interface IProps {
  data: IFileSearchResult[];
}
export default function Knowledge(props: IProps) {
  const { data } = props;
  return (
    <div className={styles.content}>
      {data?.length > 0 ? (
        data.map?.((item, index) => <ResultItem item={item} key={index} />)
      ) : (
        <span className={styles.textNull}>-</span>
      )}
    </div>
  );
}
