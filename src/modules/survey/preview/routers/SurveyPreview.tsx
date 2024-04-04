/** @jsxImportSource @emotion/react */

import { Container } from '@mui/material';
import React from 'react';
import { css } from '@emotion/react';
import PreviewQuestion from '../components/PreviewQuestion';
import PreviewSurveyInfo from '../components/PreviewSurveyInfo';
import { PreviewSurveyProps } from '../types/PreviewSurveyTypes';

const styles = {
  container: css({
    paddingLeft: '5px',
    paddingRight: '5px',
  }),
};

/**
 * 설문 작성 중 미리보기 페이지를 담당하는 컴포넌트 입니다.
 *
 * @param surveyInfo 설문에 대한 정보를 담은 객체
 * @param surveyImage 설문에 대한 대표 이미지 File 객체
 * @param questions 설문에 대한 문항들
 * @returns 설문 미리보기
 * @author 강명관
 */
function SurveyPreview({ surveyInfo, questions }: PreviewSurveyProps) {
  return (
    <Container maxWidth="md" css={styles.container}>
      <PreviewSurveyInfo surveyInfo={surveyInfo} />
      <PreviewQuestion questions={questions} />
    </Container>
  );
}

export default SurveyPreview;
