import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import customAxios from 'axios';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Floating from '../components/Floating';
import ClosingSurvey from '../components/ClosingSurvey';
import RecentSurvey from '../components/RecentSurvey';
import WeeklySurvey from '../components/WeeklySurvey';
import '../../../../global.css';
import { CardDataProps } from '../types/MainType';
import axios from '../../../login/components/customApi';
import MainModal from '../components/MainModal';

const fontFamily = 'GmarketSansMedium';
const textStyle = {
  fontFamily,
  color: '#464646',
};
const searchAll = {
  fontFamily,
  display: 'flex',
  alignItems: 'center',
  color: '#464646',
};
const arrowStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginRight: '8px',
  marginTop: '8px',
};
const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

function Main() {
  const [weeklySurveyData, setWeeklySurveyData] = useState<CardDataProps[]>([]);
  const [recentSurveyData, setRecentSurveyData] = useState<CardDataProps[]>([]);
  const [closingSurveyData, setClosingSurveyData] = useState<CardDataProps[]>(
    []
  );

  const [weeklySurveyLoaded, setWeeklySurveyLoaded] = useState(false);
  const [recentSurveyLoaded, setRecentSurveyLoaded] = useState(false);
  const [closingSurveyLoaded, setClosingSurveyLoaded] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardDataProps | null>(null);

  const navigate = useNavigate();

  const fetchWeeklySurveyData = async () => {
    try {
      const weeklyResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/surveys/weekly`
      );
      setWeeklySurveyData(weeklyResponse.data);
      setWeeklySurveyLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchRecentSurveyData = async () => {
    try {
      const card = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/surveys/recent`
      );

      setRecentSurveyData(card.data);
      setRecentSurveyLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClosingSurveyData = async () => {
    try {
      const card = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/surveys/closing`
      );
      setClosingSurveyData(card.data);
      setClosingSurveyLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWeeklySurveyData();
    fetchRecentSurveyData();
    fetchClosingSurveyData();
  }, []);

  /**
   * 메인애서 RedirectModal 을 닫는 메서드 입니다.
   *
   */
  const closeCardModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };

  const redirectToSurveyNo = sessionStorage.getItem('redirectToSurveyNo');

  /**
   * 설문 참여에 바로 들어왔을때 메인해서 해당 번호를통해 설문의 모달을 보여주기 위해 모달의 정보를 가져오는 메서드 입니다.
   *
   */
  const fetchSelectedSurveyData = async () => {
    const axiosForRedirectModal = customAxios.create({
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    try {
      const response = await axiosForRedirectModal.get(
        `${process.env.REACT_APP_BASE_URL}/api/surveys/details/${redirectToSurveyNo}`
      );

      if (response.status !== 200) {
        return;
      }

      sessionStorage.clear();
      setSelectedCard(response.data.content);
      setOpenModal(true);
    } catch (error) {
      console.debug('RedirectModal Error {}', error);
    }
  };

  /**
   * 설문 참여에서 메인으로 리다이렉트 되었을 경우 해당 설문의 모달을 뛰어주기 위한 useEffect 입니다.
   */
  useEffect(() => {
    if (redirectToSurveyNo) {
      fetchSelectedSurveyData();
    }
  }, [redirectToSurveyNo]);

  if (!weeklySurveyLoaded && !recentSurveyLoaded && !closingSurveyLoaded) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          !weeklySurveyLoaded && !recentSurveyLoaded && !closingSurveyLoaded
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Container
      sx={{
        maxWidth: '1150px',
        marginTop: '60px',
        '@media (max-width: 600px)': {
          marginTop: '30px',
        },
      }}
    >
      <h2 style={textStyle}>인기 설문🔥</h2>
      <WeeklySurvey cardList={weeklySurveyData} />
      <div style={arrowStyle} />

      <Box sx={containerStyle}>
        <h2 style={textStyle}>최근 등록된 설문📝</h2>
        <Button onClick={() => navigate('/survey/search')} style={searchAll}>
          전체 보기
          <ChevronRightIcon sx={{ marginBottom: '2.5px' }} />
        </Button>
      </Box>

      <RecentSurvey cardList={recentSurveyData} />
      <div style={arrowStyle} />
      <h2 style={textStyle}>최근 마감된 설문⌛</h2>
      <ClosingSurvey cardList={closingSurveyData} />
      <div style={arrowStyle} />
      <Floating />

      {selectedCard && (
        <MainModal
          closeCardModal={closeCardModal}
          openModal={openModal}
          selectedCard={selectedCard}
        />
      )}
    </Container>
  );
}

export default Main;
