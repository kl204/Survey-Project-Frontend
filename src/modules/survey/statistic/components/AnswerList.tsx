/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-use-before-define */
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import '../../../../global.css';
import { Selection } from '../types/SurveyStatisticTypes';

/**
 * 주관식 리스트 테이블 컴포넌트 입니다.
 * @param {Selection[]} selectList - 답변 목록에 대한 통계 데이터 배열
 * @returns 주관식 테이블 페이지
 * @author 김선규
 */
interface selectionList {
  selectList: Selection[];
}

export default function AnswerList({ selectList }: selectionList) {
  const fontFamily = "'Noto Sans KR', sans-serif";
  const textStyle = {
    fontFamily,
  };
  const [, setSelectStat] = useState<Selection[]>([]);
  const [selectStats, setSelectStats] = useState<Selection[]>([]);

  /**
   * 답변 목록을 표시하고 업데이트하는 함수입니다.
   * @param {Selection[]} data - 통계 데이터 배열
   * @param {string} newSurveySubjectiveAnswer - 새로운 주관식 답변
   * @returns {Selection[]} 업데이트된 답변 목록 배열
   * @author 김선규
   */
  function updateArrayList(
    data: Selection[],
    newSurveySubjectiveAnswer: string
  ) {
    const existingWord = data.find(
      (item: { surveySubjectiveAnswer: string }) =>
        item.surveySubjectiveAnswer === newSurveySubjectiveAnswer
    );

    if (existingWord) {
      existingWord.surveySubjectiveAnswerCount += 1;
    } else {
      data.push({
        surveySubjectiveAnswer: newSurveySubjectiveAnswer,
        surveyPostAt: '',
        userNickname: '',
        surveyNo: 0,
        surveyTitle: '',
        surveyQuestionNo: 0,
        surveyQuestionTitle: '',
        questionTypeNo: 0,
        selectionNo: 0,
        selectionValue: '',
        selectionCount: 0,
        surveySubjectiveAnswerCount: 1,
        surveyWriter: '',
      });
    }

    data.sort(
      (a, b) => b.surveySubjectiveAnswerCount - a.surveySubjectiveAnswerCount
    );

    return data;
  }

  /**
   * 주관식 답변이 들어왔을때 답변 객체를 상태 세팅 해주는 함수입니다
   * @returns 없음
   * @author 김선규
   */
  useEffect(() => {
    setSelectStat(selectList);
  }, [selectList]);

  /**
   * 받아온 답변 리스트의 중복을 제거하는 함수입니다.
   * @returns 없음
   * @author 김선균
   */
  useEffect(() => {
    const updateArrayLists = selectList.reduce(
      (acc, word) => updateArrayList(acc, word.surveySubjectiveAnswer),
      selectStats
    );

    setSelectStats(updateArrayLists);
  }, [selectList]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 250,
      }}
      style={textStyle}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                padding: '10px 20px 10px 20px',
                width: '70%',
                backgroundColor: '#747474',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              답변
            </TableCell>
            <TableCell
              sx={{
                padding: '10px 20px 10px',
                backgroundColor: '#747474',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              답변수
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {selectStats.map((row) => (
            <TableRow key={row.surveySubjectiveAnswer}>
              <TableCell
                sx={{
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  maxWidth: 0,
                }}
              >
                {row.surveySubjectiveAnswer}
              </TableCell>
              <TableCell>{row.surveySubjectiveAnswerCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
