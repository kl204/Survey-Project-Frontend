/** @jsxImportSource @emotion/react */

import { Box } from '@mui/system';
import React, { useState } from 'react';
import { css } from '@emotion/react';
import IosShareIcon from '@mui/icons-material/IosShare';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import { Popover } from '@mui/material';
import { SNSSharingParams } from './SNSSharingType';
import useSNSShare from './SNSSharing';
import CopyToClipBoard from './CopyToClipBoard';

const styles = {
  iconBox: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }),

  popoverBox: css({
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 12px 20px 12px',
  }),

  popoverIcon: css({
    color: '#000000',
  }),

  copyClipBoardBox: css({
    marginBottom: '12px',
  }),

  imageButton: css({
    padding: '0px',
    outline: 'none',
    border: 'none',
    backgroundColor: '#ffffff',
    marginRight: '8px',
  }),

  image: css({
    width: '40px',
    borderRadius: '30px',
  }),

  navigatorIcon: css({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    textAlign: 'center',
    lineHeight: '40px',
    verticalAlign: 'middle',
    display: 'flex',
    color: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#747474',
  }),

  iconButtonStyle: css({
    width: '40px',
    backgroundColor: '#747474',
    color: '#ffffff',
  }),
};

/**
 * 공유하기를 담당하는 컴포넌트 입니다.
 *
 * @component
 * @param {@see SNSSharingParams} 공유하기 제목과 URL 입니다.
 * @returns 공유하기 디자인 컴포넌트
 * @author 강명관
 */
export default function Sharing({
  shareTitle,
  shareUrl,
  shareImageUrl,
}: SNSSharingParams) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const openPopover = Boolean(anchorEl);

  const {
    isAvailNavigator,
    shareToTwitter,
    shareToFacebook,
    shareToKakaoTalk,
    shareToNaver,
    shareToNavigator,
  } = useSNSShare({
    shareTitle,
    shareUrl,
    shareImageUrl,
  });

  return (
    <Box>
      <IconButton onClick={handleOpenPopover}>
        <IosShareIcon css={styles.popoverIcon} />
      </IconButton>
      <Popover
        open={openPopover}
        onClose={handleClosePopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box css={styles.popoverBox}>
          <Box css={styles.copyClipBoardBox}>
            <CopyToClipBoard copyText={shareUrl} />
          </Box>

          <Box css={styles.iconBox}>
            <button
              type="button"
              css={styles.imageButton}
              onClick={shareToFacebook}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/sharingLogo/facebook.png`}
                alt="kakao"
                css={styles.image}
              />
            </button>
            <button
              type="button"
              css={styles.imageButton}
              onClick={shareToKakaoTalk}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/sharingLogo/kakaotalk.png`}
                alt="kakao"
                css={styles.image}
              />
            </button>
            <button
              type="button"
              css={styles.imageButton}
              onClick={shareToNaver}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/sharingLogo/naver.png`}
                alt="kakao"
                css={styles.image}
              />
            </button>
            <button
              type="button"
              css={styles.imageButton}
              onClick={shareToTwitter}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/sharingLogo/twitter.png`}
                alt="kakao"
                css={styles.image}
              />
            </button>
            {isAvailNavigator && (
              <IconButton
                css={styles.iconButtonStyle}
                onClick={shareToNavigator}
              >
                <ShareIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
