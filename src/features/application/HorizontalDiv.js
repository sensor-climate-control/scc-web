/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const HorizontalDiv = (props) => {
    const horizontal = css`
        display: inline-flex;
        flex-direction: row;
        margin-left: 20px;
    `;

    return(
        <div css={horizontal}>
            {props.children}
        </div>
    )
}
export default HorizontalDiv;