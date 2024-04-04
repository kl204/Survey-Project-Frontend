/** @jsxImportSource @emotion/react */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import Swal from 'sweetalert2';
import { css } from '@emotion/react';

export default function FloatingActionButtons() {
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleAddClick = () => {
    // const loginUserNo = localStorage.getItem('userNo');
    // if (!loginUserNo) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: '설문 작성을 하시려면 로그인 해주세요.',
    //   });
    //   return;
    // }
    navigate('/survey/register');
  };

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
  };

  return (
    <Box css={styles.fabBox}>
      <Fab css={styles.fabStyles} aria-label="pageup" onClick={scrollToTop}>
        <ArrowDropUpIcon />
      </Fab>
      <Fab
        css={styles.fabStyles}
        aria-label="pagedown"
        onClick={scrollToBottom}
      >
        <ArrowDropDownIcon />
      </Fab>
      <Fab css={styles.fabStyles} onClick={handleAddClick}>
        <AddIcon />
      </Fab>
    </Box>
  );
}
