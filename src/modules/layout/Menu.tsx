/** @jsxImportSource @emotion/react */

import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import DraftsIcon from '@mui/icons-material/Drafts';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditNoteIcon from '@mui/icons-material/EditNote';
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import axios from '../login/components/customApi';

interface UserInfoProps {
  userNo: number | null;
  userImage: string | null;
  userNickname: string | null;
}

interface MenuProps {
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

// const USER_NO = 'userNo';
// const USER_IMAGE = 'userImage';
// const USER_NICKNAME = 'userNickname';

// const IMAGE_API_BASE = 'http://localhost:8080/api/images/users/';
const ANONYMOUS_USER_NICKNAME = '익명 사용자';

const styels = {
  drawerBox: css({
    width: 250,
  }),

  nicknameInput: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }),

  avatarArea: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '150px',
  }),

  avatarImage: css({
    width: 100,
    height: 100,
  }),

  divider: css({
    marginTop: '10px',
    marginBottomL: '10px',
  }),
};

function Menu({ toggleDrawer }: MenuProps) {
  const initUserInfo: UserInfoProps = {
    userNo: null,
    userNickname: null,
    userImage: null,
  };

  const [userInfo, setUserInfo] = useState<UserInfoProps>(initUserInfo);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/users/user-info`
        );
        if (response.data) {
          setUserInfo({
            userNo: response.data.userNo,
            userImage: response.data.userImage,
            userNickname: response.data.userNickname,
          });

          console.log('로그인된 사용자 : ' + response.data.userNo);
        }
      } catch (error) {
        console.error('유저 정보 불러오기 오류: ', error);
      }
    };
    fetchUserData();
  }, []);

  /**
   * 내가 참여한 설문 페이지로 이동하는 메서드 입니다.
   *
   */
  const handleClickAttendSurvey = () => {
    /**
     * FIXME: router 지정 && 인가 사용자 검증 로직 -> 실패하면 로그인 페이지 리다이렉트
     */
    navigate('/survey/mypage/attend');
  };

  /**
   * 내가 작성한 설문 페이지로 이동하는 메서드 입니다.
   *
   * @author 강명관
   */
  const handleClickWriteSurvey = () => {
    /**
     * FIXME: router 지정 && 인가 사용자 검증 로직 -> 실패하면 로그인 페이지 리다이렉트
     */
    navigate('/survey/mypage/write');
  };

  /**
   * 회원 정보 수정 페이지로 이동하는 메서드 입니다.
   *
   */
  const handleClickModifyUser = () => {
    /**
     * FIXME: router 지정 && 인가 사용자 검증 로직 -> 실패하면 로그인 페이지 리다이렉트
     */
    navigate('/survey/mypageUserModify');
  };

  return (
    <Box
      css={styels.drawerBox}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box css={styels.avatarArea}>
        <Avatar
          src={userInfo.userImage ? `${userInfo.userImage}` : ''}
          css={styels.avatarImage}
        />
      </Box>
      <Box css={styels.nicknameInput}>
        <Typography>
          {userInfo.userNickname !== null
            ? userInfo.userNickname
            : ANONYMOUS_USER_NICKNAME}
        </Typography>
      </Box>

      <Divider css={styels.divider} />

      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleClickWriteSurvey}>
              <ListItemIcon>
                <EditNoteIcon />
              </ListItemIcon>
              <ListItemText primary="내가 작성한 설문" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleClickAttendSurvey}>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="내가 참여한 설문" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleClickModifyUser}>
              <ListItemIcon>
                <AssignmentIndIcon />
              </ListItemIcon>
              <ListItemText primary="회원 정보 수정" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}

export default Menu;
