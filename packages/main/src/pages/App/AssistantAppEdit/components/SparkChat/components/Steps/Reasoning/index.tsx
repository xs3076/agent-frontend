import Markdown from '@/components/ui/Markdown';

export default (props: { reasoning: string }) => {
  return <Markdown content={props.reasoning || ''} />;
};
