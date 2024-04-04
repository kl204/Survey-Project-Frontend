import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Backdrop, Button, CircularProgress, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import styled from '@emotion/styled';

import BasicModal from './modal/BasicModal';
import LoginNaver from './LoginNaver';
import axios from './components/customApi';

const basicBox = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  width: '100%',
  height: '100%',

  backgroundImage: `url(${process.env.PUBLIC_URL}/images/loginImage/LoginPageImage3.png)`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const secBasicBox = {
  width: '330px',
  height: '450px',
  padding: '20px 0px 20px 0px ',
  border: '0px solid #747474',
  backgroundColor: 'white',
  borderRadius: '10px',
  opacity: '95%',
  '@media (min-width: 600px)': {
    width: '430px',
    height: '550px',
  },
};

const guestLogin = {
  width: '100%',
  textAlign: 'center',
  color: '#747474',
  '@media (min-width: 600px)': {
    fontSize: '1.3rem',
  },
};

const itemsToRemove = [
  'userNo',
  'accessToken',
  'userNickname',
  'userImage',
  'expiresIn',
  'isMember',
];

const ResponsiveImage = styled.img`
  width: 250px;
  height: 130px;

  @media (min-width: 600px) {
    width: 250px;
    height: auto;
  }
`;

/**
 * 로그인 화면
 * @author 김선규
 * @returns LoginDispay
 */
function LoginDisplay() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const cancelSubmit = async () => {
    const userNo = localStorage.getItem('userNo');
    const userNickname = localStorage.getItem('userNickname');

    setIsLoading(true);

    if (userNo !== '' && userNickname === '') {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/oauthLogin/cancel`,
          {
            params: {
              userNo,
            },
          }
        );

        const respData = response.data;
        if (respData === '') {
          console.error('API 요청 실패');
          return;
        }
      } catch (error) {
        console.error(error);
      }

      itemsToRemove.push('accessCode');
      itemsToRemove.forEach((item) => localStorage.removeItem(item));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    itemsToRemove.forEach((item) => localStorage.removeItem(item));

    const localStorageAccessToken = localStorage.getItem('accessToken');
    const searchParams = new URLSearchParams(location.search);
    const redirectUri = `${process.env.REACT_APP_BASE_URL}/api/oauthLogin/oauth2/code/naver`;

    const accessCode = searchParams.get('code');
    const duplicateAccessCode = localStorage.getItem('accessCode');

    const accessCodeDuplicateCheck = () => {
      let duplicatedCheck = false;
      if (duplicateAccessCode !== accessCode) {
        duplicatedCheck = true;
      }

      return duplicatedCheck;
    };

    const loginLogin = async () => {
      if (accessCode && accessCodeDuplicateCheck()) {
        setIsLoading(true);

        await axios
          .get(redirectUri, {
            params: {
              code: accessCode,
              state: 'STATE_STRING',
            },
          })
          .then((response) => {
            const { userNo, accessToken, userImage, userNickname, expiresIn } =
              response.data.content;

            localStorage.setItem('accessCode', accessCode);
            localStorage.setItem('userNo', userNo);
            localStorage.setItem('userNickname', userNickname);
            localStorage.setItem('userImage', userImage);
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('expiresIn', expiresIn);

            if (userNo != null && userNickname != null) {
              if (
                localStorageAccessToken == null ||
                accessToken !== localStorageAccessToken
              ) {
                localStorage.setItem('userNo', userNo);
                localStorage.setItem('userNickname', userNickname);
                localStorage.setItem('userImage', userImage);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('expiresIn', expiresIn);

                axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

                navigate('/survey/main');
                return;
              }

              if (expiresIn) {
                localStorage.setItem('userNo', userNo);
                localStorage.setItem('userNickname', userNickname);
                localStorage.setItem('userImage', userImage);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('expiresIn', expiresIn);
              }
              navigate('/survey/main');

              if (accessToken === localStorageAccessToken) {
                axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                navigate('/survey/main');
              } else {
                itemsToRemove.forEach((item) => localStorage.removeItem(item));

                navigate('/login');
              }
            }

            if (userNo != null && !userNickname) {
              localStorage.setItem('userNo', userNo);
              localStorage.setItem('userNickname', userNickname);
              localStorage.setItem('userImage', userImage);
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('expiresIn', expiresIn);

              axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

              setShowModal(true);
            }

            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(true);
            console.error('Error : ', error);
          });
      } else {
        setIsLoading(true);
        cancelSubmit();
        navigate('/login');
      }
    };

    loginLogin();
  }, []);

  const goLogin = () => {
    setIsLoading(true);
    navigate('/survey/main');
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box sx={basicBox}>
      <Box sx={secBasicBox}>
        <Box
          sx={{
            textAlign: 'center',
            padding: '30px 0 20px 0',
          }}
        >
          <ResponsiveImage
            src={`${process.env.PUBLIC_URL}/images/surveyLogo/logoplus.png`}
            alt="not Logo"
          />
        </Box>
        <Typography
          variant="h1"
          sx={{
            textAlign: 'center',
            margin: '20px 0 20px 0',
            fontSize: '1rem',
            color: '#747474',
            fontWeight: 'bold',
            '@media (min-width: 600px)': {
              fontSize: '1.5rem',
            },
          }}
        >
          설문의 새로운 경험
        </Typography>
        <Box sx={{ padding: '20px 0 20px 0' }}>
          <LoginNaver />
        </Box>
        {showModal && <BasicModal />}
        <Box sx={{ padding: '20px 0 20px 0' }}>
          <Typography
            variant="h2"
            sx={{
              padding: '10px 0 10px 0',
              fontSize: '1rem',
              position: 'relative',
              fontWeight: 'bold',
              textAlign: 'center',
              '@media (min-width: 600px)': {
                fontSize: '1.5rem',
              },
            }}
          >
            Nice to See you Again
          </Typography>
          <Button sx={guestLogin} onClick={goLogin}>
            비회원으로 로그인
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginDisplay;
