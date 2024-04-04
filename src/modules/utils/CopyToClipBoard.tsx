/** @jsxImportSource @emotion/react */

import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { css } from '@emotion/react';
import CheckIcon from '@mui/icons-material/Check';

const fontFamily = 'GmarketSansMedium';

const styles = {
  copyBox: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '270px',
  }),

  copyInput: css({
    marginRight: '20px',
    outline: 'none',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'rgba(90, 101, 118, 0.09)',
    border: '1px solid rgba(90, 101, 119, 0.24)',
    padding: '0px 16px',
  }),

  copyCheckButton: css({
    width: '80px',
    borderRadius: '8px',
    color: '#ffffff',
    border: '1px solid',
    backgroundColor: '#747474',
    fontWeight: 'bold',
    fontFamily,
    fontSize: '14px',
    boxSizing: 'border-box',

    '&:hover': {
      backgroundColor: '#3e3e3e',
    },
  }),

  textStyle: css({
    fontFamily,
    color: '#464646',
    padding: '7px 7px 7px 3px',
  }),

  checkIcon: css({
    fontSize: '18px',
    marginRight: '5px',
  }),
};

interface CopyToClipBoardProps {
  copyText: string;
}

const handleCopyToClipBoard = async (copyText: string) => {
  try {
    await navigator.clipboard.writeText(copyText);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

/**
 * 공유하기 박스에서 사용되는 복사를 담당하는 컴포넌트 입니다.
 *
 * @component
 * @param {@see SNSSharingParams} 공유하기 제목과 URL 입니다.
 * @returns 복사하기 기능
 * @author 강명관
 */
export default function CopyToClipBoard({ copyText }: CopyToClipBoardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = async () => {
    const success = await handleCopyToClipBoard(copyText);

    if (success) {
      setCopied(true);
    } else {
      setCopied(false);
      console.error('copy error');
    }
  };

  return (
    <Box>
      <Typography css={styles.textStyle}>설문 공유하기</Typography>
      <Box css={styles.copyBox}>
        <input value={copyText} readOnly css={styles.copyInput} />

        {!copied && (
          <Button onClick={handleCopyClick} css={styles.copyCheckButton}>
            복사
          </Button>
        )}
        {copied && (
          <Button css={styles.copyCheckButton}>
            <CheckIcon onClick={handleCopyClick} css={styles.checkIcon} />
            완료
          </Button>
        )}
      </Box>
    </Box>
  );
}
