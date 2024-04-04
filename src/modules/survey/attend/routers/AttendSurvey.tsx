/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/**
 * AttendSurvey 컴포넌트는 사용자에게 설문조사를 제출할 수 있는 인터페이스를 제공합니다.
 * 이 컴포넌트는 여러 종류의 질문 유형을 지원하며 사용자 응답을 수집하고 제출하는 기능을 포함합니다.
 *
 * @component
 * @author 박창우
 */
import React, { useEffect, useState } from 'react';
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Stack,
} from '@mui/material';
import { useScroll, AnimatePresence, Variants, motion } from 'framer-motion';

import { useNavigate, useParams } from 'react-router-dom';
import customAxios from 'axios';
import Swal from 'sweetalert2';
import axios from '../../../login/components/customApi';
import AttendSingleChoice from '../components/AttendSingleChoice';
import AttendSingleMoveChoice from '../components/AttendSingleMoveChoice';
import { SurveyData, SurveyItem } from '../types/AttendTypes';
import AttendMultipleChoice from '../components/AttendMultipleChoice';
import ShortAnswer from '../components/ShortAnswer';
import LongAnswer from '../components/LongAnswer';

/**
 * 사용자의 응답 데이터 인터페이스입니다.
 */
interface UserResponse {
  surveyQuestionTitle: string;
  selectionValue: string | null;
  userNo: number;
  surveyNo: string;
  surveyQuestionNo: number;
  questionTypeNo: number;
  selectionNo: number;
  surveySubjectiveAnswer: string | null;
  endOfSurvey?: boolean;
}
const MAIN_PAGE = '/survey/main';

