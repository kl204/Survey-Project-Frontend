/** @jsxImportSource @emotion/react */

import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
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

  checkBox: css({
    '& svg': {
      width: '18px',
      height: '18px',
    },
    '&.Mui-checked': {
      color: '#3e3e3e',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  }),
};

function PreviewMultipleQuestion({ question }: PreviewEachQuestionProps) {
  return (
    <Card css={styles.questionBox}>
      <CardContent>
        {question.questionRequired && <RequiredQuestionText />}
        <FormControl component="fieldset">
          <FormLabel component="legend" css={styles.questionTitle}>
            {question.questionTitle ? question.questionTitle : '제목 없는 문항'}
          </FormLabel>

          {question.questionDescription && (
            <p css={styles.questionDescription}>
              {question.questionDescription}
            </p>
          )}

          <RadioGroup>
            {question.selections.map((selection, index) => (
              <FormControlLabel
                key={selection.selectionId}
                value={index}
                control={<Checkbox css={styles.checkBox} />}
                label={
                  <Typography variant="subtitle1" css={styles.selectionText}>
                    {selection.selectionValue
                      ? selection.selectionValue
                      : '제목 없는 선택지'}
                  </Typography>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
}

export default PreviewMultipleQuestion;
