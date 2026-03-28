import $i18n from '@/i18n';
import { getPluginToolList } from '@/services/plugin';
import { Plugin, PluginTool } from '@/types/plugin';
import IconFont from '@/components/ui/IconFont';
import { Checkbox, Tooltip, Typography } from '@arco-design/web-react';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';

interface IProps {
  item: Plugin;
  onSelectTool?: (item: PluginTool) => void;
  onRemoveTool?: (tool: PluginTool) => void;
  selectedTools?: PluginTool[];
  fetchList?: () => void;
}

export default (props: IProps) => {
  const { item, selectedTools } = props;
  const [toolsList, setToolsList] = useState<PluginTool[]>([]);
  const [pluginSelected, setPluginSelected] = useState<boolean>(false);
  const [folded, setFolded] = useState<boolean>(true);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const toolsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!item.plugin_id) return;
    getPluginToolList(item.plugin_id).then((res) => {
      setToolsList(res.data.records);
    });
  }, [item]);
  useEffect(() => {
    setPluginSelected(
      !!selectedTools?.find((tool) => tool.plugin_id === item.plugin_id),
    );
  }, [item, selectedTools]);

  useEffect(() => {
    if (pluginSelected) {
      setFolded(false);
    }
  }, [pluginSelected]);

  useEffect(() => {
    if (toolsContainerRef.current) {
      setMaxHeight(folded ? 0 : toolsContainerRef.current.scrollHeight);
    }
  }, [folded]);

  const toggleFold = () => {
    setFolded(!folded);
  };

  return (
    <div>
      <div
        className={classNames(styles['plugin-list-wrapper'], {
          [styles.expanded]: !folded,
        })}
        style={{ padding: '12px 16px' }}
      >
        <div className="flex gap-[8px]">
          <div className="flex gap-[8px] w-full h-[52px] flex-1 items-center">
            <div className="flex items-center h-[40px] w-[40px]">
              <div
                className={classNames(
                  'flex items-center justify-center h-[40px] w-[40px] rounded-[6px]',
                  styles['check-item'],
                )}
                style={{
                  border: '1px solid var(--color-border-2)',
                }}
              >
                <img src={'/images/plugin.svg'} alt="" />
              </div>
            </div>
            <div style={{ width: 'calc(100% - 48px)' }}>
              <div className="flex justify-between header leading-[22px] h-[22px]">
                <div
                  className="text-[16px] font-semibold mr-[4px]"
                  style={{
                    color: 'var(--color-text-1)',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: 0,
                    flex: 1,
                  }}
                >
                  {item.name}
                </div>
                <div className="flex" style={{ color: 'var(--color-text-1)' }}>
                  {!!toolsList?.length && (
                    <span
                      className="mr-[4px] cursor-pointer"
                      onClick={toggleFold}
                    >
                      {$i18n.get({
                        id: 'main.pages.App.components.PluginSelector.PluginListItem.index.tool',
                        dm: '工具',
                      })}

                      {toolsList.length}
                    </span>
                  )}
                  {
                    <IconFont
                      type={'spark-down-line'}
                      className={`cursor-pointer ${styles['fold-icon']} ${
                        folded ? '' : styles.rotated
                      }`}
                      onClick={toggleFold}
                    />
                  }
                </div>
              </div>
              <Tooltip content={item.description}>
                <Typography.Paragraph
                  className={styles.desc}
                  style={{ marginBottom: 0 }}
                  ellipsis={{ rows: 1 }}
                >
                  {item.description}
                </Typography.Paragraph>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      {!folded && !!toolsList?.length && (
        <div
          ref={toolsContainerRef}
          className={`${styles['tools-container']}`}
          style={{
            borderTop: 'none',
            padding: '8px 12px',
            maxHeight: `${maxHeight}px`,
            overflow: 'hidden',
            display: folded ? 'none' : 'block',
          }}
        >
          {
            <div className="flex flex-col gap-[9px]" style={{ marginLeft: 20 }}>
              {toolsList.map((tool) => (
                <div
                  className="flex h-[60px] flex-1 rounded-[6px] items-center"
                  key={tool.tool_id}
                >
                  <div className="flex gap-[8px] flex-1">
                    <Checkbox
                      checked={
                        !!selectedTools?.find((t) => t.tool_id === tool.tool_id)
                      }
                      onChange={(checked) => {
                        if (checked) {
                          props.onSelectTool?.(tool);
                        } else {
                          props.onRemoveTool?.(tool);
                        }
                      }}
                      disabled={!tool.enabled}
                    />
                    <div
                      className="flex flex-col flex-1 gap-[8px] h-[72px] rounded-[6px]"
                      style={{
                        border:
                          '1px solid var(--color-border-2)',
                        padding: '8px 12px',
                      }}
                    >
                      <div className="flex items-center gap-[12px] h-[28px]">
                        <div
                          className="text-[16px] font-semibold leading-6"
                          style={{ color: 'var(--color-text-1)' }}
                        >
                          <Tooltip content={tool.name}>
                            <Typography.Paragraph
                              className={styles.desc}
                              style={{ marginBottom: 0, marginTop: 0 }}
                              ellipsis={{ rows: 1 }}
                            >
                              {tool.name}
                            </Typography.Paragraph>
                          </Tooltip>
                        </div>
                      </div>
                      <Tooltip content={tool.description}>
                        <Typography.Paragraph
                          className={styles.desc}
                          style={{ marginBottom: 0, marginTop: 0 }}
                          ellipsis={{ rows: 1 }}
                        >
                          {tool.description}
                        </Typography.Paragraph>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  );
};
