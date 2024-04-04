/**
 * LongAnswer 컴포넌트는 사용자가 장문의 답변을 입력할 수 있는 UI를 제공합니다.
 * 이 컴포넌트는 MUI의 Card, CardContent, TextField, Typography 컴포넌트를 사용하여 구현되었습니다.
 *
 * @prop {SurveyItem[]} surveyData - 문항 및 선택 항목을 포함하는 설문 데이터입니다.
 * @prop {number} questionNo - 현재 문항 번호입니다.
 * @prop {function} onAnswerChange - 답변이 선택되거나 선택이 취소될 때 호출되는 콜백 함수입니다.
 *
 * @component
 * @author 박창우
 */
import React, { useState } from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import { SurveyItem } from '../types/AttendTypes';

interface LongAnswerProps {
  surveyData: SurveyItem[];
  questionNo: number;
  onAnswerChange: (answer: string) => void;
}

function LongAnswer({
  surveyData,
  questionNo,
  onAnswerChange,
}: LongAnswerProps) {
  const [answer, setAnswer] = useState<string>('');
  const [isOverLimit, setIsOverLimit] = useState<boolean>(false);

  /**
   * 사용자의 입력에 따라 텍스트 상태를 업데이트하는 함수입니다.
   *
   * @param event 사용자 입력 이벤트 객체
   * @returns 없음
   * @author 박창우
   */
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    // setAnswer(newValue);
    // onAnswerChange(newValue);
    if (newValue.length <= 1000) {
      setAnswer(newValue);
      onAnswerChange(newValue);
      setIsOverLimit(false);
    } else {
      setIsOverLimit(true);
    }
  };

  /**
   * 현재 문항 데이터를 조회하는 함수입니다.
   *
   * @returns 현재 문항의 데이터 객체 또는 null
   * @author 박창우
   */
  const currentQuestion = surveyData.find(
    (item) => item.surveyQuestionNo === questionNo
  );

  if (!currentQuestion) {
    return null;
  }

  return (
    <Card
      id={`question-${questionNo}`}
      sx={{
        marginBottom: '30px',
      }}
    >
      <CardContent>
        {!answer && currentQuestion?.required && (
          <h1
            style={{
              fontSize: '9px',
              display: 'flex',
              justifyContent: 'flex-end',
              height: '15px',
              color: 'red',
              margin: '0',
              padding: '0',
            }}
          >
            * 필수 응답 문항입니다.
          </h1>
        )}
        <p
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            margin: '0',
            marginBottom: '10px',
          }}
        >
          {currentQuestion.surveyQuestionTitle}
        </p>

        <Typography
          variant="body1"
          sx={{
            fontSize: '0.9rem',
            marginBottom: '15px',
          }}
        >
          {currentQuestion?.surveyQuestionDescription}
        </Typography>

        <TextField
          label="장문 답변 입력란"
          variant="outlined"
          fullWidth
          multiline
          rows={10}
          value={answer}
          onChange={handleTextChange}
          placeholder="장문 답변 입력(최대 1000자)"
          error={isOverLimit}
          helperText={isOverLimit ? '답변은 1000자를 초과할 수 없습니다.' : ''}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'lightgray',
              },
              '&:hover fieldset': {
                borderColor: 'gray',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3e3e3e',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#3e3e3e',
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

export default LongAnswer;
