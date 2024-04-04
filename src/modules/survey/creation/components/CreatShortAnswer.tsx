/** @jsxImportSource @emotion/react */

import { Box, Input } from '@mui/material';
import React from 'react';
import { css } from '@emotion/react';

const styles = {
  questionBox: css({
    display: 'flex',
    justifyContent: 'center',
  }),

  textBox: css({
    width: '60.56px',
    marginRight: '10px',
  }),

  inputBox: css({
    flexGrow: '1',
    marginTop: '15px',
  }),
};

const fontFamily = 'nanumsquare';
const textStyle = css({
  fontFamily,
});

/**
 * 주관식 단단형 문항을 만드는 컴포넌트 입니다.
 *
 * @component
 * @returns 주관식 단답형
 * @author 강명관
 */
function CreateShortAnswer() {
  return (
    <Box css={styles.questionBox}>
      <Box css={styles.textBox} />
      <Input
        disabled
        defaultValue="문항 답변 입력란"
        css={[styles.inputBox, textStyle]}
      />
    </Box>
  );
}

export default CreateShortAnswer;
