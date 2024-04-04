/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormGroup,
  Tooltip,
  Switch,
  Input,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

import { css } from '@emotion/react';
import Swal from 'sweetalert2';
import CreateSingleSelection from './CreateSingleSelection';
import CreateMultipleSelection from './CreateMultipleSelection';
import CreateShortAnswer from './CreatShortAnswer';
import CreateSubjectiveDescriptive from './CreateSubjectiveDescriptive';
import {
  CreateQuestionProps,
  QuestionProps,
  SelectionProps,
} from '../types/SurveyTypes';
import CreateMoveableSingleSelection from './CreateMoveableSingleSelection';
import { CREATE_NEXT_QUESTION_INDEX } from '../constant/SurveyCreationConstant';
import { QuestionTypeEnum } from '../../enums/QuestionTypeEnum';

const styles = {
  dragIndicatorBox: css({
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    top: '-15px',
  }),

  dragIcon: css({
    transform: 'rotate(90deg);',
    color: '#b2b2b2',
  }),

  iconAndSwitchContainer: css({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '-15px',
  }),

  iconAndSwitchBox: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  switchBox: css({
    display: 'flex',
    alignItems: 'center',
    marginLeft: '5px',
  }),

  questionBox: css({
    border: 'none',
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);',
    marginBottom: '30px',
    marginTop: '-3px',
  }),

  questionTitleBox: css({
    display: 'flex',
    alignItems: 'center',
  }),

  questionDescriptionBox: css({
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  }),

  selectQuestionTypeBox: css({
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  }),

  questionTypeSelectBox: css({
    flexGrow: 1,
  }),

  questionInputBox: css({
    flexGrow: 1,
  }),

  textStyle: css({
    marginRight: '10px',
    fontWeight: 'bold',
    minWidth: '65px',
  }),

  requiredText: css({
    marginRight: '-7px',
  }),
};

/**
 * 설문조사 문항을 만드는 컴포넌트 입니다.
 *
 * @param question 자기 자신 문항 객체
 * @param questions 문항 배열
 * @param setQuestions questions setStataus 메서드
 * @author 강명관
 */
