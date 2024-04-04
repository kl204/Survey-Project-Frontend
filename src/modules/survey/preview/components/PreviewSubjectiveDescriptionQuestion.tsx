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
 * 설문 미리보기 주관식 서술형 문항을 나타내는 컴포넌트 입니다.
 *
 * @param question 주관식 서술형 문항 객체
 * @returns 주관식 서술형 문항
 * @component
 * @author 강명관
 */
function PreviewSubjectiveDescriptionQuestion({
  question,
}: PreviewEachQuestionProps) {
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
          placeholder="답변 입력란"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          css={styles.answerInput}
        />
      </CardContent>
    </Card>
  );
}

export default PreviewSubjectiveDescriptionQuestion;
