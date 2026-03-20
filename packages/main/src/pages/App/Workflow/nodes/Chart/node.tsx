import type { IWorkFlowNode, NodeProps } from '@spark-ai/flow';
import { BaseNode } from '@spark-ai/flow';
import { memo } from 'react';
import { IChartNodeParam } from '../../types';

export default memo(function Chart(props: NodeProps<IWorkFlowNode>) {
  return (
    <BaseNode
      hasFailBranch={
        (props.data.node_param as IChartNodeParam).try_catch_config
          .strategy === 'failBranch'
      }
      {...props}
    ></BaseNode>
  );
});
