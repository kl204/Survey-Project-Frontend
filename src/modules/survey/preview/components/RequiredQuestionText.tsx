/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react';
import { Typography } from '@mui/material';

const styles = {
  requiredText: css({
    fontSize: '9px',
    display: 'flex',
    justifyContent: 'flex-end',
    height: '15px',
    color: 'red',
    margin: '0',
    padding: '0',
  }),
};

export default function RequiredQuestionText() {
  return (
    <Typography css={styles.requiredText}>* 필수 응답 문항입니다.</Typography>
  );
}
