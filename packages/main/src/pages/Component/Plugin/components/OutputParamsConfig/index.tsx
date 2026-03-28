import $i18n from '@/i18n';
import { Button, Input, Select } from '@arco-design/web-react';
import IconButton from '@/components/ui/IconButton';

import { useMemo, useState } from 'react';
import { RightExpandBtn } from '../ExpandBtn';
import { IValueType } from '../InputParamsConfig';
import styles from './index.module.less';

const VALUE_TYPE_OPTS = [
  'Array<Object>',
  'Array<String>',
  'Array<Number>',
  'Array<Boolean>',
  'Object',
  'String',
  'Number',
  'Boolean',
].map((item) => ({ label: item, value: item }));

const DEFAULT_ROW_DATA: IOutputParamItem = {
  key: void 0,
  type: 'String',
  desc: void 0,
};

export interface IOutputParamItem {
  key?: string;
  type?: IValueType;
  desc?: string;
  properties?: Array<IOutputParamItem>;
}

interface IItemProps {
  paramItem: IOutputParamItem;
  onChange: (val: IOutputParamItem) => void;
  showLine?: boolean;
  order?: number;
  handleRemove: () => void;
  list: IOutputParamItem[];
  index: number;
  hasProperties?: boolean;
}

function OutputParamItemComp({
  paramItem,
  onChange,
  showLine,
  order = 0,
  handleRemove,
  list,
  index: curIndex,
  hasProperties: bizHasProperties,
}: IItemProps) {
  const [descErrorTip, setDescErrorTip] = useState('');
  const [expand, setExpand] = useState(true);
  const [errorTip, setErrorTip] = useState('');
  const [fresh, setFresh] = useState(0);
  const hasProperties = useMemo(() => {
    return ['Object', 'Array<Object>'].includes(paramItem.type || '');
  }, [paramItem.type]);

  const hasChildren = useMemo(() => {
    return hasProperties && !!paramItem.properties?.length;
  }, [paramItem, hasProperties]);

  const changeRowItem = (payload: Partial<IOutputParamItem>) => {
    onChange({
      ...paramItem,
      ...payload,
    });
  };

  const handleChange = (newPropertyItem: IOutputParamItem, tIndex: number) => {
    changeRowItem({
      properties: (paramItem.properties || [])?.map((item, index) => {
        if (index === tIndex) return { ...item, ...newPropertyItem };
        return item;
      }),
    });
  };

  const handleAddRowItem = () => {
    changeRowItem({
      properties: [...(paramItem.properties || []), DEFAULT_ROW_DATA],
    });
  };

  const deleteItem = (ind: number) => {
    changeRowItem({
      properties: paramItem.properties?.filter((_, index) => index !== ind),
    });
    const timer = setTimeout(() => {
      setFresh(new Date().valueOf());
      clearTimeout(timer);
    }, 100);
  };

  const handleCheckKey = () => {
    if (!paramItem.key?.trim()) {
      setErrorTip(
        $i18n.get({
          id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.parameterNameCannotBeEmpty',
          dm: '参数名不能为空',
        }),
      );
      return;
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(paramItem.key)) {
      setErrorTip(
        $i18n.get({
          id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.parameterNameOnlyLettersNumbersOrUnderscoresAndStartWithLetterOrUnderscore',
          dm: '参数名称只能包含字母、数字或下划线，并且以字母或下划线开头',
        }),
      );
      return;
    }
    if (
      list.some((item, index) => {
        if (index === curIndex) return false;
        return item.key === paramItem.key;
      })
    ) {
      setErrorTip(
        $i18n.get({
          id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.parameterNameCannotBeDuplicate',
          dm: '参数名称不能重复',
        }),
      );
      return;
    }
    setErrorTip('');
  };

  const handleCheckDesc = () => {
    if (!paramItem.desc?.trim()) {
      setDescErrorTip(
        $i18n.get({
          id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.parameterExplanationCannotBeEmpty',
          dm: '参数解释不能为空',
        }),
      );
      return;
    }
    setDescErrorTip('');
  };

  return (
    <>
      <div>
        <div className={`flex items-start gap-2 ${styles.item}`}>
          {hasChildren ? (
            <RightExpandBtn expand={expand} setExpand={setExpand} />
          ) : (
            bizHasProperties && <div className={styles.placeholder}></div>
          )}
          <div className="flex flex-col">
            <Input
              status={errorTip ? 'error' : void 0}
              onBlur={handleCheckKey}
              onChange={(e) => {
                changeRowItem({ key: e.target.value });
              }}
              defaultValue={paramItem.key}
              placeholder={$i18n.get({
                id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.enterParameterName',
                dm: '请输入参数名称',
              })}
            />

            {errorTip && (
              <span className={styles['error-tip']}>{errorTip}</span>
            )}
          </div>

          <div className="flex flex-col">
            <Input
              onChange={(e) => changeRowItem({ desc: e.target.value })}
              defaultValue={paramItem.desc}
              style={{ width: 217 }}
              placeholder={$i18n.get({
                id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.enterParameterExplanation',
                dm: '请输入参数解释',
              })}
              status={descErrorTip ? 'error' : void 0}
              onBlur={handleCheckDesc}
            />

            {descErrorTip && (
              <span className={styles['error-tip']} style={{ width: 409 }}>
                {descErrorTip}
              </span>
            )}
          </div>

          <Select
            onChange={(val) => changeRowItem({ type: val })}
            options={VALUE_TYPE_OPTS}
            defaultValue={paramItem.type}
            style={{ width: 140 }}
            placeholder={$i18n.get({
              id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.selectType',
              dm: '选择类型',
            })}
          />

          <div className="flex gap-2">
            {hasProperties && (
              <IconButton
                onClick={handleAddRowItem}
                icon="spark-plus-line"
                shape="circle"
              />
            )}
            <IconButton
              onClick={handleRemove}
              icon="spark-delete-line"
              bordered={false}
              shape="circle"
            />
          </div>
        </div>
      </div>
      {hasProperties &&
        expand &&
        paramItem.properties?.map((item, index) => (
          <OutputParamItemComp
            order={order + 1}
            index={index}
            list={paramItem.properties || []}
            handleRemove={() => deleteItem(index)}
            onChange={(payload) => handleChange(payload, index)}
            key={`${fresh}_${index}`}
            paramItem={item}
            showLine
          />
        ))}
    </>
  );
}

