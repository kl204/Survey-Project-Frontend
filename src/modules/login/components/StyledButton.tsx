import * as React from 'react';
import Button from '@mui/material/Button';

interface ColorButtonsProps {
  buttonText: string;
  onClick?: () => void;
}

const defaultProps: Partial<ColorButtonsProps> = {
  onClick: () => {},
};

const style = {
  margin: '10px 15px 10px 15px',
  width: '270px',
  height: '40px',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'white',
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
};

/**
 * 스타일된 버튼을 buttonText로 이름만 바꿔서 사용 가능합니다
 * @author 김선규
 * @param param0
 * @returns 버튼
 */
export default function StyledButton({
  buttonText,
  onClick,
}: ColorButtonsProps) {
  const handleClick = onClick;

  return (
    <Button variant="text" onClick={handleClick} sx={style}>
      {buttonText}
    </Button>
  );
}

StyledButton.defaultProps = defaultProps;
