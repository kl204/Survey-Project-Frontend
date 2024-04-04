/** @jsxImportSource @emotion/react */

import { Box, TextField } from '@mui/material';
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
 * 주관식 서술형 문항을 만드는 컴포넌트 입니다.
 *
 * @component
 * @returns 주관식 선택지 문항
 * @author 강명관
 */
function CreateSubjectiveDescriptive() {
  return (
    <Box css={styles.questionBox}>
      <Box css={styles.textBox} />
      <TextField
        disabled
        multiline
        rows={5}
        defaultValue="문항 답변 입력란"
        css={[styles.inputBox, textStyle]}
      />
    </Box>
  );
}

export default CreateSubjectiveDescriptive;