export default function OutputParamsConfig({
  params = [] as IOutputParamItem[],
  onChange = (_: any) => {},
}) {
  const [fresh, setFresh] = useState(0);
  const handleChangeItem = (item: IOutputParamItem, index: number) => {
    onChange(
      params.map((vItem, vIndex) => {
        if (vIndex === index) return item;
        return vItem;
      }),
    );
  };

  const addRow = () => {
    onChange([...params, DEFAULT_ROW_DATA]);
  };

  const deleteItem = (ind: number) => {
    onChange(params.filter((_, index) => index !== ind));
    const timer = setTimeout(() => {
      setFresh(new Date().valueOf());
      clearTimeout(timer);
    }, 100);
  };

  const hasProperties = useMemo(() => {
    return params.some((item) => !!item.properties?.length);
  }, [params]);

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex gap-3 ${styles.label}`}>
        {hasProperties && <div className={styles.placeholder}></div>}
        <div className={styles.label} style={{ flex: 1 }}>
          {$i18n.get({
            id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.parameterName',
            dm: '参数名称',
          })}
        </div>
        <div className={styles.label} style={{ width: 217 }}>
          {$i18n.get({
            id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.parameterDescription',
            dm: '参数描述',
          })}
        </div>
        <div className={styles.label} style={{ width: 140 }}>
          {$i18n.get({
            id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.type',
            dm: '类型',
          })}
        </div>
        <div style={{ width: 36 }}></div>
      </div>
      {params.map((item, index) => (
        <OutputParamItemComp
          hasProperties={hasProperties}
          handleRemove={() => deleteItem(index)}
          paramItem={item}
          list={params}
          key={`${fresh}_${index}`}
          index={index}
          onChange={(payload) => handleChangeItem(payload, index)}
        />
      ))}
      <Button
        className={'justify-start'}
        iconType="spark-plus-line"
        type="link"
        size="small"
        onClick={addRow}
      >
        {$i18n.get({
          id: 'main.pages.Component.Plugin.components.OutputParamsConfig.index.addOutputParameter',
          dm: '增加出参',
        })}
      </Button>
    </div>
  );
}
