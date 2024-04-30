import { Box } from '@mui/material';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

/**
 * 네이버 OAuth 로그인
 * @author 김선규
 * @returns 네이버 로그인 버튼
 */
function LoginNaver() {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const handleOAuthLogin = () => {
    const authorizationUrl = `${process.env.REACT_APP_BASE_URL}/oauth2/authorization/naver`;
    window.location.href = authorizationUrl;

    // navigate('/');
  };

  const StyledButton = styled.button`
    background-color: #ffffff;
    border: 0px solid #000;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    width: 180px;
    height: 45px;
    cursor: pointer;

    @media (min-width: 600px) {
      width: 300px;
      height: 70px;
    }
  `;

  const getImageSrc = () =>
    isHovered
      ? `${process.env.PUBLIC_URL}/naverhover.png`
      : `${process.env.PUBLIC_URL}/naverButton.png`;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <StyledButton
        type="button"
        onClick={handleOAuthLogin}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ backgroundImage: `url(${getImageSrc()})` }}
      >
        {}
      </StyledButton>
    </Box>
  );
}

export default LoginNaver;
