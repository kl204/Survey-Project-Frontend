// import React, { useEffect } from 'react';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { createTheme, ThemeProvider } from '@mui/material';
import Layout from './modules/layout/Layout';
import ModifySurvey from './modules/survey/modify/routers/ModifySurvey';
import CreateationSurvey from './modules/survey/creation/routers/CreateationSurvey';
import LoginDisplay from './modules/login/LoginDisplay';
import MypageWriteSurvey from './modules/survey/mypage/components/MypageWriteSurvey';
import MypageAttendSurvey from './modules/survey/mypage/components/MypageAttendSurvey';
import StatisticsPage from './modules/survey/statistic/StatisticsPage';
import Main from './modules/survey/main/routes/Main';
import Search from './modules/survey/main/routes/Search';
import AttendSurvey from './modules/survey/attend/routers/AttendSurvey';
// import axios from './modules/login/components/customApi';
import MypageUserModify from './modules/survey/mypage/components/MypageUserModify';
import NotFoundPage from './modules/layout/NotFoundPage';

const GlobalStyle = createGlobalStyle`
@font-face{
  font-family:NanumSquareRound;
  font-style:normal;
  font-weight:300;
  src:local("NanumSquareRoundL"),
  url(NanumSquareRoundL.eot),
  url(NanumSquareRoundL.eot?#iefix) format("embedded-opentype"),
  url(NanumSquareRoundL.woff2) format("woff2"),
  url(NanumSquareRoundL.woff) format("woff"),
  url(NanumSquareRoundL.ttf) format("truetype")
}

    body {
      font-family: "NanumSquare", "Arial", sans-serif;
      margin: 0;
      padding: 0;
    }

    *::-webkit-scrollbar {
      width: 8px;
    }
  
    *::-webkit-scrollbar-thumb {
      background-color: #3e3e3e;
      border-radius: 5px;
    }

    .swal2-popup {
      width: 300px;
      font-size: 14px;
    }
  `;

const Theme = createTheme({
  typography: {
    fontFamily: 'nanumsquare',
  },
});
function App() {
  // useEffect(() => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  // }, []);

  return (
    <Router>
      <GlobalStyle />
      <ThemeProvider theme={Theme}>
        <Routes>
          <Route path="/login" element={<LoginDisplay />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Main />} />
            <Route path="/survey/register" element={<CreateationSurvey />} />
            <Route path="/survey/modify/:surveyNo" element={<ModifySurvey />} />
            <Route path="/survey/statistics" element={<StatisticsPage />} />
            <Route
              path="/survey/statistics/:surveyNo"
              element={<StatisticsPage />}
            />
            <Route path="/survey/main" element={<Main />} />
            <Route path="/survey/search" element={<Search />} />
            <Route
              path="/survey/mypage/write"
              element={<MypageWriteSurvey />}
            />
            <Route
              path="/survey/mypage/attend"
              element={<MypageAttendSurvey />}
            />
            <Route path="/survey/attend/:surveyNo" element={<AttendSurvey />} />
            <Route
              path="/survey/mypageUserModify"
              element={<MypageUserModify />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
