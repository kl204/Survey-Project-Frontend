# Survey Management Frontend

This is a React TypeScript frontend project for a presentation on December 4th.

## 프론트엔드 개발 참고 사항

현 readme의 명세는 개발 참고사항으로 이용되고 있으며, 차후 프로젝트의 명세로 전환될 예정임

### 리액트 접근 흐름

[파일명 기준]<br>
index.tsx -> App.tsx -> Layout.tsx -> Body.tsx -> routeInfo.tsx -> 각 전환될 페이지.tsx

### 접근 흐름 설명

<b>index.tst</b> : 제일 처음 앱 시작했을때 접근하는 파일. <App/> 를 근거로 App.tsx로 접근 <br>
<b>App.tsx</b> : 라우터가 있는곳. useNavigate 등으로 페이지 전환을 위한 접근 url은 모두 이곳을 통하여 접근하게 된다.<br>
<b>Layout.tsx</b> : Header, Body, Footer가 한곳에 있는 곳으로 혹여나 Body의 페이지가 다른 레이아웃의 분기가 필요할때 조건문걸고 다르게 접근시키면 된다. Header, Footer도 마찬가지<br>
<b>Body.tsx</b> : 각 기능이 존재하는 페이지로 routeInfo(location.pathname)은 넘어오는 url을 받기 때문에 각 기능의 페이지로 접근시킨다.<br>
<b>routeInfo.tsx</b> : 라우터를 통해서 넘어온 url을 실제 현재 디렉터리의 경로로 전환해주는 곳이다. 여기에 필요한 url와 경로를 설정하고 사용하면 된다.


### 디렉터리 구조

<b>layout 폴더</b> : Body, Header, Footer과 셋을 아우르는 Layout 파일이 있는 폴더. 만약 Body의 레이아웃이 크게 바뀐다면 기존 구조를 참고하여 새로운 파일 만들면 된다.<br>
<b>route 폴더</b> : 라우터의 경로를 설정해주는 파일이 있는 폴더. 건드릴 필요 없다.<br>
<b>survey 폴더</b> : 각종 페이지의 파일들을 각자 만들어서 사용하면 된다.<br><br>

* 각 폴더나 파일들은 개인의 결정에 따라 생성 가능하나 feature 브랜치에서 설정하고 완성후 논의를 통해 병합하도록한다.

### 참고사항

git clone을 받을시 react-script가 없을 수 있는데<br><br>

<b>npm install create-react-app</b><br>
명령어로 해결가능하다. (react-script는 create-react-app 설치에 포함된다.)<br>

## 즐거운 코딩됩시당

Hello World!<br>
<b>ver 0.01</b><br>
<b>by puo(aka SunGyu)</b>
