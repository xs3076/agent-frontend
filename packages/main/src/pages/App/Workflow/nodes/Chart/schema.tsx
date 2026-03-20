import { INodeSchema } from '@spark-ai/flow';
import {
  RETRY_CONFIG_DEFAULT,
  TRY_CATCH_CONFIG_DEFAULT,
} from '../../constant';
import { IChartNodeData, IChartNodeParam } from '../../types';
import { checkInputParams, transformInputParams } from '../../utils';

const getChartRefVariables = (data: IChartNodeData) => {
  const variableKeyMap: Record<string, boolean> = {};
  transformInputParams(data.input_params, variableKeyMap);
  return Object.keys(variableKeyMap);
};

const checkChartNodeValid = (data: IChartNodeData) => {
  const errMsgs: { label: string; error: string }[] = [];
  checkInputParams(data.input_params, errMsgs);

  if (!data.node_param.chart_type) {
    errMsgs.push({ label: '图表类型', error: '不能为空' });
  }
  if (!data.node_param.data_mapping?.source) {
    errMsgs.push({ label: '数据来源', error: '不能为空' });
  }
  if (!data.node_param.data_mapping?.y_field) {
    errMsgs.push({ label: 'Y轴字段', error: '不能为空' });
  }
  return errMsgs;
};

export const ChartSchema: INodeSchema = {
  type: 'Chart',
  title: '图表',
  desc: '将数据可视化为 ECharts 图表（柱状图、折线图、饼图等）。',
  iconType: 'spark-bar-chart-line',
  groupLabel: '输出',
  defaultParams: {
    input_params: [
      { key: 'data', type: 'Array<Object>', value_from: 'refer', value: '' },
    ],
    output_params: [
      { key: 'chartOption', type: 'Object', desc: 'ECharts option 对象' },
    ],
    node_param: {
      chart_type: 'bar',
      data_mapping: {
        source: 'data',
        x_field: '',
        y_field: '',
        series_field: '',
      },
      option_override: {},
      display: {
        title: '',
        width: '100%',
        height: 400,
      },
      retry_config: RETRY_CONFIG_DEFAULT,
      try_catch_config: TRY_CATCH_CONFIG_DEFAULT,
    } as IChartNodeParam,
  },
  isSystem: false,
  allowSingleTest: false,
  bgColor: 'var(--ag-ant-color-cyan-hover)',
  getRefVariables: (val) => getChartRefVariables(val as IChartNodeData),
  checkValid: (data) => checkChartNodeValid(data as IChartNodeData),
};
