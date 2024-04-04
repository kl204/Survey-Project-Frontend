/** @jsxImportSource @emotion/react */

import {
  AppBar,
  Box,
  Dialog,
  Fab,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TransitionProps } from '@mui/material/transitions';
import { css } from '@emotion/react';
import SurveyPreview from '../../preview/routers/SurveyPreview';
import { FloatingActionButtonsProps } from '../types/SurveyTypes';
import '../../../../global.css';

const styles = {
  fabBox: css({
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: '1',
  }),

  fabStyles: css({
    width: '44px',
    height: '44px',
    marginBottom: '8px',
    color: 'white',
    backgroundColor: '#3e3e3e',
    '&:hover': {
      backgroundColor: '#6C6B6B',
    },
  }),

  appBar: css({
    position: 'relative',
    paddingRight: 0,
    backgroundColor: '#3e3e3e',
  }),

  previewTitle: css({
    ml: 2,
    flex: 1,
    textAlign: 'center',
  }),

  iconButton: css({
    backgroundColor: '#3e3e3e',
  }),

  closeIcon: css({
    color: '#ffffff',
  }),
};
const fontFamily = 'GmarketSansMedium';

const textStyle = {
  fontFamily,
};
const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

Transition.displayName = 'previewDialogTransition';

/**
 * 설문조사 작성 페이지 플로팅 버튼 컴포넌트 입니다.
 *
 * @component
 * @param onClickAddQuestion 설문 문항을 추가하는 메서드 입니다.
 * @returns 설문조사 작성 플로팅 버튼
 * @author 강명관
 */
function FloatingActionButtons({
  onClickAddQuestion,
  surveyInfo,
  questions,
}: FloatingActionButtonsProps) {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  /**
   * 화면의 스크롤을 최상단으로 보내는 메서드 입니다.
   *
   * @author 강명관
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 화면의 스크롤을 최하단으로 보내는 메서드 입니다.
   *
   * @author 강명관
   */
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  /**
   * 플로팅 버튼으로 문항을 추가하고, 스크롤을 최하단으로 보내는 메서드 입니다.
   *
   * @author 강명관
   */
  const handleAddQuestion = () => {
    scrollToBottom();
    onClickAddQuestion();
  };

  const handleOpenPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  return (
    <Box css={styles.fabBox}>
      <Fab aria-label="add" css={styles.fabStyles} onClick={scrollToTop}>
        <ArrowDropUpIcon />
      </Fab>
      <Fab aria-label="add" css={styles.fabStyles} onClick={scrollToBottom}>
        <ArrowDropDownIcon />
      </Fab>
      <Fab aria-label="add" css={styles.fabStyles} onClick={handleAddQuestion}>
        <AddIcon />
      </Fab>
      <Fab
        aria-label="add"
        css={styles.fabStyles}
        onClick={handleOpenPreviewModal}
      >
        <VisibilityIcon />
      </Fab>

      <Dialog
        fullScreen
        open={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
        TransitionComponent={Transition}
      >
        <AppBar css={styles.appBar}>
          <Toolbar>
            <Typography
              css={styles.previewTitle}
              fontStyle={textStyle}
              variant="h6"
              component="div"
            >
              미리보기
            </Typography>
            <IconButton
              edge="start"
              css={styles.iconButton}
              onClick={handleClosePreviewModal}
              aria-label="close"
            >
              <CloseIcon css={styles.closeIcon} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <SurveyPreview surveyInfo={surveyInfo} questions={questions} />
      </Dialog>
    </Box>
  );
}

export default FloatingActionButtons;
