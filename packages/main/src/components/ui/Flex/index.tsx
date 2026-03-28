import React, { CSSProperties, forwardRef } from 'react';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  wrap?: boolean | string;
  justify?: CSSProperties['justifyContent'];
  align?: CSSProperties['alignItems'];
  flex?: CSSProperties['flex'];
  gap?: number | string;
  component?: string;
}

const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  const {
    vertical,
    wrap,
    justify,
    align,
    flex,
    gap,
    component,
    style,
    className,
    children,
    ...rest
  } = props;

  const mergedStyle: CSSProperties = {
    display: 'flex',
    flexDirection: vertical ? 'column' : undefined,
    flexWrap: wrap ? (typeof wrap === 'string' ? (wrap as CSSProperties['flexWrap']) : 'wrap') : undefined,
    justifyContent: justify,
    alignItems: align,
    flex,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    ...style,
  };

  return React.createElement(
    component || 'div',
    { ref, style: mergedStyle, className, ...rest },
    children,
  );
});

Flex.displayName = 'Flex';

export default Flex;
