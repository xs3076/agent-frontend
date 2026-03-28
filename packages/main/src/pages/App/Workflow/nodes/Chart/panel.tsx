import { memo, useCallback, useMemo } from 'react';
import { Form, Input, InputNumber, Select, Collapse } from '@arco-design/web-react';
import {
  CustomInputsControl,
  CustomOutputsFormWrap,
  useNodeDataUpdate,
  useNodesOutputParams,
  useNodesReadOnly,
} from '@spark-ai/flow';
import { useWorkflowAppStore } from '../../context/WorkflowAppProvider';
import { IChartNodeData, IChartNodeParam } from '../../types';
import RetryForm from '../../components/RetryForm';
import ErrorCatchForm from '../../components/ErrorCatchForm';

const CHART_TYPE_OPTIONS = [
  { label: '柱状图', value: 'bar' },
  { label: '折线图', value: 'line' },
  { label: '饼图', value: 'pie' },
  { label: '散点图', value: 'scatter' },
  { label: '雷达图', value: 'radar' },
];

export default memo((props: { id: string; data: IChartNodeData }) => {
  const { handleNodeDataUpdate } = useNodeDataUpdate();
  const { getVariableList } = useNodesOutputParams();
  const globalVariableList = useWorkflowAppStore(
    (state) => state.globalVariableList,
  );
  const { nodesReadOnly } = useNodesReadOnly();

  const flowVariableList = useMemo(() => {
    return getVariableList(props.id);
  }, [getVariableList, props.id]);

  const variableList = useMemo(() => {
    return [...globalVariableList, ...flowVariableList];
  }, [globalVariableList, flowVariableList]);

  const changeNodeParam = useCallback(
    (payload: Partial<IChartNodeParam>) => {
      handleNodeDataUpdate({
        id: props.id,
        data: {
          node_param: { ...props.data.node_param, ...payload },
        },
      });
    },
    [props.id, props.data.node_param, handleNodeDataUpdate],
  );

  const changeDataMapping = useCallback(
    (payload: Partial<IChartNodeParam['data_mapping']>) => {
      changeNodeParam({
        data_mapping: { ...props.data.node_param.data_mapping, ...payload },
      });
    },
    [props.data.node_param.data_mapping, changeNodeParam],
  );

  const changeDisplay = useCallback(
    (payload: Partial<NonNullable<IChartNodeParam['display']>>) => {
      changeNodeParam({
        display: { ...(props.data.node_param.display || {}), ...payload },
      });
    },
    [props.data.node_param.display, changeNodeParam],
  );

  const isPie = props.data.node_param.chart_type === 'pie';

  return (
    <>
      <CustomInputsControl
        value={props.data.input_params}
        variableList={variableList}
        disabled={nodesReadOnly}
        onChange={(val) =>
          handleNodeDataUpdate({
            id: props.id,
            data: { input_params: val },
          })
        }
      />

      <Form layout="vertical" size="small">
        <Form.Item label="图表类型" required>
          <Select
            value={props.data.node_param.chart_type}
            options={CHART_TYPE_OPTIONS}
            disabled={nodesReadOnly}
            onChange={(val) => changeNodeParam({ chart_type: val })}
          />
        </Form.Item>

        <Form.Item label="数据来源字段" required>
          <Input
            value={props.data.node_param.data_mapping.source}
            disabled={nodesReadOnly}
            placeholder="输入参数中的数据来源 key，如 data"
            onChange={(value) => changeDataMapping({ source: value })}
          />
        </Form.Item>

        <Form.Item label={isPie ? '名称字段' : 'X轴字段'}>
          <Input
            value={props.data.node_param.data_mapping.x_field}
            disabled={nodesReadOnly}
            placeholder={isPie ? '如 name' : '如 month'}
            onChange={(value) => changeDataMapping({ x_field: value })}
          />
        </Form.Item>

        <Form.Item label={isPie ? '数值字段' : 'Y轴字段'} required>
          <Input
            value={props.data.node_param.data_mapping.y_field}
            disabled={nodesReadOnly}
            placeholder="如 sales，多个用逗号分隔"
            onChange={(value) => changeDataMapping({ y_field: value })}
          />
        </Form.Item>

        {!isPie && (
          <Form.Item label="分组字段">
            <Input
              value={props.data.node_param.data_mapping.series_field}
              disabled={nodesReadOnly}
              placeholder="可选，如 category"
              onChange={(value) => changeDataMapping({ series_field: value })
              }
            />
          </Form.Item>
        )}

        <Form.Item label="图表标题">
          <Input
            value={props.data.node_param.display?.title}
            disabled={nodesReadOnly}
            placeholder="可选"
            onChange={(value) => changeDisplay({ title: value })}
          />
        </Form.Item>

        <Form.Item label="高度 (px)">
          <InputNumber
            value={props.data.node_param.display?.height || 400}
            min={100}
            max={1200}
            disabled={nodesReadOnly}
            onChange={(val) => changeDisplay({ height: val || 400 })}
          />
        </Form.Item>

        <Collapse
          size="small"
          items={[
            {
              key: 'advanced',
              label: '高级配置',
              children: (
                <Form.Item label="ECharts Option 覆盖 (JSON)">
                  <Input.TextArea
                    value={
                      props.data.node_param.option_override
                        ? JSON.stringify(
                            props.data.node_param.option_override,
                            null,
                            2,
                          )
                        : ''
                    }
                    disabled={nodesReadOnly}
                    rows={4}
                    placeholder='{"legend":{"show":true}}'
                    onChange={(value) => {
                      try {
                        const parsed = value
                          ? JSON.parse(e.target.value)
                          : {};
                        changeNodeParam({ option_override: parsed });
                      } catch {
                        // Ignore parse errors while typing
                      }
                    }}
                  />
                </Form.Item>
              ),
            },
          ]}
        />
      </Form>

      <CustomOutputsFormWrap
        value={props.data.output_params}
        disabled={nodesReadOnly}
        onChange={(val) =>
          handleNodeDataUpdate({
            id: props.id,
            data: { output_params: val },
          })
        }
      />

      <div className="spark-flow-panel-form-section">
        <RetryForm
          value={props.data.node_param.retry_config}
          disabled={nodesReadOnly}
          onChange={(val) => changeNodeParam({ retry_config: val })}
        />
      </div>
      <div className="spark-flow-panel-form-section">
        <ErrorCatchForm
          nodeId={props.id}
          value={props.data.node_param.try_catch_config}
          disabled={nodesReadOnly}
          onChange={(val) => changeNodeParam({ try_catch_config: val })}
        />
      </div>
    </>
  );
});
