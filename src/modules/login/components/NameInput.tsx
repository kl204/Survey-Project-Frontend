import * as React from 'react';
import { useState, ChangeEvent, useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import axios from '../components/customApi';

interface InputNickNameProps {
  onChange: (
    value: string,
    isChecked: boolean,
    isOverLimited: boolean,
    isRegexCheck: boolean
  ) => void;
}

interface isNicknameCheckedOnChange {
  isNicknameCheckedOnChangeCallback: (isChecked: boolean) => void;
}

interface isOverLimitCheckedOnChange {
  isOverLimitChecked: (isOverLimited: boolean) => void;
}

interface isRegexCheckCheckedOnChange {
  isRegexCheckChecked: (isRegexCheck: boolean) => void;
}

/**
 * 닉네임을 입력할수 있는 input box 입니다
 * @author 김선규
 * @returns 닉네임 입력 컴포넌트
 */
export default function ComposedTextField({
  onChange,
  isNicknameCheckedOnChangeCallback,
  isOverLimitChecked,
  isRegexCheckChecked,
}: InputNickNameProps &
  isNicknameCheckedOnChange &
  isOverLimitCheckedOnChange &
  isRegexCheckCheckedOnChange) {
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false);
  const [nicknameCheckResult, setNicknameCheckResult] = useState<string | null>(
    ''
  );
  const [nickName, setNickName] = useState<string>('');
  const [error, setError] = useState(true);
  const [submitWithoutCheck, setSubmitWithoutCheck] = useState(false);
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [isRegexCheck, setIsRegexCheck] = useState<boolean>(false);

  // style 태그를 사용해 커스텀 스타일 정의
  const customStyles = `
    .swal-custom-popup {
      z-index: 1500; // 필요한 z-index 값
    }
    .swal-custom-container {
      z-index: 1500; // 필요한 z-index 값
    }
  `;

  useEffect(() => {
    setIsNicknameChecked(false);
    setSubmitWithoutCheck(false);
    setNicknameCheckResult(null);
  }, [nickName]);

  useEffect(() => {
    isNicknameCheckedOnChangeCallback(isNicknameChecked);
    isOverLimitChecked(isOverLimit);
    isRegexCheckChecked(isRegexCheck);
  }, [isNicknameChecked, isOverLimit, isRegexCheck]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const regex = /^[A-Za-z0-9가-힣]{2,16}$/;

    if (value.length <= 16) {
      setNickName(value);
      setIsOverLimit(false);
    } else {
      setIsOverLimit(true);
    }

    if (regex.test(value)) {
      setNickName(value);
      setIsRegexCheck(false);
    } else {
      setIsRegexCheck(true);
    }

    if (value.trim() === '' || value.trim() === null) {
      setError(true);
    } else {
      setError(false);
    }

    onChange(value, isNicknameChecked, isOverLimit, isRegexCheck);
  };

  const handleNicknameSubmit = async () => {
    const regex = /^[A-Za-z0-9가-힣]{2,16}$/;

    if (nickName.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: '닉네임을 입력해주세요!',
        customClass: {
          popup: 'swal-custom-popup',
          container: 'swal-custom-container',
        },
      });
      setSubmitWithoutCheck(false);
      return;
    }

    if (!regex.test(nickName)) {
      Swal.fire({
        icon: 'error',
        title: '최소 2글자 최대 16글자, 특수문자 불가',
        customClass: {
          popup: 'swal-custom-popup',
          container: 'swal-custom-container',
        },
      });
      setSubmitWithoutCheck(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/oauthLogin/check-duplicate-nickname`,
        {
          userNickname: nickName,
        }
      );

      if (response.status === 200) {
        if (response.data === 'Nickname is available') {
          setNicknameCheckResult('사용 가능한 닉네임입니다.');
          setSubmitWithoutCheck(true);
          setIsNicknameChecked(true);

          isNicknameCheckedOnChangeCallback(true);

          Swal.fire({
            icon: 'success',
            title: '사용 가능한 닉네임입니다.',
            customClass: {
              popup: 'swal-custom-popup',
              container: 'swal-custom-container',
            },
          });
        }
        if (response.data === 'Nickname is not available') {
          setNicknameCheckResult('이미 사용 중인 닉네임입니다.');
          setSubmitWithoutCheck(false);
          setIsNicknameChecked(false);

          isNicknameCheckedOnChangeCallback(false);
          Swal.fire({
            icon: 'error',
            title: '이미 사용 중인 닉네임입니다.',
            customClass: {
              popup: 'swal-custom-popup',
              container: 'swal-custom-container',
            },
          });
        }
      }
    } catch (submitError) {
      console.error('Error checking nickname:', submitError);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        width: '270px',
        display: 'flex',
        padding: '0 0 0 16px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <style>{customStyles}</style>
      <Box sx={{ height: '100px' }}>
        <FormControl variant="standard">
          <InputLabel htmlFor="component-helper" sx={{ color: 'black' }}>
            닉네임
          </InputLabel>
          <Input
            id="component-helper"
            aria-describedby="component-helper-text"
            value={nickName}
            onChange={handleInputChange}
            error={error}
            sx={{ width: '90%' }}
          />
          {!error && nicknameCheckResult && (
            <FormHelperText id="component-helper-text">
              {nicknameCheckResult}
            </FormHelperText>
          )}

          {isOverLimit && (
            <FormHelperText sx={{ color: 'red' }} style={{ width: '150px' }}>
              닉네임은 16자를 초과할 수 없습니다!
            </FormHelperText>
          )}

          {isRegexCheck && !isOverLimit && (
            <FormHelperText
              id="component-helper-text"
              sx={{ color: 'red' }}
              style={{ width: '150px' }}
            >
              최소 2글자 최대 16글자, 특수문자 불가
            </FormHelperText>
          )}

          {!submitWithoutCheck && !isOverLimit && !isRegexCheck && (
            <FormHelperText
              id="component-helper-text"
              error
              style={{ width: '150px' }}
            >
              중복확인을 하지 않았습니다!
            </FormHelperText>
          )}
        </FormControl>
      </Box>
      <Button
        onClick={() => {
          handleNicknameSubmit();
        }}
        variant="contained"
        color="info"
        sx={{
          fontSize: '0.8rem',
          fontWeight: 600,
          border: '0px solid white',
          backgroundColor: '#3e3e3e',
          '&:hover': {
            backgroundColor: '#ffffff',
            color: 'black',
            border: '1px solid #3e3e3e',
            fontWeight: '600',
          },
          '&.Mui-focusVisible': {
            backgroundColor: '#ffffff',
            color: 'black',
            border: '1px solid #3e3e3e',
            fontWeight: '600',
          },
          '&:active': {
            backgroundColor: '#ffffff',
            color: 'black',
            border: '1px solid #3e3e3e',
            fontWeight: '600',
          },
        }}
      >
        중복확인
      </Button>
    </Box>
  );
}
