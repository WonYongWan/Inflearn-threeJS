플러그인

1. live server

2. 패키지 설치: 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요. -> 3-23_AxisAndGridAndHelper.js 내용

```
npm i -D @babel/cli @babel/core @babel/preset-env babel-loader clean-webpack-plugin copy-webpack-plugin core-js cross-env html-webpack-plugin source-map-loader terser-webpack-plugin webpack webpack-cli webpack-dev-server
```

```
npm i three
```

3. 패키지 설치: 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요. -> 3-24_FPSCheck.js 내용

```
npm i stats.js
```

4. 패키지 설치: 아래 점선 사이의 내용을 붙여 넣고 엔터를 누르세요. -> 3-25_GUIControl.js 내용

```
npm i dat.gui
```

5. vite 설치 + package.json 스크립트 작성

```
npm install vite --save-dev
```

```
"scripts": {
  "start": "vite"
},
```

6. 물리엔진 cannon.js 설치하기 -> 11-101\_물리엔진-월드-생성.js 내용
   cannon 대신 cannon-es설치. 마지막 버전. 옛날거라 업데이트 잘 안됨.

```
npm i cannon-es
```

7. GSAP 설치 -> 12-122\_형태가-바뀌는-이미지-패널-만들기4.js 내용

```
npm i gsap
```
