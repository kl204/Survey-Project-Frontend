/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 사용자 정보 수정 페이지를 위한 컴포넌트입니다. 사용자는 자신의 프로필 이미지와 닉네임을 수정할 수 있습니다.
 *
 * @returns {React.ReactElement} 사용자 정보 수정 페이지 컴포넌트를 렌더링하는 React 엘리먼트
 * @author 박창우
 */
import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, FormHelperText } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { imageUploadToS3 } from '../../../utils/ImageUploadUtil';
import axios from '../../../login/components/customApi';

function MypageUserModify() {
  const nicknameRegex = /^[A-Za-z0-9가-힣]{2,16}$/;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>();
  const [previousImage, setPreviousImage] = useState<string>('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nicknameCheckResult, setNicknameCheckResult] = useState<string | null>(
    ''
  );
  const fontFamily = 'GmarketSansMedium';

  const textStyle = {
    fontFamily,
  };

  const [isNicknameEmpty, setIsNicknameEmpty] = useState(true);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isOverLimit, setIsOverLimit] = useState(false);

  const [userData, setUserData] = useState({
    userNo: null,
    userNickname: '',
    userImage: '',
  });

  const navigate = useNavigate();

  // 기존의 useEffect 내부 로직을 수정하여 사용자의 현재 이미지를 불러옵니다.
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users/user-info`
        );

        if (response.status === 200) {
          const { userNickname, userImage, userNo } = response.data;
          setUserData({ userNickname, userImage, userNo });
          setImagePreview(userImage); // 사용자의 현재 이미지 URL을 미리보기에 설정
          setPreviousImage(userImage); // 이전 이미지 URL을 저장
        }
      } catch (error) {
        console.error('유저 정보 불러오기 오류: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  /**
   * 이전 페이지로 돌아가는 함수입니다.
   * 취소 버튼을 클릭하면 실행됩니다.
   */
  const goBack = () => {
    navigate('/survey/main');
  };

  /**
   * 사용자가 파일 선택 입력란에서 파일을 선택했을 때 호출되는 이벤트 핸들러입니다.
   * 선택된 이미지 파일을 상태에 설정하고 미리보기 URL을 생성합니다.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - 파일 선택 이벤트
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /**
   * 파일 선택 입력란을 열어 사용자가 이미지 파일을 선택할 수 있도록 합니다.
   */
  const openFileInput = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  // 이미지 업로드 로직을 검토
  const uploadImage = async () => {
    if (selectedFile && userData.userNo) {
      try {
        // S3에 이미지 업로드 및 URL 반환
        const s3ImageUrl = await imageUploadToS3(selectedFile);
        if (!s3ImageUrl) {
          throw new Error('Failed to upload image to S3');
        }

        // 헤더에 이전 이미지 URL 포함
        const headers = {
          'X-Previous-Image-URL': previousImage,
        };

        // 백엔드에 이미지 URL 업데이트 요청
        await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/users/image`,
          {
            userImage: s3ImageUrl,
          },
          { headers }
        );

        setImagePreview(s3ImageUrl); // 업로드된 이미지의 URL을 미리보기에 설정
        Swal.fire({
          icon: 'success',
          title: '이미지가 성공적으로 수정되었습니다!',
        });
        setSelectedFile(null);
        setPreviousImage(s3ImageUrl);
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
        Swal.fire({
          icon: 'error',
          title: '이미지 업로드 실패',
        });
      }
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // 입력된 값이 없을 경우, 검사를 중지하고 필요한 상태를 초기화
    if (value.trim() === '') {
      setNickname(value);
      setIsNicknameEmpty(true);
      setIsNicknameChecked(false);
      setIsOverLimit(false);
      setNicknameCheckResult(null);
      return;
    }

    // 입력된 값의 길이가 16자를 초과하는지 검사
    if (value.length > 16) {
      setIsOverLimit(true);
      setNicknameCheckResult(
        '특수문자는 사용 할 수 없으며 최소 2자, 최대 16자를 초과할 수 없습니다.'
      );
      return;
    }

    // 닉네임의 형식을 검사
    const isValidNickname = nicknameRegex.test(value);

    setNickname(value);
    setIsNicknameEmpty(false);
    setIsNicknameChecked(false);
    setIsOverLimit(!isValidNickname);

    if (!isValidNickname) {
      setNicknameCheckResult(
        '닉네임은 특수문자를 사용 할 수 없으며, 최소 2자 이상, 최대 16자를 초과할 수 없습니다.'
      );
    } else {
      setNicknameCheckResult(null);
    }
  };

  /**
   * 닉네임 중복 검사를 요청하는 함수입니다.
   * 서버에 닉네임 중복 검사를 요청하고 결과에 따라 상태를 업데이트합니다.
   */
  const handleNicknameCheck = async () => {
    if (nickname.trim() === '') {
      Swal.fire({
        icon: 'info',
        title: '수정할 닉네임을 입력하세요',
      });

      return;
    }

    // 닉네임의 형식과 길이를 검사
    if (!nicknameRegex.test(nickname)) {
      Swal.fire({
        icon: 'error',
        title: '유효하지 않은 닉네임',
        text: '닉네임은 특수문자를 사용 할 수 없으며, 최소 2자 이상, 최대 16자를 초과할 수 없습니다.',
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/users/check-duplicate-nickname`,
        { userNickname: nickname }
      );

      if (response.status === 200) {
        if (response.data === 'Nickname is available') {
          setNicknameCheckResult('사용 가능한 닉네임입니다.');
          setIsNicknameChecked(true);
          Swal.fire({
            icon: 'success',
            title: '사용 가능한 닉네임입니다!',
          });

          setIsNicknameEmpty(false);
        } else {
          setNicknameCheckResult('이미 사용 중인 닉네임입니다.');
          setIsNicknameChecked(false);
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 409) {
          setNicknameCheckResult('이미 사용 중인 닉네임입니다.');
          Swal.fire({
            icon: 'error',
            title: '이미 사용 중인 닉네임입니다.',
            text: `다시 입력 후 확인해주세요.`,
          });
          setIsNicknameChecked(false);
        }
      }
    }
  };

  /**
   * 새로운 닉네임을 서버로 업데이트하는 함수입니다.
   */
  const updateNickname = async () => {
    if (nickname) {
      try {
        const requestBody = {
          userNickname: nickname,
        };

        const nicknameResponse = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/users/nickname`,
          requestBody
        );

        if (nicknameResponse.data.success) {
          console.log('닉네임 수정 성공');
          Swal.fire({
            icon: 'success',
            title: '닉네임이 성공적으로 수정되었습니다!',
          });
          setUserData({ ...userData, userNickname: nickname });
          localStorage.setItem('userNickname', nickname);

          setNickname('');
        } else {
          console.error('닉네임 수정 실패');
        }
      } catch (error) {
        console.error('닉네임 수정 오류:', error);
      }
    }
  };

  /**
   * 이미지와 닉네임을 업로드합니다.
   * 사용자가 업로드 버튼을 클릭하면 실행되며, 입력된 데이터의 유효성을 검사한 후 업로드를 수행합니다.
   */
  const uploadImageAndNickname = async () => {
    if ((selectedFile && isNicknameEmpty) || (nickname && isNicknameChecked)) {
      if (selectedFile) {
        await uploadImage();
      }
      if (nickname) {
        await updateNickname();
      }
    } else {
      alert('업로드 또는 확인 버튼을 누르고 수정을 눌러주세요.');
    }
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
    <Container
      maxWidth="md"
      sx={{
        paddingLeft: '16px',
        paddingRight: '16px',
        marginTop: '60px',
        '@media (max-width: 600px)': {
          marginTop: '30px',
        },
      }}
    >
      <Card sx={{ marginBottom: '60px', marginTop: '30px' }}>
        <CardContent>
          <h1
            style={{
              fontSize: '25px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              ...textStyle,
            }}
          >
            회원 정보 수정
          </h1>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'desired-height', // 적절한 높이 설정
              marginTop: '30px',
            }}
          >
            <TextField
              id="outlined-read-only-input"
              label={userData.userNickname}
              InputProps={{
                readOnly: true,
                sx: {
                  borderColor: '#ffffff',
                  backgroundColor: '#ffffff',
                  borderRadius: '50px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffffff', // 기본 테두리 색상
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffffff',
                    backgroundColor: '#ffffff',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ffffff', // 호버 상태에서의 테두리 색상 무효화
                  },
                  '&:hover': {
                    backgroundColor: '#ffffff', // 호버 상태에서의 배경 색상 무효화
                  },
                },
              }}
              InputLabelProps={{
                shrink: false,
                sx: {
                  fontSize: '20px',
                  color: '#3e3e3e',
                  fontWeight: '600',
                  '&.Mui-focused': {
                    color: '#3e3e3e',
                    fontWeight: '600',
                  },
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                },
              }}
              sx={{
                width: '27ch',
                backgroundColor: '#ffffff',
                position: 'relative',
              }}
            />
          </div>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
              height: 500,
            }}
          >
            <div
              className="profile-modify-img-area"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '265px',
                height: '240px',
                backgroundColor: 'white',
                border: '1px solid #3e3e3e',
                borderRadius: '50px',
              }}
            >
              <Avatar
                src={imagePreview || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  backgroundColor: '#747474',
                }}
              />
              <Button
                variant="contained"
                disableElevation
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  height: 35,
                  fontWeight: 600,
                  border: '1px solid white',
                  backgroundColor: '#3e3e3e',
                  '&:hover': {
                    backgroundColor: '#ffffff', // 호버 시 배경 색상
                    color: 'black', // 호버 시 폰트 색상
                    border: '1px solid #3e3e3e',
                    fontWeight: '600',
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: '#ffffff', // 클릭 시 배경 색상
                    color: 'black', // 클릭 시 폰트 색상
                    border: '1px solid #3e3e3e',
                    fontWeight: '600',
                  },
                  '&:active': {
                    backgroundColor: '#ffffff', // 클릭 시 배경 색상 (또 다른 옵션)
                    color: 'black', // 클릭 시 폰트 색상
                    border: '1px solid #3e3e3e',
                    fontWeight: '600',
                  },
                }}
                onClick={openFileInput}
              >
                업로드
              </Button>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>

            <div className="profile-modify-input">
              <div
                className="input-container"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',

                  height: '80px',
                }}
              >
                <FormControl
                  sx={{ m: 1, width: '27ch', height: '80px' }}
                  variant="outlined"
                >
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    sx={{
                      '&.Mui-focused': {
                        color: '#3e3e3e',
                        fontSize: '14px',
                      },
                    }}
                  >
                    변경할 닉네임
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    value={nickname}
                    onChange={handleNicknameChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <Button
                          onClick={handleNicknameCheck}
                          disabled={isNicknameEmpty}
                          sx={{
                            fontSize: '16px',
                            color: '#3e3e3e',
                            fontWeight: '600',
                          }}
                        >
                          확인
                        </Button>
                      </InputAdornment>
                    }
                    label="Password"
                    sx={{
                      height: '55px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3e3e3e', // 기본 테두리 색상
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3e3e3e',
                      },
                    }}
                  />
                  {isOverLimit && (
                    <FormHelperText sx={{ color: 'red' }}>
                      닉네임은 특수문자를 사용 할 수 없으며, 최소 2자 이상, 최대
                      16자를 초과할 수 없습니다.
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            </div>
            <div
              className="profile-modify-button"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '265px',
                height: '50px',
              }}
            >
              <Button
                variant="contained"
                disableElevation
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 120,
                  height: 40,
                  border: '1px solid white',
                  fontWeight: 600,
                  backgroundColor: '#3e3e3e',
                  '&:hover': {
                    backgroundColor: '#3e3e3e', // 호버 시 배경 색상
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: '#3e3e3e', // 포커스 시 배경 색상
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#747474', // 비활성화 상태일 때 배경 색상
                    color: 'white', // 비활성화 상태일 때 글자 색상
                  },
                }}
                onClick={uploadImageAndNickname}
                disabled={
                  (!selectedFile && isNicknameEmpty) ||
                  (!isNicknameEmpty && !isNicknameChecked)
                }
              >
                수정하기
              </Button>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 120,
                  height: 40,
                  border: '1px solid #3e3e3e',
                  fontWeight: 600,
                  color: 'black',
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#3e3e3e', // 호버 시 배경 색상
                    color: 'white', // 호버 시 폰트 색상
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: '#3e3e3e', // 포커스 시 배경 색상
                    color: 'white', // 포커스 시 폰트 색상
                  },
                }}
                onClick={goBack}
              >
                취소
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default MypageUserModify;
