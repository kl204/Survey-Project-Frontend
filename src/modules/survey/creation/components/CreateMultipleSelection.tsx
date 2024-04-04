/** @jsxImportSource @emotion/react */

import { Box, Checkbox, Input } from '@mui/material';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { css } from '@emotion/react';
import {
  CreateSelectionProps,
  QuestionProps,
  SelectionProps,
} from '../types/SurveyTypes';

const primaryColor = '#3e3e3e';

const styles = {
  selectionBox: css({
    display: 'flex',
    alingItems: 'center',
  }),

  removeAndAddIconBox: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '53px',
    minWidth: '53px',
  }),

  plusIcon: css({
    color: primaryColor,
    border: `solid 1px ${primaryColor}`,
    borderRadius: '5px',
    cursor: 'pointer',
  }),

  removeIcon: css({
    color: primaryColor,
    border: `solid 1px ${primaryColor}`,
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '5px',
  }),

  input: css({
    flexGrow: 1,
  }),
};

const fontFamily = 'nanumsquare';
const textStyle = css({
  fontFamily,
});

/**
 * 다중 선택형 문항 선택지를 만드는 컴포넌트 입니다.
 *
 * @component
 * @returns
 */
function CreateMultipleSelection({
  question,
  questions,
  setQuestions,
}: CreateSelectionProps) {
  /**
   * 문항 배열에서 업데이트할 배열을 찾아서 업데이트된 배열을 반환해주는 메서드 입니다.
   *
   * @param updateQuestion 업데이트할 배열
   * @returns 업데이트된 배열
   * @author 강명관
   */
  const findQuestionAndUpdateQuestions = (
    updateQuestion: QuestionProps
  ): QuestionProps[] => {
    const updatedQuestions: QuestionProps[] = questions.map((prevQuestion) =>
      prevQuestion.questionId === question.questionId
        ? updateQuestion
        : prevQuestion
    );

    return updatedQuestions;
  };

  /**
   * 선택지를 추가하는 메서드 입니다.
   *
   * @author 강명관
   */
  const handleAddSelection = () => {
    const addSelection: SelectionProps = {
      questionId: question.questionId,
      selectionId: new Date().getTime(),
      selectionValue: '',
      isMoveable: false,
      isEndOfSurvey: false,
    };

    const updatedQuestion: QuestionProps = {
      ...question,
      selections: [...question.selections, addSelection],
    };

    setQuestions(findQuestionAndUpdateQuestions(updatedQuestion));
  };

  /**
   * 선택지를 삭제하는 메서드 입니다.
   *
   * @param id 삭제할 selection
   * @returns {void} state의 selections 에서 삭제
   * @author 강명관
   */
  const handleRemoveSelection = (removeTargetSelectionId: number) => {
    if (question.selections.length === 1) {
      return;
    }
    const updateSelections: SelectionProps[] = question.selections.filter(
      (selection) => selection.selectionId !== removeTargetSelectionId
    );

    const updateQuestion: QuestionProps = {
      ...question,
      selections: updateSelections,
    };

    setQuestions(findQuestionAndUpdateQuestions(updateQuestion));
  };

  /**
   * 선택지 입력 값을 변경하는 메서드 입니다.
   *
   * @param changedSelection 변경된 선택지
   * @param event Input Change Event
   * @author 강명관
   */
  const handleSelectionValueChange = (
    changedSelection: SelectionProps,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const changeValue = event.target.value;

    const updateSelection: SelectionProps = {
      ...changedSelection,
      selectionValue: changeValue,
    };

    const updateSelections = question.selections.map((selection) =>
      selection.selectionId === updateSelection.selectionId
        ? updateSelection
        : selection
    );

    const updateQuestion = {
      ...question,
      selections: updateSelections,
    };

    setQuestions(findQuestionAndUpdateQuestions(updateQuestion));
  };

  return (
    <div>
      {question.selections.map((selection, index) => (
        <div key={selection.selectionId}>
          <Box css={styles.selectionBox}>
            <Box css={styles.removeAndAddIconBox}>
              {index === question.selections.length - 1 && (
                <AddIcon css={styles.plusIcon} onClick={handleAddSelection} />
              )}

              <RemoveIcon
                css={styles.removeIcon}
                onClick={() => handleRemoveSelection(selection.selectionId)}
              />
            </Box>
            <Checkbox disabled />
            <Input
              placeholder="문항을 입력해주세요."
              css={[styles.input, textStyle]}
              value={selection.selectionValue}
              onChange={(event) => handleSelectionValueChange(selection, event)}
              inputProps={{ maxLength: 255 }}
            />
          </Box>
        </div>
      ))}
    </div>
  );
}

export default CreateMultipleSelection;
