/** @jsxImportSource @emotion/react */

import { IconButton, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { QuestionTypeEnum } from '../../enums/QuestionTypeEnum';

import { DragDropQuestionProps, QuestionProps } from '../types/SurveyTypes';
import CreateQuestion from './CreateQuestion';

/**
 * Drag And Drop 가능한 문항 리스트 컴포넌트 입니다.
 *
 * @component
 * @param questions 문항 배열
 * @param setQuestions 문항 배열의 useState 입니다.
 * @returns
 * @author 강명관
 */
function DragDropQuestion({ questions, setQuestions }: DragDropQuestionProps) {
  /**
   * Drag Drop을 통해 컴포넌트의 순서가 변경되는 것을 상태로 관리하기 위한 메서드 입니다.
   *
   * @param questionList 문항 리스트
   * @param startIndex 이동을 시작할 인덱스
   * @param endIndex 이동을 마친 인덱스
   * @returns 순서가 변경된 문항 리스트
   * @author 강명관
   */
  const reorder = (
    questionList: QuestionProps[],
    startIndex: number,
    endIndex: number
  ): QuestionProps[] => {
    const result = [...questionList];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * react-beautiful-dnd 라이브러리에서 Drag Drop을 핸들링 하기 위한 메서드 입니다.
   * 올바른 Drag Drop의 경우 reorder 함수를 호출하여 스테이트를 변경합니다.
   *
   * @param result Drag가 끝났을때의 동작
   * @author 강명관
   */
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reorderQuestion = reorder(
      questions,
      result.source.index,
      result.destination.index
    );

    const isMoveableQuestion = (targetQuestion: QuestionProps) =>
      targetQuestion.questionType === QuestionTypeEnum.MOVEABLE_QUESTION;

    reorderQuestion.forEach((prevQuestion) => {
      if (!isMoveableQuestion(prevQuestion)) {
        return;
      }

      const maxSelectedMoveableQuestionIndex = Math.max(
        ...prevQuestion.selections.map((targetSelection) => {
          if (!targetSelection.questionMoveId) {
            return 0;
          }

          return targetSelection.questionMoveId;
        })
      );

      for (
        let i = reorderQuestion.indexOf(prevQuestion) + 1;
        i < maxSelectedMoveableQuestionIndex;
        i += 1
      ) {
        reorderQuestion[i].questionRequired = false;
      }
    });

    setQuestions(reorderQuestion);
  };
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppable" direction="vertical">
        {(droppableProvided) => (
          <div
            className="droppable"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {questions.map((question, index) => (
              <Draggable
                key={question.questionId.toString()}
                draggableId={question.questionId.toString()}
                index={index}
              >
                {(draggableProvided) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    style={{
                      userSelect: 'none',
                      margin: '0 0 30px 0',
                      ...draggableProvided.draggableProps.style,
                    }}
                  >
                    <Box
                      css={{
                        border: 'none',
                        backgroundColor: '#ffffff',
                        minWidth: '36px',
                        minHeight: '26px',
                        display: 'inline-block',
                        width: 'auto',
                        color: '#000',
                        fontWeight: 'bold',
                        transform: 'translateX(4px) translateY(66px)',
                        borderRadius: '3px',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      <Tooltip title={`문항 ${index + 1}번`} placement="right">
                        <IconButton>
                          <img
                            src="/q_letter_icon_212286.png"
                            alt="Q"
                            width="20px"
                            css={{
                              marginBottom: '2px',
                              marginLeft: '2px',
                            }}
                          />
                          <Typography
                            css={{
                              fontSize: '20px',
                              color: '#3e3e3e',
                              transform: 'translateX(-1px) translateY(0px)',
                              fontWeight: '600',
                            }}
                          >
                            {index + 1}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <CreateQuestion
                      key={question.questionId}
                      question={question}
                      questions={questions}
                      setQuestions={setQuestions}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DragDropQuestion;
