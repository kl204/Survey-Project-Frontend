/** @jsxImportSource @emotion/react */

import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
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

  selectionText: css({
    fontSize: '0.8rem',
  }),

  controlBox: css({
    height: '25px',
  }),

  radioGroup: css({
    paddingTop: '10px',
  }),

  radio: css({
    '& svg': {
      width: '18px',
      height: '18px',
    },
    '&.Mui-checked': {
      color: '#3e3e3e',
    },
  }),
};

/**
 * 설문 미리보기 단일 선택형 문항을 나타내는 컴포넌트 입니다.
 *
 * @param question 단일 선택형 문항에 대한 객체
 * @component
 * @returns 단일 선택형 문항 미리보기
 * @author 강명관
 */
function PreviewSingleQuestion({ question }: PreviewEachQuestionProps) {
  return (
    <Card css={styles.questionBox}>
      <CardContent>
        {question.questionRequired && <RequiredQuestionText />}
        <FormControl component="fieldset">
          <FormLabel component="legend" css={styles.questionTitle}>
            {question.questionTitle ? question.questionTitle : '제목 없는 문항'}
          </FormLabel>

          <Typography variant="body1" css={styles.questionDescription}>
            {question.questionDescription}
          </Typography>

          <RadioGroup css={styles.radioGroup}>
            {question.selections.map((selection, index) => (
              <div key={selection.questionId}>
                <FormControlLabel
                  key={selection.selectionId}
                  value={index}
                  css={styles.controlBox}
                  control={<Radio css={styles.radio} />}
                  label={
                    <Typography variant="subtitle1" css={styles.selectionText}>
                      {selection.selectionValue
                        ? selection.selectionValue
                        : '제목 없는 선택지'}
                    </Typography>
                  }
                />
              </div>
            ))}
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
}

export default PreviewSingleQuestion;
