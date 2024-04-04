/** @jsxImportSource @emotion/react */

import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import FaceIcon from '@mui/icons-material/Face';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { CardDataProps } from '../survey/main/types/MainType';
import { tagColor } from '../survey/main/constant/MainConstant';
import MainModal from '../survey/main/components/MainModal';

const fontFamily = 'GmarketSansMedium';

const styles = {
  textStyle: css({
    fontFamily,
    color: '#464646',
  }),

  container: css({
    marginTop: '80px',
    padding: '10px',
  }),

  errorTitleBox: css({
    marginBottom: '40px',
  }),

  errorTitle: css({
    fontSize: '38px',
    fontWeight: '600',
    textAlign: 'center',

    '@media  screen and (max-width: 603px)': {
      fontSize: '22px',
    },

    '@media  screen and (min-width: 603px)': {
      fontSize: '22px',
    },

    '@media (min-width: 604px) and (max-width: 1024px)': {
      fontSize: '30px',
    },

    '@media (min-width: 1024px)': {
      fontSize: '36px',
    },
  }),

  mainButtonBox: css({
    margin: 'auto',
    marginBottom: '40px',
    textAlign: 'center',
    width: '150px',
    height: '45px',
    lineHeight: '45px',
    verticalAlign: 'middle',
    backgroundColor: '#343434',
    borderRadius: '10px',
  }),

  mainButton: css({
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '16px',
  }),

  textBox: css({
    margin: '30px 0',
  }),

  text: css({
    fontSize: '23px',
    fontWeight: 'bold',
  }),

  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  cardBox: css({
    width: '250px',

    '@media (max-width: 551px)': {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '15px',
    },

    '@media (min-width: 551px)': {
      marginRight: '15px',
      marginBottom: '15px',
    },
  }),

  cardStyle: css({
    maxWidth: 250,
    width: '250px',
    borderRadius: 4,
  }),

  cardMedia: css({
    display: 'flex',
    height: '150px',
  }),

  cardContent: css({
    justifyContent: 'space-between',
  }),

  surveyAttendCount: css({
    fontSize: '12px',
    width: '60px',
    height: '20px',
    fontWeight: 600,
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    boxShadow: 'inset 0px 0px 3px rgba(0, 0, 0, 0.3)',
  }),

  faceIcon: css({
    fontSize: '15px',
  }),

  surveyStatusName: css({
    width: '40px',
    height: '20px',
    fontSize: '10px',
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: 0,
    },
    backgroundColor: '#F9F9F9',
  }),

  dateBox: css({
    display: 'flex',
    alignItems: 'stretch',
    fontSize: 12,
    color: 'text.secondary',
    fontWeight: 600,
    marginBottom: '5px',
  }),

  dateIcon: css({
    fontSize: '15px',
    marginRight: '4px',
  }),

  surveyTitle: css({
    fontSize: 18,
    fontWeight: 600,
    marginBottom: '8px',
    cursor: 'pointer',
    maxHeight: '47px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    height: '47px',
    WebkitBoxOrient: 'vertical',
  }),

  tagChip: css({
    fontSize: 11,
    marginRight: 1,
    height: '20px',
  }),
};

export default function NotFoundPage() {
  const [surveyData, setSurveyData] = useState<CardDataProps[]>();
  const [isSurveyDataLoading, setIsSurveyDataLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardDataProps | null>(null);

  const getChipColor = (surveyStatusName: string) => {
    switch (surveyStatusName) {
      case '진행':
        return '#000000';
      case '작성':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const openCardModal = (card: CardDataProps) => {
    setSelectedCard(card);
    setOpenModal(true);
  };

  const closeCardModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };

  const fetchSurveyData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/surveys/weekly`
      );

      setSurveyData(response.data.slice(0, 4));
      setIsSurveyDataLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchSurveyData();
  }, []);

  if (isSurveyDataLoading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSurveyDataLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const handleGoToMain = () => {
    navigate('/');
  };
  return (
    <Box css={styles.container}>
      <Box css={styles.errorTitleBox}>
        <Typography css={[styles.errorTitle, styles.textStyle]}>
          해당페이지를 찾을 수 없습니다.
        </Typography>
      </Box>
      <Box css={styles.mainButtonBox}>
        <Button css={styles.mainButton} onClick={handleGoToMain}>
          메인으로 가기
        </Button>
      </Box>

      <Box css={styles.textBox}>
        <Typography css={[styles.text, styles.textStyle]}>
          이런 설문은 어떤가요 🤔
        </Typography>
      </Box>

      <div css={{ display: 'flex', flexWrap: 'wrap' }}>
        {surveyData &&
          surveyData.map((card) => (
            <div key={card.surveyNo} css={styles.cardBox}>
              {/* 카드를 클릭하면 해당 카드 정보를 전달하여 모달 열기 */}

              <Card css={styles.cardStyle}>
                <CardActionArea onClick={() => openCardModal(card)}>
                  <CardMedia
                    component="img"
                    css={styles.cardMedia}
                    image={card.surveyImage}
                    alt="survey image"
                  />

                  <CardContent css={styles.cardContent}>
                    {/* 카드 내용 */}
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="space-between"
                      paddingBottom="12px"
                    >
                      <Chip
                        label={card.surveyAttendCount}
                        css={styles.surveyAttendCount}
                        icon={<FaceIcon css={styles.faceIcon} />}
                      />

                      <Chip
                        label={card.surveyStatusName}
                        variant="outlined"
                        css={styles.surveyStatusName}
                        sx={{
                          color: getChipColor(card.surveyStatusName),
                        }}
                      />
                    </Stack>
                    <div css={styles.dateBox}>
                      <EventAvailableIcon css={styles.dateIcon} />
                      {card.surveyClosingAt}
                    </div>

                    <Typography
                      variant="h5"
                      component="div"
                      css={styles.surveyTitle}
                    >
                      {card.surveyTitle}
                    </Typography>
                    {/* 태그 등 카드에 관한 내용 표시 */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ marginTop: '30px' }}
                    >
                      {card.tagName.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          css={styles.tagChip}
                          sx={{
                            backgroundColor: tagColor(tag),
                          }}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          ))}
      </div>

      {openModal && selectedCard && (
        <MainModal
          openModal={openModal}
          closeCardModal={closeCardModal}
          selectedCard={selectedCard}
        />
      )}
    </Box>
  );
}
