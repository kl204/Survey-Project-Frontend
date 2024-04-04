import {
  QuestionProps,
  SurveyInfoProps,
} from '../../creation/types/SurveyTypes';

export interface PreviewSurveyProps {
  surveyInfo: SurveyInfoProps;
  questions: QuestionProps[];
}

export interface PreviewSurveyInfoProps {
  surveyInfo: SurveyInfoProps;
}

export interface PreviewQuestionProps {
  questions: QuestionProps[];
}

export interface PreviewEachQuestionProps {
  question: QuestionProps;
}
