# MJ Music Bot (Ver. 2023-07)

한글 명령어를 지원하는 디스코드 노래 봇

# 주요기능

1. 한글 명령어 지원 및 영한타 오타를 지원 (재생, wotod 등)
2. 노래 재생시 상호작용 버튼 기능
3. 유튜브, shorts, 스포티파이, 사운드클라우드 등 다양한 플랫폼 지원
4. 스킵, 검색, 대기열 등 기타 다양한 명령어 
5. DJ권한, 서버별 접두어 설정 등 다양한 기능

## **봇 설치 및 사용법**

**1.** 노드 설치 (Latest LTS) [NodeJS](https://nodejs.org/ko/)

**2.** 이 저장소를 다운로드하고 압축 해제 | 또는 git clone

**3.**  **`.env예시`** 파일을 참조하여 **`.env`** 파일 생성 후 정보 입력 

### _.env 파일 필수 입력_

```env
PREFIX: "BOT_PREFIX",
TOKEN: "BOT_TOKEN",
MONGODB_URL : "MONGODB_URL"
```

**4.** 노드 버전 업데이트를 위해, Shell에서 다음 코드를 그대로 실행합니다. (선택사항)<br/>
```shell
npm i --save-dev node@latest && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
```

**5.** .env 파일의 입력 항목을 모두 채운 후, Shell에서 다음 코드를 실행하여 봇을 실행합니다.<br/>
```shell
npm install @discordjs/opus zlib-sync@latest erlpack@latest
```

**6.** 추가 패키지 설명 **.** <br/>

1.  `@discordjs/opus` - 오디오 품질 향상 **.** <br/>
2.  `zlib-sync@latest` - WebSocket 데이터 압축 및 인플레이션 **.** <br/>
3.  `erlpack@latest` - 훨씬 더 빠른 WebSocket **.** <br/>

**7.** npm install 이후 **`node index.js`** 가 시작됩니다.


## 라이센스

[MIT](https://choosealicense.com/licenses/mit/)
