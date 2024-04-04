import React from 'react';
import { Box, Toolbar, Divider, Typography } from '@mui/material';

/**
 * Layout의 Footer 입니다
 * @returns Footer
 */
function Footer() {
  return (
    <div>
      <Divider sx={{ marginTop: '70px' }} />
      <Box
        sx={{
          position: 'static',
          display: 'flex',
          bottom: 0,
          width: '100%',
          height: '180px',
          justifyContent: 'center',
          zIndex: 1000,
          alignItems: 'center',
        }}
        color="D3D4F5"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            opacity: '0.7',
            gap: '100px',
            '@media (max-width: 600px)': {
              paddingRight: '10px',
              flexDirection: 'column',
              gap: '20px',
            },
            paddingRight: '100px',
          }}
        >
          <Typography
            onClick={() =>
              window.open('https://github.com/1Jo-Survey-Management')
            }
            sx={{
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            GitHub
          </Typography>
        </Box>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              opacity: '0.7',
              paddingLeft: '24px',
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/surveyLogo/footerlogo.png`}
              alt="로고"
              style={{
                width: '130px',
                height: 'auto',

                marginLeft: '10px',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '15px',
                alignItems: 'center',
                width: '150px',
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/footer/github.png`}
                alt="github"
                style={{
                  width: '25px',
                  height: '25px',
                }}
              />
              <img
                src={`${process.env.PUBLIC_URL}/images/footer/erd.png`}
                alt="github"
                style={{
                  width: '32px',
                  height: '32px',
                }}
              />
            </Box>
          </Box>
        </Toolbar>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            opacity: '0.7',
            gap: '100px',
            '@media (max-width: 600px)': {
              paddingLeft: '10px',
              flexDirection: 'column',
              gap: '20px',
            },
            paddingLeft: '100px',
          }}
        >
          <Typography
            onClick={() =>
              window.open('https://www.erdcloud.com/d/hTYqPxP3ikyJCKt5F')
            }
            sx={{
              '&:hover': {
                cursor: 'pointer',
              },
              justifyContent: 'flex-end',
            }}
          >
            ERD Cloud
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default Footer;
