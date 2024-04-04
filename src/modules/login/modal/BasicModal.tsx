import * as React from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Avatar, Container, Input, InputLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import RadioButton from '../components/RowRadioButtonsGroup';
import InputNickName from '../components/NameInput';
import GetBirth from '../components/BasicDatePicker';
import StyledButton from '../components/StyledButton';

import axios from '../components/customApi';
import { imageUploadToS3 } from '../../utils/ImageUploadUtil';

interface UserInfo {
  userBirth: string;
  userNickname: string;
  userGender: string;
  userImage?: string | null;
  isNicknameCheckedOnChange: boolean;
  isOverLimitCheckedOnChange: boolean;
  isRegexCheckCheckedOnChange: boolean;
}

/**
 * 최초 로그인 시 프로필 입력 받는 모달
 * @author 김선규
 * @param param0
 * @returns
 */
export default function BasicModal() {
  const navigate = useNavigate();

  const customStyles = `
    .swal-custom-popup {
      z-index: 1500; // 필요한 z-index 값
    }
    .swal-custom-container {
      z-index: 1500; // 필요한 z-index 값
    }
  `;

  const [open, setOpen] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userNickname: '',
    userGender: '',
    userBirth: '',
    userImage: null,
    isNicknameCheckedOnChange: false,
    isOverLimitCheckedOnChange: false,
    isRegexCheckCheckedOnChange: false,
  });
  const [selectedImage, setSelectedImage] = useState<string>('');

  const fontFamily = 'GmarketSansMedium';

  const textStyle = {
    fontFamily,
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadFile = event.target.files && event.target.files[0];
    if (uploadFile) {
      const imageUrlString: string = URL.createObjectURL(uploadFile);
      setSelectedImage(imageUrlString);

      try {
        const imageUrl = await imageUploadToS3(uploadFile);
        setUserInfo({ ...userInfo, userImage: imageUrl });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleNickNameChange = (
    value: string,
    isChecked: boolean,
    isOverLimitChecked: boolean,
    isRegexCheckChecked: boolean
  ) => {
    setUserInfo({
      ...userInfo,
      userNickname: value,
      isNicknameCheckedOnChange: isChecked,
      isOverLimitCheckedOnChange: isOverLimitChecked,
      isRegexCheckCheckedOnChange: isRegexCheckChecked,
    });
  };

  const handleRadioChange = (value: string) => {
    setUserInfo({ ...userInfo, userGender: value });
  };

  const handleBirthChange = (value: string) => {
    setUserInfo({ ...userInfo, userBirth: value });
  };

  const handleClose = () => {
    localStorage.removeItem('userNo');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userImage');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('isMember');
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (userInfo.isNicknameCheckedOnChange !== true) {
      Swal.fire({
        icon: 'error',
        title: '닉네임 중복체크 해주세요!',
        customClass: {
          popup: 'swal-custom-popup',
          container: 'swal-custom-container',
        },
      });
      return;
    }

    if (userInfo.isOverLimitCheckedOnChange === true) {
      Swal.fire({
        icon: 'error',
        title: '닉네임은 16자 이내로 해주세요!',
        customClass: {
          popup: 'swal-custom-popup',
          container: 'swal-custom-container',
        },
      });
      return;
    }

    if (userInfo.userGender === '') {
      Swal.fire({
        icon: 'error',
        title: '성별을 선택해주세요!',
        customClass: {
          popup: 'swal-custom-popup',
          container: 'swal-custom-container',
        },
      });
      return;
    }

    if (userInfo.userBirth === '') {
      Swal.fire({
        icon: 'error',
        title: '생년월일을 입력해주세요!',
        customClass: {
          popup: 'swal-custom-popup',
          container: 'swal-custom-container',
        },
      });
      return;
    }

    if (userInfo.userBirth !== '' && userInfo.userGender !== '') {
      const userInfoRegist = {
        userNickname: userInfo.userNickname,
        userBirth: userInfo.userBirth,
        userGender: userInfo.userGender,
        userImage: userInfo.userImage,
      };

      try {
        Swal.fire({
          icon: 'success',
          title: '회원가입에 성공하였습니다',
        });
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/oauthLogin/regist`,
          userInfoRegist,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const respData = response.data;
        if (respData === '') {
          console.error('API 요청 실패');
          return;
        }

        const responseCheck = response;
        const responseUserNo = responseCheck.data.content.userNo;
        const responseAccessToken = responseCheck.data.content.accessToken;
        const responseImage = responseCheck.data.content.userImage;
        const responseNickName = responseCheck.data.content.userNickname;
        const responseExpiresIn = responseCheck.data.content.expiresIn;

        localStorage.setItem('userNo', responseUserNo);
        localStorage.setItem('userNickname', responseNickName);
        localStorage.setItem('userImage', responseImage);
        localStorage.setItem('accessToken', responseAccessToken);
        localStorage.setItem('expiresIn', responseExpiresIn);

        navigate(`/survey/main`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const cancelSubmit = async () => {
    try {
      const userNo = localStorage.getItem('userNo');

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

    localStorage.removeItem('userNo');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresIn');

    handleClose();
  };

  return (
    <Container>
      <style>{customStyles}</style>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            bgcolor: 'background.paper',
            border: '0px solid #000',
            p: 2,
            borderRadius: '10px',
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              padding: '16px',
              justifyContent: 'center',
              textAlign: 'center',
              ...textStyle,
            }}
          >
            필수 추가 정보 입력
          </Typography>

          {!selectedImage && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: '100px',
                borderRadius: '20px',
              }}
            >
              <Avatar
                src={undefined}
                sx={{
                  width: 90,
                  height: 90,
                  backgroundColor: '#747474',
                }}
              />
            </Box>
          )}
          {selectedImage && (
            <div>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  height: '100px',
                  borderRadius: '20px',
                }}
              >
                <Avatar
                  src={selectedImage || undefined}
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#747474',
                  }}
                  id="surveyImage"
                  alt="설문 이미지"
                />
              </Box>
            </div>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50px',
            }}
          >
            <Box
              sx={{
                width: '100px',
                height: '30px',
                borderRadius: '10px',
              }}
            >
              <InputLabel
                htmlFor="input-with-icon-adornment"
                sx={{
                  padding: '3px 0 3px 0',
                  textAlign: 'center',
                  color: '#ffffff',
                  backgroundColor: '#747474',
                  borderRadius: '10px',
                }}
              >
                사진 선택
              </InputLabel>
            </Box>
            <Input
              id="input-with-icon-adornment"
              type="file"
              onChange={handleImageUpload}
              inputProps={{ accept: 'image/*' }}
              style={{
                display: 'none',
              }}
            />
          </Box>

          <InputNickName
            onChange={handleNickNameChange}
            isNicknameCheckedOnChangeCallback={(isChecked) =>
              setUserInfo({
                ...userInfo,
                isNicknameCheckedOnChange: isChecked,
              })
            }
            isOverLimitChecked={(isOverLimitChecked) =>
              setUserInfo({
                ...userInfo,
                isOverLimitCheckedOnChange: isOverLimitChecked,
              })
            }
            isRegexCheckChecked={(isRegexCheckChecked) =>
              setUserInfo({
                ...userInfo,
                isRegexCheckCheckedOnChange: isRegexCheckChecked,
              })
            }
          />
          <RadioButton onChange={handleRadioChange} />
          <GetBirth onChange={handleBirthChange} />

          <Box fontStyle={textStyle}>
            <StyledButton buttonText="회원가입" onClick={handleSubmit} />
            <StyledButton buttonText="취소" onClick={cancelSubmit} />
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
