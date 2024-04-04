import React from 'react';

export interface SurveyInfoProps {
  surveyId: number;
  surveyInfoId: number;
  surveyTitle: string;
  surveyTags: string[];
  surveyClosingAt: string;
  openStatusNo: number;
  surveyDescription: string;
  surveyStatusNo: number;
  surveyPostAt?: string;
  surveyImageUrl?: string;
}

export interface CreateSurveyInfoProps {
  surveyInfo: SurveyInfoProps;
  setSurveyInfo: React.Dispatch<React.SetStateAction<SurveyInfoProps>>;
  previewImage?: string;
  setSurveyImage: React.Dispatch<React.SetStateAction<File | undefined>>;
}

export interface SelectionProps {
  questionId: number;
  selectionId: number;
  questionMoveId?: number;
  selectionValue: string;
  isMoveable: boolean;
  isEndOfSurvey: boolean;
}

export interface QuestionProps {
  surveyId: number;
  questionId: number;
  questionTitle: string;
  questionDescription?: string;
  questionRequired: boolean;
  questionType: string;
  selections: SelectionProps[];
}

export interface CreateSelectionProps {
  question: QuestionProps;
  questions: QuestionProps[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
}

export interface CreateQuestionProps {
  question: QuestionProps;
  questions: QuestionProps[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
}

export interface SurveyProps {
  survyeId: number;
  surveyInfo: SurveyInfoProps;
  questions: QuestionProps[];
  selections: SelectionProps[];
}

export interface DragDropQuestionProps {
  questions: QuestionProps[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
}

export interface FloatingActionButtonsProps {
  onClickAddQuestion: () => void;
  surveyInfo: SurveyInfoProps;
  questions: QuestionProps[];
}
