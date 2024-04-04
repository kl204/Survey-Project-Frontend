import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import '../../../../global.css';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  CardActionArea,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import '../components/Modal.css';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import InputBase from '@mui/material/InputBase';
import FaceIcon from '@mui/icons-material/Face';
import { Container } from '@mui/system';
import axios from '../../../login/components/customApi';
import Floating from '../components/Floating';
import MainModal from '../components/MainModal';

type CardData = {
  surveyNo: number;
  surveyTitle: string;
  surveyDescription: string;
  surveyImage: string;
  surveyPostAt: string;
  surveyClosingAt: string;
  userNo: number;
  userNickName: string;
  userImage: string;
  attendUserNo: Array<number>;
  surveyStatusName: string;
  openStatusName: string;
  tagName: string[];
  surveyAttendCount: number;
  isDeleted: boolean;
  attendCheckList: boolean[];
};

function SurveySearch() {
  const customStyles = `
    .swal-custom-popup {
      z-index: 1500; // 필요한 z-index 값
    }
    .swal-custom-container {
      z-index: 1500; // 필요한 z-index 값
    }
  `;

  const [searchWord, setSearchWord] = useState<string>('');
  const [filteredData, setFilteredData] = useState<CardData[]>([]);
  const [selectedState, setSelectedState] = useState<string>('전체(모든 카드)');
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [searching, setSearching] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchData, setSearchData] = useState<CardData[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [surveyLoaded, setSurveyLoaded] = useState(false);

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

  const fontFamily = 'nanumsquare';
  const contentFont = 'GmarketSansMedium';
  const textStyle = {
    fontFamily,
    contentFont,
  };

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const next = () => {
    setPage(page + 1);
  };

  async function fetchSurveyAll() {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/surveys/surveyall?page=${page}`
    );
    setSurveyLoaded(true);
    if (response.data.length === 0) {
      setHasMore(false);
      return;
    }

    if (page === 0) {
      setFilteredData(response.data);
    } else {
      setFilteredData((prevData) => [...prevData, ...response.data]);
    }
  }

  async function fetchSurveyInProgress() {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/surveys/select-post?page=${page}`
    );
    setSurveyLoaded(true);

    if (response.data.length === 0) {
      setHasMore(false);
      return;
    }

    if (page === 0) {
      setFilteredData(response.data);
    } else {
      setFilteredData((prevData) => [...prevData, ...response.data]);
    }
  }

  async function fetchSurveyClosed() {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/surveys/select-closing?page=${page}`
    );
    setSurveyLoaded(true);

    if (response.data.length === 0) {
      if (page === 0) {
        setFilteredData([]);
      }
      setHasMore(false);
      return;
    }
    if (page === 0) {
      setFilteredData(response.data);
    } else {
      setFilteredData((prevData) => [...prevData, ...response.data]);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (searching) {
        return;
      }
      if (selectedState === '전체(모든 카드)') {
        fetchSurveyAll();
      } else if (selectedState === '진행') {
        fetchSurveyInProgress();
      } else if (selectedState === '마감') {
        fetchSurveyClosed();
      }
    };
    setHasMore(true);

    fetchData();
  }, [page, selectedState, searching]);

  const removePage = () => {
    setPage(0);
    setHasMore(false);
  };

  const selectStatus = () => {
    setSearch('');
    removePage();
  };

  const openCardModal = (card: CardData) => {
    setSelectedCard(card);
    setOpenModal(true);
  };

  const closeCardModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };

  const tagColor = (tag: string) => {
    switch (tag) {
      case '공지':
        return '#F8E5E5';
      case '중요':
        return '#F5F9DE';
      case '업무':
        return '#F9ECDF';
      case '기타':
        return '#E5ECF5';
      case '일상':
        return '#EDEBF6';
      default:
        return 'default';
    }
  };

  async function fetchSearchSurvey(test: string) {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/surveys/search?searchWord=${test}`
    );
    setSurveyLoaded(true);

    const statusFilter = response.data.filter((survey: CardData) => {
      if (selectedState === '전체(모든 카드)') {
        return true;
      }
      if (selectedState === '진행') {
        return survey.surveyStatusName === '진행';
      }
      if (selectedState === '마감') {
        return survey.surveyStatusName === '마감';
      }

      return true;
    });

    if (response === null) {
      setSearchData(statusFilter);
    }

    setSearchData(statusFilter);

    setSearching(false);
  }

  const handleSearch = (test: string) => {
    removePage();
    setSearchWord(search);
    setSearchButtonClicked(true);
    fetchSearchSurvey(test);
  };

  useEffect(() => {}, [searchWord, searchButtonClicked]);

  useEffect(() => {
    setFilteredData(searchData);
  }, [searchData]);

  const resetData = async () => {
    setPage(0);
    setHasMore(true);
    setSearch('');

    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/surveys/surveyall?page=0`
    );

    if (response.data.length === 0) {
      setHasMore(false);
      return;
    }

    const sortedCardData = [...response.data].sort((a, b) => {
      const dateA = new Date(a.surveyPostAt);
      const dateB = new Date(b.surveyPostAt);

      if (dateA === dateB) {
        return 0;
      }
      return dateA > dateB ? -1 : 1;
    });

    setFilteredData(sortedCardData);
  };

  if (!surveyLoaded) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!surveyLoaded}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div>
      <style>{customStyles}</style>
      <Container
        sx={{
          marginTop: '60px',
          '@media (max-width: 600px)': {
            marginTop: '30px',
          },
        }}
      >
        <Typography
          component="div"
          sx={{
            marginTop: '30px',
            fontSize: 30,
            fontWeight: 600,
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            fontFamily: contentFont,
            '@media (max-width: 600px)': {
              fontSize: 24,
            },
          }}
        >
          전체 설문
        </Typography>
        {/* 검색어 입력란 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '35px',
            marginBottom: '20px',
          }}
        >
          <Select
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value as string)}
            inputProps={{
              'aria-label': '상태 선택',
            }}
            sx={{
              height: '35px',
              borderColor: '#747474',
              borderRadius: '5px',
              color: '#3e3e3e',
              marginRight: '10px',
            }}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            }}
          >
            <MenuItem
              style={textStyle}
              value="전체(모든 카드)"
              onClick={selectStatus}
              sx={{ fontStyle: textStyle.fontFamily }}
            >
              전체
            </MenuItem>
            <MenuItem style={textStyle} value="진행" onClick={selectStatus}>
              진행
            </MenuItem>
            <MenuItem style={textStyle} value="마감" onClick={selectStatus}>
              마감
            </MenuItem>
          </Select>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 400,
              height: '35px',
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, height: '35px' }}
              placeholder="제목, 태그를 입력해주세요"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(search);
                }
              }}
            />
            <IconButton
              type="button"
              sx={{
                p: '10px',
                '&:hover': {
                  backgroundColor: '#747474',
                  color: '#FFFFFF',
                },
              }}
              aria-label="search"
              onClick={() => handleSearch(search)}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '15px',
            marginTop: '15px',
          }}
        >
          <Button
            variant="outlined"
            sx={{
              height: '35px',
              border: 1,
              borderColor: '#c5c5c5',
              color: '#3e3e3e',
              borderRadius: '5px',
              width: '75px',
              fontSize: '15px',
              padding: 0,
              '&:hover': {
                backgroundColor: '#747474',
                borderColor: '#3E3E3E',
                color: '#ffffff',
              },
            }}
            onClick={() => {
              setSearchWord('');
              removePage();
              setSelectedState('전체(모든 카드)');
              resetData();
            }}
          >
            초기화
          </Button>
        </div>
        {filteredData.length !== 0 ? (
          <InfiniteScroll
            dataLength={filteredData.length}
            next={next}
            hasMore={hasMore}
            loader={null}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                gap: '10px',
                height: '100%',

                marginBottom: '5px',
              }}
            >
              {filteredData.map((card) => (
                <div
                  key={card.surveyNo}
                  onClick={() => openCardModal(card)}
                  onKeyPress={() => openCardModal(card)}
                  role="button"
                  tabIndex={0}
                >
                  {/* 카드를 클릭하면 해당 카드 정보를 전달하여 모달 열기 */}

                  <Card
                    sx={{
                      width: '264px',
                      borderRadius: 4,
                      '@media (max-width: 600px)': {
                        width: '163px',
                      },
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
                          width: '264px',
                          '@media (max-width: 600px)': {
                            height: 0,
                            maxWidth: '163px',
                          },
                        }}
                        image={card.surveyImage}
                        alt="survey image"
                      />

                      <CardContent
                        sx={{
                          padding: '10px',
                          justifyContent: 'space-between',
                        }}
                      >
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
                              boxShadow: 'inset 0px 0px 3px rgba(0, 0, 0, 0.3)',
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
                        {/* 카드 내용 */}
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
                            height: '47px',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                          style={textStyle}
                        >
                          {card.surveyTitle}
                        </Typography>
                        {/* 작성자 표시 */}
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: 11,
                            '& > span:not(:last-child)': {
                              marginRight: '8px',
                            },
                          }}
                        />
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
                              }}
                            />
                          ))}
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </div>
              ))}
            </Box>
          </InfiniteScroll>
        ) : (
          <Typography
            variant="h5"
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            검색결과가 없습니다🥲
          </Typography>
        )}
      </Container>

      {openModal && selectedCard && (
        <MainModal
          openModal={openModal}
          closeCardModal={closeCardModal}
          selectedCard={selectedCard}
        />
      )}

      <Floating />
    </div>
  );
}

export default SurveySearch;
