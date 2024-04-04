/**
 * AttendMultipleChoice 컴포넌트는 여러 개의 선택사항 중 여러 개를 선택할 수 있는 문항에 대한 UI를 제공합니다.
 * 이 컴포넌트는 MUI의 FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox 등의 컴포넌트를 사용하여 구현되었습니다.
 *
 * @prop {SurveyItem[]} surveyData - 문항 및 선택 항목을 포함하는 설문 데이터입니다.
 * @prop {number} questionNo - 현재 문항 번호입니다.
 * @prop {function} onAnswerChange - 답변이 선택되거나 선택이 취소될 때 호출되는 콜백 함수입니다.
 *
 * @component
 * @author 박창우
 */
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { SurveyItem } from '../types/AttendTypes';

interface AttendMultipleChoiceProps {
  surveyData: SurveyItem[];
  questionNo: number;
  onAnswerChange: (
    answers: Array<{ selectionValue: string; selectionNo: number }>
  ) => void;
}

function AttendMultipleChoice({
  surveyData,
  questionNo,
  onAnswerChange,
}: AttendMultipleChoiceProps) {
  const [checkedValues, setCheckedValues] = useState<
    Array<{ selectionValue: string; selectionNo: number }>
  >([]);

  /**
   * 체크박스의 선택 상태 변경을 처리하는 함수입니다.
   *
   * @param event 체크박스의 이벤트 객체
   * @returns 없음
   * @author 박창우
   */
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = {
      selectionValue: event.target.value,
      selectionNo: Number(event.target.name),
    };

    const newValues = event.target.checked
      ? [...checkedValues, newValue]
      : checkedValues.filter(
          (val) => val.selectionValue !== event.target.value
        );

    setCheckedValues(newValues);
    onAnswerChange(newValues);
  };

  const questionItems = surveyData.filter(
    (item) => item.surveyQuestionNo === questionNo
  );

  const mainQuestion = questionItems[0];

  if (!mainQuestion) {
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
        {!checkedValues.length && mainQuestion.required && (
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
        <FormControl component="fieldset">
          <FormLabel
            component="legend"
            sx={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'black',
              marginBottom: '10px',
              '&.Mui-focused': {
                color: '#3e3e3e',
              },
            }}
          >
            {mainQuestion.surveyQuestionTitle}
          </FormLabel>

          <Typography
            variant="body1"
            sx={{
              fontSize: '0.9rem',
            }}
          >
            {mainQuestion.surveyQuestionDescription}
          </Typography>

          <FormGroup
            sx={{
              paddingTop: '10px',
            }}
          >
            {questionItems.map((item) => (
              <div key={item.selectionNo}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        '& svg': {
                          width: '18px',
                          height: '18px',
                        },
                        '&.Mui-checked': {
                          color: '#3e3e3e',
                        },
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                      }}
                      checked={checkedValues.some(
                        (v) => v.selectionValue === (item.selectionValue || '')
                      )}
                      onChange={handleCheckboxChange}
                      value={item.selectionValue || ''}
                      name={item.selectionNo.toString()}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#3e3e3e',
                        fontWeight: checkedValues.some(
                          (v) =>
                            v.selectionValue === (item.selectionValue || '')
                        )
                          ? 'bold'
                          : 'normal',
                        fontSize: checkedValues.some(
                          (v) =>
                            v.selectionValue === (item.selectionValue || '')
                        )
                          ? '0.9rem'
                          : '0.8rem',
                      }}
                    >
                      {item.selectionValue || ''}
                    </Typography>
                  }
                />
              </div>
            ))}
          </FormGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
}

export default AttendMultipleChoice;
