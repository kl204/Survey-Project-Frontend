import axios from 'axios';
// import Swal from 'sweetalert2';
/**
 * intercepter를 통하여 토큰 만료시 refreshToken으로 자동 갱신하기 위한 axois 커스텀 컴포넌트입니다
 * @author 김선규
 */
const Api = axios.create({
  params: {},
});

// // 요청 인터셉터
// Api.interceptors.request.use(
//   // eslint-disable-next-line no-shadow
//   (config) => {
//     const accessToken = localStorage.getItem('accessToken');

//     // eslint-disable-next-line no-param-reassign, dot-notation
//     config.headers.Authorization = `Bearer ${accessToken}`;

//     return config;
//   },
//   (error) => Promise.reject(error)
// );
// 응답 인터셉터를 설정
// Api.interceptors.response.use(
//   (response) => {
//     // eslint-disable-next-line no-param-reassign, dot-notation
//     const accessToken = response.headers['accesstoken'];

//     if (typeof accessToken === 'string') {
//       const token = accessToken.split(' ')[1];

//       if (token != null) {
//         localStorage.setItem('accessToken', token);
//         Api.defaults.headers.common.Authorization = accessToken;
//       }
//     }

//     return response;
//   },
//   (error) => {
//     console.log(error);

//     if (error.response.status === 401) {
//       window.location.href = '/login';
//     } else {
//       Swal.fire({
//         icon: 'error',
//         title: '잘못된 요청입니다.',
//       });
//       window.location.href = '/';
//     }

//     return Promise.reject(error);
//   }
// );

export default Api;
