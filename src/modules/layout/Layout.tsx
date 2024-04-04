import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

/**
 * 페이지의 Header, Body, Footer를 모아놓은 Layout 입니다.
 * @returns Header,Body,Footer
 */
export default function Layout() {
  const backStyle = {
    backgroundColor: '#FFFFFF',
  };

  return (
    <div style={backStyle}>
      <CssBaseline />

      <Header />
      <Container
        sx={{
          backgroundColor: '#FFFFFF',
          minHeight: '800px',
          minWidth: '375px',
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}
