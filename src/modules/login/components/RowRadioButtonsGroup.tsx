import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Box } from '@mui/system';

interface InputGenderProps {
  onChange: (value: string) => void;
}

const radioStyle = {
  marginLeft: 1,
};

/**
 * 성별(남,여) 선택하는 라디오박스 입니다
 * @author 김선규
 * @returns 성별 지정 라디오박스
 */
export default function RowRadioButtonsGroup({ onChange }: InputGenderProps) {
  const [gender, setGender] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setGender(value);
    onChange(value);
  };

  return (
    <Box sx={{ padding: '0 10px 0 10px' }}>
      <FormControl sx={radioStyle}>
        <FormLabel id="genderRadioButton" sx={{ color: 'black' }}>
          {' '}
          성별{' '}
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="gender-group-of-radio-button"
          name="gender-radio-group"
        >
          <FormControlLabel
            value="male"
            control={<Radio onChange={handleInputChange} />}
            label="남"
            checked={gender === 'male'}
          />
          <FormControlLabel
            value="female"
            control={<Radio onChange={handleInputChange} />}
            label="여"
            checked={gender === 'female'}
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
