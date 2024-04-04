/** @jsxImportSource @emotion/react */

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './Modal.css';
import FaceIcon from '@mui/icons-material/Face';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  CardActionArea,
} from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import '../../../../global.css';
import { CardDataListProps, CardDataProps } from '../types/MainType';
import MainModal from './MainModal';
import { swiperParams, tagColor } from '../constant/MainConstant';

const customStyles = `
    .swal-custom-popup {
      z-index: 1500; // 필요한 z-index 값
    }
    .swal-custom-container {
      z-index: 1500; // 필요한 z-index 값
    }
  `;

const styles = {
  CardSwiper: {
    width: '100%',
    height: '100%',
  },
  slide: {
    width: '100%',
    height: '400px',
  },
};
const fontFamily = 'nanumsquare';
const textStyle = {
  fontFamily,
  textOverflow: 'ellipsis',
};

function RecentSurvey({ cardList }: CardDataListProps) {
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

  return (
    <div>
      <div>
        <style>{customStyles}</style>
        <Box
          sx={{
            height: '400px',
            '@media (max-width: 600px)': {
              height: '200px',
            },
          }}
        >
          <Swiper style={styles.CardSwiper} {...swiperParams}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                height: '100%',
                alignItems: 'center',
              }}
            >
              {cardList &&
                cardList.map((card) => (
                  <div key={card.surveyNo}>
                    {/* 카드를 클릭하면 해당 카드 정보를 전달하여 모달 열기 */}
                    <SwiperSlide
                      key={`slide_${card.surveyNo}`}
                      style={styles.slide}
                    >
                      <Card
                        sx={{
                          maxWidth: 345,
                          borderRadius: 4,
                          marginLeft: '2px',
                          marginTop: '2px',
                        }}
                      >
                        <CardActionArea onClick={() => openCardModal(card)}>
                          <CardMedia
                            component="img"
                            sx={{
                              display: 'flex',
                              height: '150px',
                              width: '274px',
                              '@media (max-width: 600px)': {
                                height: 0,
                                width: '156px',
                              },
                            }}
                            image={card.surveyImage}
                            alt="survey image"
                          />
                          <CardContent
                            sx={{
                              justifyContent: 'space-between',
                            }}
                          >
                            {/* 카드 내용 */}
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="space-between"
                              paddingBottom="12px"
                            >
                              <Chip
                                label={card.surveyAttendCount}
                                sx={{
                                  fontSize: '12px',
                                  width: '60px',
                                  height: '20px',
                                  fontWeight: 600,
                                  justifyContent: 'space-between',
                                  backgroundColor: '#F9F9F9',
                                  boxShadow:
                                    'inset 0px 0px 3px rgba(0, 0, 0, 0.3)',
                                }}
                                style={textStyle}
                                icon={
                                  <FaceIcon
                                    sx={{
                                      fontSize: '15px',
                                    }}
                                  />
                                }
                              />

                              <Chip
                                label={card.surveyStatusName}
                                variant="outlined"
                                sx={{
                                  width: '40px',
                                  height: '20px',
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  '& .MuiChip-label': {
                                    padding: 0,
                                  },
                                  backgroundColor: '#F9F9F9',

                                  color: getChipColor(card.surveyStatusName),
                                }}
                                style={textStyle}
                              />
                            </Stack>
                            {/* </Stack> */}

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'stretch',
                                fontSize: 12,
                                color: 'text.secondary',
                                fontWeight: 600,
                                marginBottom: '5px',
                                fontFamily,
                              }}
                            >
                              <EventAvailableIcon
                                sx={{
                                  fontSize: '15px',
                                  marginRight: '4px',
                                }}
                              />
                              {card.surveyClosingAt}
                            </div>

                            <Typography
                              variant="h5"
                              component="div"
                              sx={{
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
                              }}
                              style={textStyle}
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
                                  style={textStyle}
                                  sx={{
                                    fontSize: 11,
                                    marginRight: 1,
                                    height: '20px',
                                    backgroundColor: tagColor(tag),
                                    // opacity: 0.7,
                                  }}
                                />
                              ))}
                            </Stack>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </SwiperSlide>
                  </div>
                ))}
            </Box>
          </Swiper>
        </Box>

        {openModal && selectedCard && (
          <MainModal
            openModal={openModal}
            closeCardModal={closeCardModal}
            selectedCard={selectedCard}
          />
        )}
      </div>
    </div>
  );
}

export default RecentSurvey;
