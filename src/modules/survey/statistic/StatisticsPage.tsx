/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Container,
} from '@mui/material';
import { motion, useScroll } from 'framer-motion';
import Swal from 'sweetalert2';
import AnswerList from './components/AnswerList';
import '../../../global.css';
import WordCloud from './components/WordCloud';
import GooglePieChart from './components/GooglePieChart';
import { Selection } from './types/SurveyStatisticTypes';
import axios from '../../login/components/customApi';
import Floating from '../main/components/Floating';

const styles = {
  card: {
    '@media (min-width: 600px)': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: '30px',
    },
  },
  cardTitle: {
    marginTop: '20px',
    borderRadius: '4px',
    '@media (min-width: 600px)': {
      width: '100%',
    },
  },
  cardContent: {
    border: '1px solid #757575',
    borderRadius: '3%',
    '@media (min-width: 600px)': {
      width: '100%',
    },
  },
  googleChartContent: {
    border: '1px solid #757575',
    borderRadius: '3%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '350px',

    '@media (min-width: 600px)': {
      width: '820px',
      height: '480px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },

  subjectContent: {
    width: '100%',
    border: '1px solid #757575',
    borderRadius: '3%',
    '@media (maxWidth: 600px)': {
      width: '100%',
      height: '40%',
    },
  },
  typography: {
    fontSize: '25px',
    color: '#757575',
  },
  titleText: {
    width: '100%',
    textAlign: 'center',
    fontSize: '25px',
    fontWeight: 'bold',
    margin: '20px 0 20px 0',
    '@media (min-width: 600px)': {
      fontSize: '40px',
      margin: '5px 0 5px 0',
    },
  },
  componentText: {
    fontSize: '20px',
    textAlign: 'left',
    margin: '10px',
    fontWeight: 'bold',
    '@media (min-width: 400px)': {
      fontSize: '30px',
    },
  },
  surveyInfo: {
    width: '100%',
    margin: '5px 0 5px 0',
    fontSize: '15px',
    textAlign: 'right',
    '@media (min-width: 600px)': {
      fontSize: '20px',
      margin: '5px 0 5px 0',
    },
  },
};

const customStyles = `
.swal-custom-popup {
  z-index: 1500; // 필요한 z-index 값
}
.swal-custom-container {
  z-index: 1500; // 필요한 z-index 값
}
`;

/**
 * 통계보기 페이지의 각 문항별 유형에 따른 통계 카드들을 보여주는 함수입니다.
 * @component
 * @returns 통계 페이지
 * @author 김선규
 */
export default function StatisticsPage() {
  const { scrollYProgress } = useScroll();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectStat, setSelectStat] = useState<Selection[]>([]);
  const [surveyTitle, setSurveyTitle] = useState<string>();
  const [allItems, setAllItems] = useState<Record<string, Selection[]>>({});
  const params = useParams();
  const statSurveyNo = params.surveyNo;
  const navigate = useNavigate();

  /**
   * 주어진 설문 번호에 해당하는 통계 데이터를 불러오는 비동기 함수입니다.
   * @async
   * @function
   */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const isMember = localStorage.getItem('userNickname');

      try {
        if (isMember !== null) {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/survey/resultall?surveyno=${statSurveyNo}`
          );
          setSelectStat(response.data.content);
          setSurveyTitle(response.data.content[0].surveyTitle);
          setIsLoading(false);
        } else {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/survey/resultall/nonMember?surveyno=${statSurveyNo}`
          );
          setSelectStat(response.data.content);
          setSurveyTitle(response.data.content[0].surveyTitle);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('통계 보기 중 오류 발생:', error);
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: '부적절한 접근!',
          customClass: {
            popup: 'swal-custom-popup',
            container: 'swal-custom-container',
          },
        });
        navigate('/login');
      }
    };

    fetchData();
  }, [statSurveyNo]);

  /**
   * 주어진 데이터를 설문 질문 번호에 따라 그룹화합니다.
   * @param {Selection[]} data - 통계 데이터 배열
   * @returns {Record<string, Selection[]>} 통계 데이터 객체
   * @function
   */
  const surveyBranch = (data: Selection[]): Record<string, Selection[]> => {
    const itemGroups: Record<string, Selection[]> = {};

    data.forEach((item) => {
      const { surveyQuestionNo } = item;

      if (!itemGroups[surveyQuestionNo]) {
        itemGroups[surveyQuestionNo] = [];
      }
      itemGroups[surveyQuestionNo].push(item);
    });

    return itemGroups;
  };

  /**
   * 선택된 통계 데이터를 설문 질문 번호에 따라 그룹화하고 모든 아이템 상태를 업데이트합니다.
   * @function
   */
  useEffect(() => {
    setAllItems(surveyBranch(selectStat));
  }, [selectStat]);

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <Container
      maxWidth="md"
      sx={{
        paddingLeft: '5px',
        paddingRight: '5px',
      }}
    >
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
      <Box sx={styles.card}>
        <Typography sx={styles.titleText}>{surveyTitle}</Typography>
      </Box>
      {Object.keys(allItems).map((questionNo, index) => {
        const itemsForQuestion: Selection[] = allItems[questionNo];
        const { questionTypeNo } = itemsForQuestion[0];

        /**
         * 주어진 통계 데이터 배열에서 선택형 답변의 총 개수를 계산하는 함수입니다.
         * @param {Array<{ selectionCount: number }>} itemsForQuestionCount - 선택형 답변 통계 데이터 배열
         * @returns {number} 선택형 답변의 총 개수
         * @function
         * @memberof StatisticsPage
         * @inner
         * @author 김선규
         */
        const countSelections = (
          itemsForQuestionCount: { selectionCount: number }[]
        ): number => {
          let CounttotalSelectionCount = 0;

          itemsForQuestionCount.forEach((item: { selectionCount: number }) => {
            CounttotalSelectionCount += item.selectionCount;
          });

          return CounttotalSelectionCount;
        };
        /**
         * 주어진 통계 데이터 배열에서 주관식 답변의 총 개수를 계산하는 함수입니다.
         * @param {Selection[]} itemsForQuestionCountSub - 주관식 답변 통계 데이터 배열
         * @returns {number} 주관식 답변의 총 개수
         * @function
         * @memberof StatisticsPage
         * @inner
         * @author 김선규
         */
        const countSubjectiveAnswerCount = (
          itemsForQuestionCountSub: Selection[]
        ): number => {
          let totalSurveySubjectiveAnswerCount = 0;

          itemsForQuestionCountSub.forEach((item) => {
            totalSurveySubjectiveAnswerCount +=
              item.surveySubjectiveAnswerCount;
          });

          return totalSurveySubjectiveAnswerCount;
        };
        /**
         * 주어진 통계 데이터 배열에서 선택형 답변의 데이터를 추출하는 함수입니다.
         * @param {Selection[]} data - 선택형 답변 통계 데이터 배열
         * @returns {[string, number][]} 선택형 답변 데이터를 [선택값, 개수] 형태로 담은 배열
         * @function
         * @memberof StatisticsPage
         * @inner
         * @author 김선규
         */
        const extractChartData = (data: Selection[]): [string, number][] =>
          data.map((item) => [item.selectionValue, item.selectionCount]);
        const chartData = extractChartData(itemsForQuestion);

        /**
         * 주어진 통계 데이터 배열에서 단답형 주관식 답변의 데이터를 추출하는 함수입니다.
         * @param {Selection[]} data - 통계 데이터 배열
         * @returns {Selection[]} 단답형 주관식 답변 데이터 배열
         * @function
         * @memberof StatisticsPage
         * @inner
         * @author 김선규
         */
        const extractShortSubjectiveAnswer = (
          data: Selection[]
        ): Selection[] => {
          const filteredData = data.filter((item) => item.questionTypeNo === 4);

          return filteredData;
        };
        const shortSubData = extractShortSubjectiveAnswer(itemsForQuestion);

        /**
         * 주어진 통계 데이터 배열에서 서술형 주관식 답변의 데이터를 추출하는 함수입니다.
         * @param {Selection[]} data - 통계 데이터 배열
         * @returns {Selection[]} 서술형 주관식 답변 데이터 배열
         * @function
         * @memberof StatisticsPage
         * @inner
         * @author 김선규
         */
        const extractLongSubjectiveAnswer = (
          data: Selection[]
        ): Selection[] => {
          const filteredData = data.filter((item) => item.questionTypeNo === 5);

          return filteredData;
        };
        const LongSubData = extractLongSubjectiveAnswer(itemsForQuestion);

        return (
          <Box sx={styles.card} key={questionNo}>
            <style>{customStyles}</style>
            <Card sx={styles.cardTitle} key={questionNo}>
              <CardContent>
                <Box>
                  <Typography sx={styles.componentText}>
                    {itemsForQuestion[0].surveyQuestionTitle}
                  </Typography>

                  <Typography sx={styles.surveyInfo}>
                    선택지 답변수 :{' '}
                    {itemsForQuestion[0].selectionCount !== 0
                      ? countSelections(itemsForQuestion)
                      : countSubjectiveAnswerCount(itemsForQuestion)}
                  </Typography>

                  {questionTypeNo === 1 && (
                    <>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          margin: '10px 0 10px 0',
                          '@media (min-width: 600px)': {
                            fontSize: '1.4rem',
                          },
                        }}
                      >
                        📝 파이차트로 보는 통계
                      </Typography>
                      <Box sx={styles.googleChartContent}>
                        <GooglePieChart selectionAnswer={chartData} />
                      </Box>
                    </>
                  )}
                  {questionTypeNo === 2 && (
                    <>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          margin: '10px 0 10px 0',
                          '@media (min-width: 600px)': {
                            fontSize: '1.4rem',
                          },
                        }}
                      >
                        📝 파이차트로 보는 통계
                      </Typography>
                      <Box sx={styles.googleChartContent}>
                        <GooglePieChart selectionAnswer={chartData} />
                      </Box>
                    </>
                  )}
                  {questionTypeNo === 3 && (
                    <>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          margin: '10px 0 10px 0',
                          '@media (min-width: 600px)': {
                            fontSize: '1.4rem',
                          },
                        }}
                      >
                        📝 파이차트로 보는 통계
                      </Typography>
                      <Box sx={styles.googleChartContent}>
                        <GooglePieChart selectionAnswer={chartData} />
                      </Box>
                    </>
                  )}
                  {questionTypeNo === 4 && (
                    <>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          margin: '10px 0 10px 0',
                          '@media (min-width: 600px)': {
                            fontSize: '1.4rem',
                          },
                        }}
                      >
                        📝 워드클라우드로 보는 통계
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          margin: '10px 0 10px 0',
                        }}
                      >
                        <Box sx={styles.subjectContent}>
                          <WordCloud
                            wordCloud={shortSubData.map((item) => ({
                              text: item.surveySubjectiveAnswer,
                              size: item.questionTypeNo,
                            }))}
                          />
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          margin: '20px 0 10px 0',
                          '@media (min-width: 600px)': {
                            fontSize: '1.4rem',
                          },
                        }}
                      >
                        🔥답변 랭킹
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <AnswerList selectList={shortSubData} />
                      </Box>
                    </>
                  )}

                  {questionTypeNo === 5 && (
                    <>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          '@media (min-width: 600px)': {
                            fontSize: '1.4rem',
                          },
                        }}
                      >
                        📝 장문의 긴 답변
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '10px 10px 10px 10px',
                        }}
                      >
                        <AnswerList selectList={LongSubData} />
                      </Box>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      })}
      <Box sx={styles.card}>
        <Card sx={styles.cardTitle}>
          {' '}
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate(-1)}
            sx={{
              padding: '10px 20px 10px 20px',
              backgroundColor: '#ffffff', // 기본 배경색
              color: 'black', // 기본 폰트 색상
              fontWeight: '600',
              '&:hover': {
                backgroundColor: '#3e3e3e', // 호버 시 배경색
                color: 'white', // 호버 시 폰트 색상
              },
              '&.Mui-focusVisible': {
                backgroundColor: '#ffffff', // 포커스 시 배경색
                color: 'black', // 포커스 시 폰트 색상
              },
            }}
          >
            돌아가기
          </Button>
        </Card>
      </Box>
      <Floating />
    </Container>
  );
}
