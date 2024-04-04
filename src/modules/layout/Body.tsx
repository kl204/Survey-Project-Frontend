//  // Body.tsx
//  import React from 'react';
//  import Container from '@mui/material/Container';
//  import { useLocation } from 'react-router-dom';
//  import { routeInfo } from '../route/routeInfo';

//  /**
//   * Layout의 Body입니다!
//   * @returns 페이지 변경 경로
//   */
//  function Body() {
//    const location = useLocation();

//   const containerStyle = {
//     maxWidth: 'md',
//     height: '600px',
//   };

//   const backStyle = {
//     backgroundColor: '#FFFDF8',
//   };

//   console.log(location.pathname);
//   return (
//     <div style={backStyle}>
//       <Container
//         style={containerStyle}
//         sx={{ paddingTop: '0', backgroundColor: '#FFDF8' }}
//       >
//         {routeInfo(location.pathname)}
//       </Container>
//     </div>
//   );
// }

//  export default Body;

export {};
