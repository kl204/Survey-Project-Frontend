/** @jsxImportSource @emotion/react */

import { Alert, Button } from '@mui/material';
import React from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { ModalButtonGroupProps } from '../types/MainType';

const styles = {
  modalButtonGroupBox: css({
    width: '100%',
  }),

  surveyResultButton: css({
    width: '100%',
    marginBottom: '8px',
    backgroundColor: '#ebebeb',
    '&:hover': {
      backgroundColor: 'gray',
      color: 'white',
      fontWeight: '900',
      fontSize: '14px',
    },
    color: 'black',
    fontWeight: '600',
  }),

  alertArea: css({
    marginBottom: '8px',
  }),

  surveyAttendButton: css({
    width: '100%',
    marginBottom: '8px',
    backgroundColor: '#ebebeb',
    '&:hover': {
      backgroundColor: 'gray',
      color: 'white',
      fontWeight: '900',
      fontSize: '15px',
    },
    color: 'black',
    fontWeight: '600',
  }),
};

export default function AttendModalButtonGroup({
  numUser,
  selectedCard,
  showSwalAlert,
}: ModalButtonGroupProps) {
  const navigate = useNavigate();

  return (
    <div css={styles.modalButtonGroupBox}>
      {/* 참여하기 제한 조건 */}
      {selectedCard?.attendCheckList &&
        selectedCard.attendCheckList.includes(false) && (
          <Alert severity="info" css={styles.alertArea}>
            이미 참여한 설문입니다.
          </Alert>
        )}

      {selectedCard?.userNo === numUser() &&
        selectedCard?.openStatusName === '전체 공개' && (
          <Alert severity="success" css={styles.alertArea}>
            본인이 작성한 설문입니다.
          </Alert>
        )}
      {selectedCard?.userNo === numUser() &&
        selectedCard?.openStatusName === '회원 공개' && (
          <Alert severity="success" css={styles.alertArea}>
            본인이 작성한 설문입니다.
          </Alert>
        )}

      {selectedCard?.openStatusName === '비공개' &&
        (numUser() !== selectedCard.userNo ? (
          <Alert severity="warning" css={styles.alertArea}>
            설문 작성자만 볼 수 있습니다.
          </Alert>
        ) : (
          <Alert severity="success" css={styles.alertArea}>
            해당 비공개 설문의 작성자입니다.
          </Alert>
        ))}

      {selectedCard?.openStatusName === '회원 공개' && numUser() === null && (
        <Alert severity="error" css={styles.alertArea}>
          통계를 보시려면 로그인해주세요.
        </Alert>
      )}

      {numUser() === null && selectedCard?.openStatusName === '전체 공개' && (
        <Alert severity="error" css={styles.alertArea}>
          참여를 원하시면 로그인해주세요
        </Alert>
      )}
      {/* 통계보기, 참여하기 버튼 */}
      {(!selectedCard?.openStatusName ||
        selectedCard?.openStatusName === '전체 공개' ||
        (selectedCard?.openStatusName === '비공개' &&
          numUser() !== null &&
          numUser() === selectedCard?.userNo) ||
        (selectedCard?.openStatusName === '회원 공개' &&
          numUser() !== null)) && (
        <Button
          onClick={() => {
            if (selectedCard?.surveyAttendCount === 0) {
              showSwalAlert();
            } else {
              navigate(`/survey/statistics/${selectedCard?.surveyNo}`);
            }
          }}
          css={styles.surveyResultButton}
        >
          설문 통계보기
        </Button>
      )}

      {/* 참여하기 버튼 */}
      {numUser() !== null &&
        (!selectedCard?.attendCheckList ||
          (!selectedCard.attendCheckList.some((item) => item === false) &&
            selectedCard?.userNo !== numUser())) && (
          <Button
            onClick={() => navigate(`/survey/attend/${selectedCard?.surveyNo}`)}
            css={styles.surveyAttendButton}
          >
            설문 참여하기
          </Button>
        )}
    </div>
  );
}
