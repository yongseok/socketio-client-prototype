# Client Installation
https://socket.io/docs/v4/client-api/

## Installation

### From a CDN
```html
<script src="https://cdn.socket.io/4.7.4/socket.io.min.js" integrity="sha384-Gr6Lu2Ajx28mzwyVR8CFkULdCU7kMlZ9UthllibdOSo6qAiN+yXNHqtgdTvFXMT4" crossorigin="anonymous"></script>
```

### From NPM
```zsh
pnpm add socket.io-client
```

### 폴더 구조

/messenger-client
├── /public
│   ├── index.html
│   └── ...
├── /src
│   ├── /components
│   │   ├── App.tsx
│   │   ├── NameSpace.tsx
│   │   └── ...
│   ├── /contexts
│   │   └── SocketContext.tsx
│   ├── /hooks
│   │   └── useSocket.ts
│   ├── /utils
│   │   └── getUuid.ts
│   ├── index.tsx
│   └── ...
├── package.json
├── tsconfig.json
└── ...

- components: React 컴포넌트를 저장하는 폴더입니다. 각 컴포넌트는 자체 폴더를 가질 수 있으며, 그 안에는 관련 스타일시트와 테스트 파일이 포함될 수 있습니다.
- contexts: React Context를 사용하여 앱 전체에서 사용할 수 있는 상태를 저장하는 폴더입니다. 이 경우 Socket.IO의 연결을 관리하는 SocketContext를 저장할 수 있습니다.
- hooks: 커스텀 훅을 저장하는 폴더입니다. 예를 들어, Socket.IO의 연결을 관리하는 useSocket 훅을 저장할 수 있습니다.
- utils: 유틸리티 함수를 저장하는 폴더입니다. 예를 들어, UUID를 생성하는 getUuid 함수를 저장할 수 있습니다.