function AttendSurvey() {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [closingTime, setClosingTime] = useState<Date | null>(null);
  const { surveyNo } = useParams<{ surveyNo: string }>();

  const [surveyData, setSurveyData] = useState<SurveyData>({
    success: false,
    content: [],
    errorResponse: null,
  });

  const [hiddenQuestions, setHiddenQuestions] = useState<
    Record<number, number[]>
  >({});
  const allHiddenQuestions = Object.values(hiddenQuestions).flat();
  const uniqueQuestions = Array.from(
    new Set(surveyData.content.map((item) => item.surveyQuestionNo))
  );
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [surveyTitle, setSurveyTitle] = useState<string | null>(null);

  useState<number | null>(null);

  const USER_NO = Number(localStorage.getItem('userNo'));

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  /**
   * 선택 항목을 클릭할 때 동작하는 함수입니다.
   * 이 함수는 사용자가 선택한 항목에 따라 특정 질문을 숨기거나 표시하는 로직을 담당합니다.
   *
   * @param selectedQuestionNo 현재 선택된 질문 번호
   * @param moveToQuestionNo 이동할 질문 번호
   * @param questionTypeNo 질문 유형 번호
   * @param isMovable 이동 가능 여부
   * @param isUnchecked 선택 여부 확인
   * @param endOfSurvey 설문 종료 여부
   * @returns 없음
   * @author 박창우
   */
  const handleSelectionClick = (
    selectedQuestionNo: number,
    moveToQuestionNo: number,
    questionTypeNo: number,
    isMovable: boolean,
    isUnchecked: boolean,
    endOfSurvey: boolean
    // selectionNo: number
  ) => {
    setHiddenQuestions((prevHiddenQuestions) => {
      const currentHiddenQuestions =
        prevHiddenQuestions[selectedQuestionNo] || [];
      let newHiddenQuestions = [...currentHiddenQuestions];

      // endOfSurvey가 선택되었다가 다른 movable로 변경되는 경우
      if (!endOfSurvey && currentHiddenQuestions.length > 0) {
        // 이전에 endOfSurvey에 의해 숨겨진 모든 질문들을 표시
        uniqueQuestions.forEach((qNo) => {
          if (qNo > selectedQuestionNo) {
            newHiddenQuestions = newHiddenQuestions.filter(
              (hiddenNo) => hiddenNo !== qNo
            );
          }
        });
      }

      if (isMovable && questionTypeNo === 2) {
        // 숨길 질문 번호들을 추가
        for (let i = selectedQuestionNo + 1; i < moveToQuestionNo; i += 1) {
          if (!newHiddenQuestions.includes(i)) {
            newHiddenQuestions.push(i);
          }
        }
      } else if (
        (!isMovable && questionTypeNo === 2 && moveToQuestionNo === 0) ||
        isUnchecked
      ) {
        // 숨겨진 질문 번호들을 필터링
        newHiddenQuestions = newHiddenQuestions.filter(
          (qNo) => !allHiddenQuestions.includes(qNo) || qNo < moveToQuestionNo
        );
      }

      // endOfSurvey가 true인 경우, 뒤따르는 모든 질문을 숨김.
      if (endOfSurvey) {
        const questionsToHide = uniqueQuestions.filter(
          (q) => q > selectedQuestionNo
        );
        newHiddenQuestions = Array.from(
          new Set([...newHiddenQuestions, ...questionsToHide])
        );

        // 함수 파라미터를 직접 변경하지 않고 새로운 객체 생성
        const updatedPrevHiddenQuestions = { ...prevHiddenQuestions };
        newHiddenQuestions.forEach((questionNo) => {
          if (
            !updatedPrevHiddenQuestions[selectedQuestionNo]?.includes(
              questionNo
            )
          ) {
            updatedPrevHiddenQuestions[selectedQuestionNo] = [
              ...(updatedPrevHiddenQuestions[selectedQuestionNo] || []),
              questionNo,
            ];
          }
        });

        return updatedPrevHiddenQuestions;
      }

      // 결과적인 상태를 반환
      return {
        ...prevHiddenQuestions,
        [selectedQuestionNo]: newHiddenQuestions,
      };
    });

    // 사용자 응답을 업데이트
    if (isUnchecked || endOfSurvey) {
      setUserResponses((prevResponses) => {
        let updatedResponses = prevResponses.filter(
          (response) => response.surveyQuestionNo !== selectedQuestionNo
        );

        if (endOfSurvey) {
          const questionsToRemove = uniqueQuestions.filter(
            (q) => q > selectedQuestionNo
          );
          updatedResponses = updatedResponses.filter(
            (response) => !questionsToRemove.includes(response.surveyQuestionNo)
          );
        }

        return updatedResponses;
      });
    }
  };

  /**
   * 사용자의 응답을 처리하는 함수입니다.
   * 각 질문 유형에 따라 다르게 동작합니다.
   *
   * @param questionNo 현재 질문 번호
   * @returns 변경된 응답 처리 함수
   * @author 박창우
   */
  const handleAnswerChange =
    (questionNo: number) =>
    (
      answerOrAnswers:
        | Array<{
            selectionValue: string;
            selectionNo: number;
          }>
        | { selectionValue: string; selectionNo: number; endOfSurvey: boolean }
        | string
    ) => {
      const currentQuestionData = surveyData.content.find(
        (item) => item.surveyQuestionNo === questionNo
      );

      if (!currentQuestionData) {
        console.error('Question not found');
        return;
      }

      const newResponses: UserResponse[] = [];

      // 객관식 복수 선택
      if (
        Array.isArray(answerOrAnswers) &&
        typeof answerOrAnswers[0] === 'object'
      ) {
        answerOrAnswers.forEach((selection) => {
          newResponses.push({
            surveyQuestionTitle: currentQuestionData.surveyQuestionTitle,
            selectionValue: selection.selectionValue,
            userNo: USER_NO,
            surveyNo: currentQuestionData.surveyNo,
            surveyQuestionNo: currentQuestionData.surveyQuestionNo,
            questionTypeNo: currentQuestionData.questionTypeNo,
            selectionNo: selection.selectionNo,
            surveySubjectiveAnswer: null,
            endOfSurvey: currentQuestionData.endOfSurvey,
          });
        });
      } else if (
        currentQuestionData.questionTypeNo === 4 ||
        currentQuestionData.questionTypeNo === 5
      ) {
        newResponses.push({
          surveyQuestionTitle: currentQuestionData.surveyQuestionTitle,
          selectionValue: null,
          userNo: USER_NO,
          surveyNo: currentQuestionData.surveyNo,
          surveyQuestionNo: currentQuestionData.surveyQuestionNo,
          questionTypeNo: currentQuestionData.questionTypeNo,
          selectionNo: 0,
          surveySubjectiveAnswer: answerOrAnswers as string,
          endOfSurvey: currentQuestionData.endOfSurvey,
        });
      } else if (
        !Array.isArray(answerOrAnswers) &&
        typeof answerOrAnswers === 'object' &&
        (currentQuestionData.questionTypeNo === 1 ||
          currentQuestionData.questionTypeNo === 2)
      ) {
        const {
          selectionValue: answerString,
          selectionNo,
          endOfSurvey,
        } = answerOrAnswers;

        if (!answerString) {
          setUserResponses((prev) =>
            prev.filter(
              (response) =>
                response.surveyQuestionNo !==
                currentQuestionData.surveyQuestionNo
            )
          );
        } else {
          newResponses.push({
            surveyQuestionTitle: currentQuestionData.surveyQuestionTitle,
            selectionValue: answerString,
            userNo: USER_NO,
            surveyNo: currentQuestionData.surveyNo,
            surveyQuestionNo: currentQuestionData.surveyQuestionNo,
            questionTypeNo: currentQuestionData.questionTypeNo,
            selectionNo,
            surveySubjectiveAnswer: null,
            endOfSurvey,
          });
        }
      }

      setUserResponses((prev) => {
        const updatedResponses = prev.filter(
          (response) =>
            response.surveyQuestionNo !== currentQuestionData.surveyQuestionNo
        );

        return [...updatedResponses, ...newResponses];
      });
    };

  /**
   * 설문조사의 특정 질문을 렌더링하는 함수입니다.
   *
   * @param questionNo 렌더링할 질문 번호
   * @returns 렌더링된 React 요소
   * @author 박창우
   */
  const renderQuestion = (questionNo: number, key: number) => {
    const question = surveyData.content.find(
      (item) => item.surveyQuestionNo === questionNo
    );
    if (!question) return null;

    const isHidden = allHiddenQuestions.includes(questionNo);

    const { questionTypeNo } = question;
    let Component;
    switch (questionTypeNo) {
      case 1:
        Component = AttendSingleChoice;
        break;
      case 2:
        Component = AttendSingleMoveChoice;
        break;
      case 3:
        Component = AttendMultipleChoice;
        break;
      case 4:
        Component = ShortAnswer;
        break;
      case 5:
        Component = LongAnswer;
        break;
      default:
        return null;
    }

    const slideIn = {
      initial: { x: -100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 100, opacity: 0 },
    };

    if (isHidden) {
      slideIn.initial = { x: 0, opacity: 1 };
      slideIn.animate = { x: 100, opacity: 0 };
    }

    return (
      <AnimatePresence>
        {!isHidden && (
          <motion.div
            key={key}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideIn}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <Component
              surveyData={surveyData.content}
              questionNo={questionNo}
              onAnswerChange={(answer) =>
                handleAnswerChange(questionNo)(answer)
              }
              handleSelectionClick={handleSelectionClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  /**
   * 설문에 대한 모든 정보를 가져오는 메서드 입니다.
   *
   * @author 강명관, 박창우
   */
  const fetchSurveyData = async () => {
    setIsLoading(true);

    const surveyAttendAxios = customAxios.create({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    customAxios.interceptors.request.clear();
    customAxios.interceptors.response.clear();
    const { data } = await surveyAttendAxios.get(
      `${process.env.REACT_APP_BASE_URL}/api/for-attend/surveys/survey-data/${surveyNo}`
    );

    const resultSurveyData: SurveyData = data;
    setSurveyData(resultSurveyData);
    setSurveyTitle(resultSurveyData.content[0].surveyTitle);

    setIsLoading(false);
  };

  /**
   * 설문에 대한 마감시간을 가져오는 메서드 입니다.
   *
   * @author 강명관, 박창우
   */
  const fetchSurveyClosingTime = async () => {
    const surveyAttendAxios = customAxios.create({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    const response = await surveyAttendAxios.get(
      `${process.env.REACT_APP_BASE_URL}/api/for-attend/surveys/closing-time/${surveyNo}`
    );

    if (response.data.success && response.data.content) {
      setClosingTime(new Date(response.data.content));
    }
  };

  /**
   * 컴포넌트가 마운트 될 때 설문조사 데이터를 가져오는 함수입니다.
   *
   * @returns 없음
   * @author 박창우, 강명관
   */
  useEffect(() => {
    if (!surveyNo || Number.isNaN(Number(surveyNo))) {
      navigate('/');
      return;
    }

    setIsLoading(true);

    Promise.all([fetchSurveyData(), fetchSurveyClosingTime()])
      .then(() => {
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          Swal.fire({
            icon: 'error',
            title: '존재하지 않는 설문입니다.',
          });
        } else {
          sessionStorage.setItem('redirectToSurveyNo', surveyNo);
        }
        setIsLoading(false);
        navigate('/');
      });
  }, [surveyNo]);

  function alertAndScrollTo(item: SurveyItem) {
    Swal.fire({
      icon: 'error',
      title: '필수 응답 문항에 답변하세요.',
    }).then((result) => {
      if (result.isConfirmed || result.isDismissed) {
        setTimeout(() => {
          const targetElement = document.getElementById(
            `question-${item.surveyQuestionNo}`
          );

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.error(
              'Target element not found for question:',
              item.surveyQuestionNo
            );
          }
        }, 300);
      }
    });
  }

  /**
   * 사용자가 제출 버튼을 클릭했을 때 동작하는 함수입니다.
   * 유효성 검사 후 서버에 응답 데이터를 제출합니다.
   *
   * @returns 없음
   * @author 박창우
   */
  const handleSubmit = async () => {
    if (closingTime && new Date() > closingTime) {
      alert('이 설문은 이미 마감되었습니다.');
      return;
    }

    // 숨김 처리된 문항 번호들을 배열로 변환
    const hiddenQuestionNumbers = Object.values(hiddenQuestions).flat();

    // 유효성 검사
    for (const item of surveyData.content) {
      // 숨김 처리된 문항은 검사에서 제외
      if (hiddenQuestionNumbers.includes(item.surveyQuestionNo)) {
        continue;
      }

      if (item.required) {
        const responseExists = userResponses.find(
          (response) => response.surveyQuestionNo === item.surveyQuestionNo
        );

        if (!responseExists) {
          console.log(
            `Missing response for question: ${item.surveyQuestionNo}`
          );
          alertAndScrollTo(item);
          return;
        }

        if (
          item.questionTypeNo > 3 &&
          (!responseExists.surveySubjectiveAnswer ||
            responseExists.surveySubjectiveAnswer.trim() === '')
        ) {
          console.log(
            `Empty subjective answer for question: ${item.surveyQuestionNo}`
          );
          alertAndScrollTo(item);
          return;
        }
      }
    }

    const isConfirmed = await Swal.fire({
      title: '설문을 제출하시겠습니까?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3e3e3e',
      cancelButtonColor: '#747474',
      confirmButtonText: '예, 제출합니다',
      cancelButtonText: '아니요',
    });

    if (!isConfirmed.value) {
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/for-attend/surveys/save-responses`,
        userResponses
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: '설문 응답이 완료되었습니다!',
        });
      } else if (response.data.errorCode === 'ERROR_SAVING_SURVEY') {
        Swal.fire({
          icon: 'error',
          title: '설문 응답 저장 중 오류가 발생했습니다.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '오류가 발생했습니다. 다시 시도해주세요.',
        });
      }
      navigate(MAIN_PAGE);
    } catch (error) {
      console.error('Error submitting data:', error);
      Swal.fire({
        icon: 'error',
        title: '서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    }
  };

  if (isLoading) {
    return (
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <Container maxWidth="md" sx={{ paddingLeft: '5px', paddingRight: '5px' }}>
      {/* 스크롤 프로그레스바 */}
      <motion.div
        className="bar"
        style={{
          scaleX: scrollYProgress,
          height: '8px',
          backgroundColor: '#747474',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          originX: 0,
        }}
      />
      <h1
        style={{ fontSize: '25px', display: 'flex', justifyContent: 'center' }}
      >
        {surveyTitle}
      </h1>
      <AnimatePresence>
        {uniqueQuestions.map((questionNo, index) => (
          <motion.div
            key={questionNo}
            custom={index}
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={containerVariants}
            transition={{
              delay: index * 0.1,
              when: 'beforeChildren',
              staggerChildren: 0.1,
            }}
          >
            {renderQuestion(questionNo, index)}
          </motion.div>
        ))}
      </AnimatePresence>

      <Stack spacing={2}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            marginBottom: '60px',
            backgroundColor: '#ffffff',
            color: 'black',
            fontWeight: '600',
            '&:hover': {
              backgroundColor: '#3e3e3e',
              color: 'white',
            },
            '&.Mui-focusVisible': {
              backgroundColor: '#ffffff',
              color: 'black',
            },
          }}
        >
          설문 제출
        </Button>
      </Stack>
    </Container>
  );
}

export default AttendSurvey;
