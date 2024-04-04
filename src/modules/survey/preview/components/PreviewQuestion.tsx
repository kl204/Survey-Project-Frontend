import React from 'react';
import { QuestionTypeEnum } from '../../enums/QuestionTypeEnum';
import { PreviewQuestionProps } from '../types/PreviewSurveyTypes';
import PreviewMultipleQuestion from './PreviewMultipleQuestion';
import PreviewShortQuestion from './PreviewShortQuestion';
import PreviewSingleQuestion from './PreviewSingleQuestion';
import PreviewSubjectiveDescriptionQuestion from './PreviewSubjectiveDescriptionQuestion';

function PreviewQuestion({ questions }: PreviewQuestionProps) {
  return (
    <div>
      {questions.map((question) => {
        switch (question.questionType) {
          case QuestionTypeEnum.SINGLE_QUESTION:
          case QuestionTypeEnum.MOVEABLE_QUESTION:
            return (
              <PreviewSingleQuestion
                key={question.questionId}
                question={question}
              />
            );
          case QuestionTypeEnum.SHORT_ANSWER:
            return (
              <PreviewShortQuestion
                key={question.questionId}
                question={question}
              />
            );
          case QuestionTypeEnum.MULTIPLE_QUESTION:
            return (
              <PreviewMultipleQuestion
                key={question.questionId}
                question={question}
              />
            );
          case QuestionTypeEnum.SUBJECTIVE_DESCRIPTIVE_ANSWER:
            return (
              <PreviewSubjectiveDescriptionQuestion
                key={question.questionId}
                question={question}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default PreviewQuestion;
