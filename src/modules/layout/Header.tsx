/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '../../global.css';
import Menu from './Menu';
import Cookies from 'js-cookie';

import axios from '../login/components/customApi';

const ANCHOR_TYPE = 'left';

const StyledButton = styled.button`
  background-color: #ffffff;
  border: 0px solid #000;
  border-radius: 3px;
  background-size: cover;
  background-position: center;
  width: 60px;
  height: 20px;
  cursor: pointer;

  @media (max-width: 600px) {
    width: 50px;
    height: 20px;
  }
`;

const styles = {
  box: css({ flexGrow: 1, display: 'center', alignItems: 'flex-end' }),
  logostyle: css({
    maxWidth: '125px',
    maxHeight: '110px',
    display: 'center',
    justifyItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  }),
  headerStyle: css({
    backgroundColor: '#FFFFFF',
    boxShadow: 'none',
    height: '110px',
    marginBottom: '0',
  }),
  toolbar: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
    height: '60px',
    marginTop: '15px',
  }),
  menu: css({
    color: '#272727',
    marginTop: '15px',
  }),
  logoImage: css({
    width: '100%',
    height: 'auto',
    color: '#000000',
    marginLeft: '10px',
    marginTop: '20px',
  }),
  loginout: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '15px',
  }),
};

/**
 * 웹 애플리케이션의 헤더 컴포넌트입니다.
 */
function Header() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const [hasProperLogin, setHasProperLogin] = useState(false);

  useEffect(() => {
    const Authorization = Cookies.get('loginSession');
    const isLoggedIn = Authorization !== undefined || Authorization !== null;

    console.log('check : ' + isLoggedIn);
    setHasProperLogin(isLoggedIn);
  }, []);

  /**
   * 메인 페이지로 이동하는 함수
   */
  const goMain = () => {
    navigate('/');
  };

  /**
   * 로그인 페이지로 이동하는 함수
   * @author 김선규
   */
  const login = () => {
    console.log('login');

    navigate('/login');
  };

  const logout = async () => {
    console.log('logout');

    try {
      await axios.get(`${process.env.REACT_APP_BASE_URL}/api/oauth2/logout`, {
        withCredentials: true,
      });

      setHasProperLogin(false);
    } catch (error) {
      console.error(error);
    }

    navigate('/');
  };

  /**
   * 현재 사용자가 로그인 상태인지 확인하는 함수
   * @returns {boolean} 로그인 상태 여부
   */

  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setIsOpenDrawer(open);
    };

  return (
    <Box css={styles.box} height={90}>
      <AppBar position="static" css={styles.headerStyle}>
        <Toolbar css={styles.toolbar}>
          <IconButton
            css={styles.menu}
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            {hasProperLogin === false ? '' : <MenuIcon />}
          </IconButton>

          <React.Fragment key={ANCHOR_TYPE}>
            <Drawer
              anchor={ANCHOR_TYPE}
              open={isOpenDrawer}
              onClose={toggleDrawer(false)}
            >
              <Menu toggleDrawer={toggleDrawer} />
            </Drawer>
          </React.Fragment>
          <div css={styles.logostyle}>
            <img
              src={`${process.env.PUBLIC_URL}/images/surveyLogo/logoplus.png`}
              alt="로고"
              css={styles.logoImage}
              onClick={goMain}
              onKeyDown={goMain}
              role="presentation"
            />
          </div>
          <div css={styles.loginout}>
            {hasProperLogin === false ? (
              <StyledButton
                type="button"
                onClick={login}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}/images/loginImage/loginbutton.png)`,
                }}
              >
                {}
              </StyledButton>
            ) : (
              <StyledButton
                type="button"
                onClick={logout}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}/images/loginImage/logoutbutton.png)`,
                }}
              >
                {}
              </StyledButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
