import * as React from 'react';
import { useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Box } from '@mui/system';

interface InputBirthDateProps {
  onChange: (value: string) => void;
}

export default function ResponsiveDatePickers({
  onChange,
}: InputBirthDateProps) {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(
    dayjs('2004-01-01')
  );

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date === null) {
      setSelectedDate(date);
      console.log('No date selected');
    } else if (dayjs.isDayjs(date)) {
      const jsDate = date.toDate();
      const year = jsDate.getFullYear();
      const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
      const day = jsDate.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      setSelectedDate(date);
      onChange(formattedDate);
    } else {
      console.error('Invalid date format:', date);
    }
  };

  return (
    <Box sx={{ padding: '0 16px 0 16px', marginBottom: '20px' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer
          components={[
            'DatePicker',
            'MobileDatePicker',
            'DesktopDatePicker',
            'StaticDatePicker',
          ]}
        >
          <DemoItem label="생년월일">
            <DesktopDatePicker
              disableFuture // 미래 날짜 비활성화
              value={selectedDate}
              onChange={handleDateChange}
              minDate={dayjs('1910-01-01')}
              maxDate={dayjs('2004-01-01')}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
}
