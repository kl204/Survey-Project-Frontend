/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import Swal from 'sweetalert2';
import customAxios from 'axios';
import axios from '../../../login/components/customApi';
import FloatingActionButtons from '../components/FloatingActionButtons';
import CreateSurveyInfo from '../components/CreateSurveyInfo';
import { QuestionProps, SurveyInfoProps } from '../types/SurveyTypes';
import { validationSurvey } from '../util/ValidatorUtil';
import { QuestionTypeEnum } from '../../enums/QuestionTypeEnum';
import { OpenStatusEnum } from '../../enums/OpenStatusEnum';
import { SurveyStatusEunm } from '../../enums/SurveyStatusEnum';
import DragDropQuestion from '../components/DragDropQuestions';
import { imageUploadToS3 } from '../../../utils/ImageUploadUtil';

const MAIN_PAGE = '/survey/main';
const MYPAGE_WRITE_PAGE = '/survey/mypage/write';

const styles = {
  container: css({
    marginTop: '30px',
  }),

  buttonBox: css({
    marginRight: '10px',
  }),

  writeButton: css({
    marginRight: '20px',
    backgroundColor: '#747474',
    '&:hover': {
      backgroundColor: '#3e3e3e', // 호버 시 배경색
      color: 'white', // 호버 시 폰트 색상
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#ffffff', // 포커스 시 배경색
      color: 'black', // 포커스 시 폰트 색상
    },
  }),

  postButton: css({
    backgroundColor: '#3e3e3e',
    '&:hover': {
      backgroundColor: '#3e3e3e', // 호버 시 배경색
      color: 'white', // 호버 시 폰트 색상
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#ffffff', // 포커스 시 배경색
      color: 'black', // 포커스 시 폰트 색상
    },
  }),
};

/**
 * 섦문 작성페이지를 담당하는 컴포넌트 입니다.
 *
 * @author 강명관
 */
function CreateationSurvey() {
  const navigate = useNavigate();

  const [surveyId] = useState<number>(new Date().getTime());

  const [surveyImage, setSurveyImage] = useState<File>();

  const [surveyInfo, setSurveyInfo] = useState<SurveyInfoProps>({
    surveyId,
    surveyInfoId: new Date().getTime(),
    surveyTitle: '',
    surveyTags: [],
    surveyDescription: '',
    surveyClosingAt: '',
    openStatusNo: OpenStatusEnum.PUBLIC,
    surveyStatusNo: SurveyStatusEunm.WRITING,
  });

  const [questions, setQuestions] = useState<QuestionProps[]>([
    {
      surveyId,
      questionId: new Date().getTime(),
      questionTitle: '',
      questionDescription: '',
      questionType: QuestionTypeEnum.SINGLE_QUESTION,
      questionRequired: true,
      selections: [],
    },
  ]);

  const fetchValidUserCheck = async () => {
    const axiosForUserValidation = customAxios.create({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    try {
      const response = await axiosForUserValidation.get(
        `${process.env.REACT_APP_BASE_URL}/api/users/valid-check`
      );
      if (response.status !== 200) {
        Swal.fire({
          icon: 'error',
          title: '로그인이 필요한 서비스입니다.',
        });
        navigate('/');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '로그인이 필요한 서비스입니다.',
      });
      navigate('/');
    }
  };

  useEffect(() => {
    fetchValidUserCheck();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        surveyId,
        questionId: new Date().getTime(),
        questionTitle: '',
        questionDescription: '',
        questionType: QuestionTypeEnum.SINGLE_QUESTION,
        questionRequired: true,
        selections: [],
      },
    ]);
  };

  /**
   * 설문을 작성하는 메서드입니다.
   *
   * @returns 설문이 성공적으로 작성시 main 페이지로 리다이렉트 합니다.
   * @author 강명관
   */
  const handleSubmitSurveyWrite = async () => {
    const validationResult = await validationSurvey(
      surveyInfo,
      surveyImage,
      questions
    );

    if (!validationResult) {
      return;
    }

    if (surveyImage !== undefined) {
      try {
        const imageUrl = await imageUploadToS3(surveyImage);
        surveyInfo.surveyImageUrl = imageUrl;
        console.log(imageUrl);
      } catch (error) {
        console.error(error);
      }
    }

    const requestData = {
      surveyInfoCreateDto: surveyInfo,
      surveyQuestionCreateDtoList: questions,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/surveys`,
        requestData
      );

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: '설문 작성이 완료되었습니다!',
        });
        navigate(MYPAGE_WRITE_PAGE);
      } else {
        console.error('요청 실패:', response.status, response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 설문을 바로 게시하기 위해 제출하는 메서드 입니다.
   *
   * @returns 작성을 완료할 경우 main페이지로 리다이렉트
   * @author 강명관
   */
  const handleSubmitSurveyPost = async () => {
    const isConfirmed = await Swal.fire({
      title: '정말 게시하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });

    if (!isConfirmed.value) {
      return;
    }
    const validationResult = await validationSurvey(
      surveyInfo,
      surveyImage,
      questions
    );

    if (!validationResult) {
      return;
    }

    surveyInfo.surveyStatusNo = SurveyStatusEunm.PROGRESS;

    if (surveyImage !== undefined) {
      try {
        const imageUrl = await imageUploadToS3(surveyImage);
        surveyInfo.surveyImageUrl = imageUrl;
        console.log(imageUrl);
      } catch (error) {
        console.error(error);
      }
    }

    const requestData = {
      surveyInfoCreateDto: surveyInfo,
      surveyQuestionCreateDtoList: questions,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/surveys`,
        requestData
      );

      if (response.status === 201) {
        navigate(MAIN_PAGE);
      } else {
        console.error('요청 실패:', response.status, response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md" css={styles.container}>
      <CreateSurveyInfo
        surveyInfo={surveyInfo}
        setSurveyInfo={setSurveyInfo}
        setSurveyImage={setSurveyImage}
      />

      <DragDropQuestion questions={questions} setQuestions={setQuestions} />

      <Box css={styles.buttonBox}>
        <Button
          variant="contained"
          css={styles.writeButton}
          onClick={handleSubmitSurveyWrite}
        >
          작성하기
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmitSurveyPost}
          css={styles.postButton}
        >
          게시하기
        </Button>
      </Box>
      <FloatingActionButtons
        onClickAddQuestion={handleAddQuestion}
        surveyInfo={surveyInfo}
        questions={questions}
      />
    </Container>
  );
}

export default CreateationSurvey;
