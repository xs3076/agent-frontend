import $i18n from '@/i18n';
import { IValueType } from '@spark-ai/flow';
import { Input } from '@arco-design/web-react';
import styles from './index.module.less';

export interface IOutputParamItem {
  field: string;
  type: IValueType;
  description: string;
}

interface IProps {
  output: IOutputParamItem[];
}

export default function OutputParamsComp(props: IProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`flex gap-2 ${styles['key-label']}`}>
        <span className="flex-1">
          {$i18n.get({
            id: 'main.pages.Component.AppComponent.components.OutputParamsComp.index.parameterName',
            dm: '参数名称',
          })}
        </span>
        <span className="flex-1">
          {$i18n.get({
            id: 'main.pages.Component.AppComponent.components.OutputParamsComp.index.parameterType',
            dm: '参数类型',
          })}
        </span>
      </div>
      {props.output.map((item, index) => (
        <div className="flex gap-2">
          <Input className="flex-1" value={item.field} disabled />
          <Input className="flex-1" value={item.type} disabled />
        </div>
      ))}
    </div>
  );
}
