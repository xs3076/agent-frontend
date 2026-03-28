import $i18n from '@/i18n';
import Markdown from '@/components/ui/Markdown';
import IconFont from '@/components/ui/IconFont';
import { Collapse, Message } from '@arco-design/web-react';
import styles from './index.module.less';

const parseJsonSafely = (str: string | undefined, fallback: any = null): any => {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
};

export default (props: {
  params: {
    arguments?: string; // input parameters
    output?: string; // output parameters
  };
}) => {
  const { params } = props;
  const inputIsJson = params.arguments
    ? parseJsonSafely(params.arguments) !== null
    : false;
  const outputIsJson = params.output
    ? parseJsonSafely(params.output) !== null
    : false;

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      Message.success(
        $i18n.get({
          id: 'main.components.SparkChat.components.Steps.Plugin.index.copySuccess',
          dm: '复制成功',
        }),
      );
    } catch (error) {
      Message.error(
        $i18n.get({
          id: 'main.components.SparkChat.components.Steps.Plugin.index.copyFailed',
          dm: '复制失败',
        }),
      );
    }
  };

  const formatJson = (str: string) => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  };

  return (
    <div className={styles.container}>
      {!!params.arguments?.length && (
        <Collapse bordered={false}>
          <Collapse.Item
            name="input"
            header={$i18n.get({
              id: 'main.components.SparkChat.components.Steps.Plugin.index.inputParameters',
              dm: '输入参数',
            })}
            extra={
              <IconFont
                type="spark-copy-line"
                style={{ fontSize: '16px' }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleCopy(params.arguments!);
                }}
              />
            }
          >
            <div style={{ maxHeight: 200, overflow: 'auto' }}>
              {inputIsJson ? (
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 13, margin: 0, padding: 12 }}>
                  <code>{formatJson(params.arguments!)}</code>
                </pre>
              ) : (
                <div className="p-[12px]">
                  <Markdown content={params.arguments || ''} />
                </div>
              )}
            </div>
          </Collapse.Item>
        </Collapse>
      )}
      {!!params.output?.length && (
        <Collapse bordered={false}>
          <Collapse.Item
            name="output"
            header={$i18n.get({
              id: 'main.components.SparkChat.components.Steps.Plugin.index.outputParameters',
              dm: '输出参数',
            })}
            extra={
              <IconFont
                type="spark-copy-line"
                style={{ fontSize: '16px' }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleCopy(params.output!);
                }}
              />
            }
          >
            <div style={{ maxHeight: 200, overflow: 'auto' }}>
              {outputIsJson ? (
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 13, margin: 0, padding: 12 }}>
                  <code>{formatJson(params.output!)}</code>
                </pre>
              ) : (
                <div className="p-[12px]">
                  <Markdown content={params.output || ''} />
                </div>
              )}
            </div>
          </Collapse.Item>
        </Collapse>
      )}
    </div>
  );
};
