import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import FaceIcon from '@mui/icons-material/Face';
import './Modal.css';
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
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import '../../../../global.css';
import { CardDataListProps, CardDataProps } from '../types/MainType';
import MainModal from './MainModal';
import { swiperParams, tagColor } from '../constant/MainConstant';

const styles = {
  CardSwiper: {
    width: '100%',
    height: '100%',
  },
  slide: {
    width: '100%',
    height: '400px',
  },
  slideNoImage: {
    width: '100%',
    height: 'auto',
  },
};

const fontFamily = 'nanumsquare';

const textStyle = {
  fontFamily,
  textOverflow: 'ellipsis',
};

function ClosingSurvey({ cardList }: CardDataListProps) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardDataProps | null>(null);

  const getChipColor = (surveyStatusName: string) => {
    switch (surveyStatusName) {
      case '진행':
        return '#7F81B4';
      case '작성':
        return 'secondary';
      default:
        return '#D7D3D3';
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
                  <div
                    key={card.surveyNo}
                    onClick={() => setOpenModal(true)}
                    onKeyPress={() => openCardModal(card)}
                    role="button"
                    tabIndex={0}
                  >
                    <SwiperSlide
                      key={`slide_${card.surveyNo}`}
                      style={
                        window.innerWidth <= 600
                          ? styles.slideNoImage
                          : styles.slide
                      }
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
                              padding: '8px',
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
                                  color: '#D7D3D3',
                                  width: '60px',
                                  height: '20px',
                                  fontWeight: 600,
                                  justifyContent: 'space-between',
                                  backgroundColor: '#FFFDF8',
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
                                  backgroundColor: '#FFFDF8',
                                  color: getChipColor(card.surveyStatusName),
                                }}
                                style={textStyle}
                              />
                            </Stack>

                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'stretch',
                                fontSize: 12,
                                color: '#8B8B8B',
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
                                color: '#8B8B8B',
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
                                    opacity: 0.7,
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

export default ClosingSurvey;
