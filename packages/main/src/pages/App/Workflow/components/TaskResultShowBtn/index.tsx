import $i18n from '@/i18n';
import IconButton from '@/components/ui/IconButton';
import IconFont from '@/components/ui/IconFont';
import { Tooltip } from '@arco-design/web-react';
import { useStore } from '@spark-ai/flow';

import { memo } from 'react';

export default memo(function TaskResultShowBtn() {
  const taskStore = useStore((store) => store.taskStore);
  const showResults = useStore((store) => store.showResults);
  const setShowResults = useStore((store) => store.setShowResults);
  if (!taskStore || showResults) return null;
  return (
    <Tooltip
      content={$i18n.get({
        id: 'main.pages.App.Workflow.components.TaskResultShowBtn.index.showTestResult',
        dm: '展示测试结果',
      })}
    >
      <IconButton
        icon={<IconFont type="spark-visable-line" />}
        onClick={() => {
          setShowResults(true);
        }}
      />
    </Tooltip>
  );
});
