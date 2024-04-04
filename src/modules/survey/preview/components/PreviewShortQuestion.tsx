/** @jsxImportSource @emotion/react */

import { Card, CardContent, TextField } from '@mui/material';
import React from 'react';
import { css } from '@emotion/react';
import { PreviewEachQuestionProps } from '../types/PreviewSurveyTypes';
import RequiredQuestionText from './RequiredQuestionText';

const styles = {
  questionBox: css({
    marginBottom: '30px',
  }),

  questionTitle: css({
    fontSize: '1rem',
    fontWeight: '600',
    color: 'black',
    marginBottom: '10px',

    '&.Mui-focused': {
      color: '#3e3e3e',
    },
  }),

  questionDescription: css({
    fontSize: '0.9rem',
  }),

  answerInput: css({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'lightgray',
      },
      '&:hover fieldset': {
        borderColor: 'gray',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#3e3e3e',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#3e3e3e',
    },
  }),
};

/**
 * 설문 미리보기에서 주관식 단단형 문항을 담당하는 컴포넌트입니다.
 *
 * @param question 주관식 단답형 문항 객체
 * @returns 주관식 단답형 문항 미리보기
 * @component
 * @author 강명관
 */
function PreviewShortQuestion({ question }: PreviewEachQuestionProps) {
  return (
    <Card css={styles.questionBox}>
      <CardContent>
        {question.questionRequired && <RequiredQuestionText />}
        <p css={styles.questionTitle}>
          {question.questionTitle ? question.questionTitle : '제목 없는 문항'}
        </p>

        {question.questionDescription && (
          <p css={styles.questionDescription}>{question.questionDescription}</p>
        )}

        <TextField
          placeholder="답변 입력란 (최대 100자)"
          variant="outlined"
          fullWidth
          multiline
          maxRows={4}
          css={styles.answerInput}
        />
      </CardContent>
    </Card>
  );
}

export default PreviewShortQuestion;
