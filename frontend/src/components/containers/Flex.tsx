import React from 'react';
import { Property } from 'csstype';

type Props = {
  children: JSX.Element | JSX.Element[];
  section?: boolean;
  sectionId?: string;
  additionalStyles?: string;
  styles?: {
    height?: Property.Height;
    flexDirection?: Property.FlexDirection;
    justifyContent?: Property.JustifyContent;
    alignItems?: Property.AlignItems;
    backgroundColor?: Property.BackgroundColor;
  };
};

function Flex(containerOptions: Props): JSX.Element {
  const styles = {
    width: '100%',
    height: '100%',
    display: 'flex',
    ...containerOptions.styles,
  };

  let html;
  if (containerOptions.section) {
    html = (
      <section
        id={containerOptions.sectionId}
        style={styles}
        className={containerOptions.additionalStyles}
      >
        {containerOptions.children}
      </section>
    );
  } else {
    html = (
      <div style={styles} className={containerOptions.additionalStyles}>
        {containerOptions.children}
      </div>
    );
  }

  return <>{html}</>;
}

export default Flex;
