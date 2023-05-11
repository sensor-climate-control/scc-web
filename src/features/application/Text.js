/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

function Text (props) {
    const styles = css`
      color: ${props.color};
      padding-left: 0.25vw;
      padding-right: 0.25vw;
      margin-top: ${props.marg ? props.marg : "0.25vh"};
      margin-bottom: ${props.marg ? props.marg : "0.25vh"};
    `;
    return (
      <p css={styles}>{props.children}</p>
    )
  
}
export default Text;