function CreateQuestion({
  question,
  questions,
  setQuestions,
}: CreateQuestionProps) {
  const [switchChecked, setSwitchChecked] = useState<boolean>(true);

  /**
   * 셀렉박스의 선택에 따라 문항 타입을 랜더링하기 위한 메서드입니다.
   *
   * @param event SelectChangeEvent
   */
  const handleQuestionTypeChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;

    let defaultSelection: SelectionProps = {
      questionId: question.questionId,
      selectionId: new Date().getTime(),
      selectionValue: '',
      isMoveable: false,
      isEndOfSurvey: false,
    };

    if (value === QuestionTypeEnum.MOVEABLE_QUESTION.toString()) {
      const currentQuestionIndex = questions.indexOf(question);
      if (questions.length - 1 === questions.indexOf(question)) {
        defaultSelection = {
          ...defaultSelection,
          isMoveable: true,
        };
      } else {
        defaultSelection = {
          ...defaultSelection,
          questionMoveId: currentQuestionIndex + CREATE_NEXT_QUESTION_INDEX,
          isMoveable: true,
        };
      }
    }

    const updateQuestions: QuestionProps[] = questions.map((prevQuestion) => {
      if (prevQuestion.questionId === question.questionId) {
        return {
          ...prevQuestion,
          [name]: value,
          selections: [defaultSelection],
        };
      }

      return prevQuestion;
    });

    setQuestions(updateQuestions);
  };

  /**
   * 문항이 처음 랜더링 될 때 디폴트 타입으로 단일 선택형 문항을 선택하고,
   * 그에 맞게 선택지를 랜더링 해주기 위한 useEffect 입니다.
   * @author 강명관
   */
  useEffect(() => {
    if (question.selections.length === 0) {
      handleQuestionTypeChange({
        target: {
          name: 'questionType',
          value: question.questionType,
        },
      } as SelectChangeEvent);
    }
  }, []);

  /**
   * 문항을 삭제하기 위한 메서드 입니다.
   *
   * @param removeTargetId 삭제할 문항의 id
   * @return 문항이 한 개 밖에 존재하지 않는경우 삭제 불가
   * @author 강명관
   */
  const handleRemoveQuestion = (removeTargetId: number) => {
    if (questions.length === 1) {
      return;
    }

    setQuestions([
      ...questions.filter((ques) => ques.questionId !== removeTargetId),
    ]);
  };

  /**
   * 문항의 필수 여부를 변경하는 메서드 입니다.
   *
   * @param targetQuestion 변경할 문항
   * @author 강명관
   */
  const handleRequiredSwitchChange = (targetQuestion: QuestionProps) => {
    const targetQuestionIndex = questions.indexOf(targetQuestion);

    const checkMovableQuestionBetweenTargetQuestion = questions.some(
      (prevQuestion, index) => {
        if (prevQuestion.questionType !== QuestionTypeEnum.MOVEABLE_QUESTION) {
          return false;
        }

        if (targetQuestionIndex < index) {
          return false;
        }

        return prevQuestion.selections.some(
          (selection) =>
            selection.questionMoveId &&
            selection.questionMoveId > questions.indexOf(targetQuestion) + 1
        );
      }
    );

    if (
      checkMovableQuestionBetweenTargetQuestion &&
      !targetQuestion.questionRequired
    ) {
      Swal.fire({
        icon: 'error',
        title: '문항 이동사이의 문항은 필수가 될 수 없습니다.',
      });
      return;
    }

    const updateQuestions = questions.map((prevQuestion) => {
      if (prevQuestion.questionId === targetQuestion.questionId) {
        return {
          ...prevQuestion,
          questionRequired: !prevQuestion.questionRequired,
        };
      }
      return prevQuestion;
    });
    setQuestions(updateQuestions);
  };

  const handelSwitchChange = () => {
    setSwitchChecked(question.questionRequired);
  };

  useEffect(() => {
    handelSwitchChange();
  }, [question.questionRequired]);

  /**
   * 설문 문항의 제목과 설명을 작성하는 메서드 입니다.
   *
   * @param event 설문 문항 제목, 설명 Input 태그의 onChange 이벤트
   * @author 강명관
   */
  const handelQuestionInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    const updateQuestions = questions.map((prevQuestion) => {
      if (prevQuestion.questionId === question.questionId) {
        return {
          ...prevQuestion,
          [name]: value,
        };
      }
      return prevQuestion;
    });

    setQuestions(updateQuestions);
  };

  const dragIndicator = (
    <Box css={styles.dragIndicatorBox}>
      <DragIndicatorIcon css={styles.dragIcon} />
    </Box>
  );

  const deleteIconAndRequiredSwitch = (
    <Box css={styles.iconAndSwitchContainer}>
      <Box css={styles.iconAndSwitchBox}>
        <Tooltip
          title="Delete"
          onClick={() => handleRemoveQuestion(question.questionId)}
        >
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <FormGroup>
          <Box css={styles.switchBox}>
            <Typography css={styles.requiredText}>필수</Typography>
            <Switch
              checked={switchChecked}
              onChange={() => handleRequiredSwitchChange(question)}
              color="default"
            />
          </Box>
        </FormGroup>
      </Box>
    </Box>
  );

  const questionTitle = (
    <Box css={styles.questionTitleBox}>
      <Typography css={styles.textStyle}>문항 제목</Typography>
      <Input
        placeholder="문항 제목을 입력해주세요."
        css={styles.questionInputBox}
        value={question.questionTitle}
        name="questionTitle"
        onChange={(event) => handelQuestionInputChange(event)}
        inputProps={{ maxLength: 255 }}
      />
    </Box>
  );

  const questionDescription = (
    <Box css={styles.questionDescriptionBox}>
      <Typography css={styles.textStyle}>문항 설명</Typography>
      <Input
        placeholder="문항 설명을 입력해주세요."
        css={styles.questionInputBox}
        name="questionDescription"
        value={question.questionDescription}
        onChange={(event) => handelQuestionInputChange(event)}
      />
    </Box>
  );

  const selectQuestionType = (
    <Box css={styles.selectQuestionTypeBox}>
      <Typography css={styles.textStyle}>문항 유형</Typography>

      <FormControl css={styles.questionTypeSelectBox}>
        <Select
          id="demo-simple-select"
          name="questionType"
          value={question.questionType}
          displayEmpty
          onChange={handleQuestionTypeChange}
        >
          <MenuItem value={QuestionTypeEnum.SINGLE_QUESTION}>
            단일 선택형
          </MenuItem>
          <MenuItem value={QuestionTypeEnum.MOVEABLE_QUESTION}>
            단일 선택형 (선택시 문항 이동)
          </MenuItem>
          <MenuItem value={QuestionTypeEnum.MULTIPLE_QUESTION}>
            복수 선택형
          </MenuItem>
          <MenuItem value={QuestionTypeEnum.SHORT_ANSWER}>
            주관식 단답형
          </MenuItem>
          <MenuItem value={QuestionTypeEnum.SUBJECTIVE_DESCRIPTIVE_ANSWER}>
            주관식 서술형
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Card variant="outlined" css={styles.questionBox}>
      <CardContent>
        {dragIndicator}
        {deleteIconAndRequiredSwitch}
        {questionTitle}
        {questionDescription}
        {selectQuestionType}

        {question.questionType === QuestionTypeEnum.SINGLE_QUESTION && (
          <CreateSingleSelection
            question={question}
            questions={questions}
            setQuestions={setQuestions}
          />
        )}
        {question.questionType === QuestionTypeEnum.MOVEABLE_QUESTION && (
          <CreateMoveableSingleSelection
            question={question}
            questions={questions}
            setQuestions={setQuestions}
          />
        )}
        {question.questionType === QuestionTypeEnum.MULTIPLE_QUESTION && (
          <CreateMultipleSelection
            question={question}
            questions={questions}
            setQuestions={setQuestions}
          />
        )}
        {question.questionType === QuestionTypeEnum.SHORT_ANSWER && (
          <CreateShortAnswer />
        )}
        {question.questionType ===
          QuestionTypeEnum.SUBJECTIVE_DESCRIPTIVE_ANSWER && (
          <CreateSubjectiveDescriptive />
        )}
      </CardContent>
    </Card>
  );
}

export default CreateQuestion;
