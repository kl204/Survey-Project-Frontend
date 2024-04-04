/** @jsxImportSource @emotion/react */

import { Box, Typography } from '@mui/material';
import React from 'react';
import { css } from '@emotion/react';
import { PreviewSurveyInfoProps } from '../types/PreviewSurveyTypes';

const styles = {
  surveyTitleBox: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25px',
    marginTop: '30px',
  }),

  surveyInfoTitileStyle: css({
    fontWeight: 'bold',
    fontSize: '25px',
    marginBottom: '10px',
  }),
};

/**
 * 설문 작성 중 미리보기에서 설문의 정보를 보여주는 컴포넌트 입니다.
 *
 * @param surveyInfo 설문에 대한 정보를 담고 있는 객체
 * @param surveyImage 설문에 대한 대표 이미지 File
 * @returns 미리보기 설문 정보
 * @component
 * @author 강명관
 */
function PreviewSurveyInfo({ surveyInfo }: PreviewSurveyInfoProps) {
  return (
    <Box css={styles.surveyTitleBox}>
      <Typography css={styles.surveyInfoTitileStyle}>
        {surveyInfo.surveyTitle ? surveyInfo.surveyTitle : '제목 없는 설문지'}
      </Typography>
    </Box>
  );
}

export default PreviewSurveyInfo;
