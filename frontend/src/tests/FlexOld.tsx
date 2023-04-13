import React, { CSSProperties } from 'react';

interface Props extends CSSProperties {
  FlexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  backgroundColor?: string;
  children?: JSX.Element;
}
interface CSSStyles extends Omit<Props, 'children'> {
  children: undefined;
}

function Flex(flexStyles: Props): JSX.Element {
  const { children } = flexStyles;
  delete flexStyles['children'];

  const styles: CSSStyles = {
    width: '100%',
    height: '100%',
    display: 'flex',
    ...flexStyles,
  };

  console.log(styles);
  return (
    <>
      <div style={styles}>{children}</div>
    </>
  );
}

export default Flex;
