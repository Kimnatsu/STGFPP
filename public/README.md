# FPP v2 — 전면 재구축 완성본

원피스 파이팅패스(FPP) 커뮤니티 사이트 v2.
기존 GitHub 저장소(OnePieceFightingPath/OPFP)는 **구조·데이터 분석 용도**로만 사용했고,
프론트엔드 코드(HTML/CSS/JS/UI)는 **전부 새로 작성**했습니다.
기존 Firebase 프로젝트의 실제 데이터는 그대로 연결해 사용합니다.

---

## 1. 기술 스펙

- HTML5 + CSS3 + Vanilla JavaScript (프레임워크 0)
- Firebase 10.x compat SDK (CDN)
  - Authentication (이메일/비밀번호 + Google)
  - Cloud Firestore
- 스토리지 미사용 (이미지는 CDN URL 참조 — 기존 정책 유지)
- 빌드 도구 없음. 어떤 정적 서버에서도 그대로 동작

## 2. 실행 방법

```bash
# 방법 1) 임의의 정적 서버
npx serve .

# 방법 2) VS Code Live Server → index.html 열기

# 방법 3) Firebase Hosting에 배포
firebase deploy
```

진입 페이지: `index.html` (= `Main.html` 홈 화면)

## 3. 파일 구조

```
FPP-v2/
├── index.html              # 진입 페이지 (에셋 로더 포함)
├── Main.html               # 홈 / 캐릭터 / 현질 서폿 캐릭터 / PvP 패치 (단일 HTML)
├── Community.html          # 커뮤니티 홈 / 패치노트(+상세) / 게시판(+상세) / 이벤트(+상세)
├── CustomerService.html    # 고객센터 (검색/목록/상세/1:1문의/나의 문의)
├── Login.html              # 로그인 / 회원가입 (이메일 인증 + Google)
├── Setting.html            # SM/XS 설정 전용 페이지
├── css/                    # common(디자인 시스템) + 페이지별 5개
├── js/                     # Firebase.js / common.js + 페이지별 5개
└── README.md
```

## 4. Firebase 연결 (기존 프로젝트 유지)

- 프로젝트: `fighting-path-patch`
- 읽는 컬렉션: `characters`, `supportCharacters`, `pvpPatch`, `patchNotes`, `banners`,
  `eventBanners`, `events`, `notices`, `boards`, `boardComments`, `eventComments`, `likes`, `users`
- 쓰는 동작(기존 Firestore 규칙이 허용하는 범위만):
  - 게시판 좋아요/취소(likedBy·likeCount), 댓글 작성/삭제(commentCount 증감 포함)
  - 패치노트/이벤트 좋아요 (`likes` 컬렉션 토글)
  - `users/{uid}` 문서 생성·갱신 (닉네임/프로필 아이콘/설정/통계/즐겨찾기)
- 기존 데이터 삭제·수정·구조 변경 없음

## 5. 주요 기능

| 영역 | 내용 |
|---|---|
| 홈 | 배너 롤링 + 패치 티커, 4개 Box — 이벤트 없음 시 데스크톱은 패치노트 Box 확장(12개), 모바일은 이벤트 Box만 숨김 |
| 캐릭터 | 등급/속성/타입/정렬/즐겨찾기/검색/새로고침, 상세 팝업(스킬·서폿스킬·패치 히스토리·팁), XS4/SM6/MD7/LG8 컬럼 |
| PvP 패치 | 버프/너프/기능수정 3섹션(모바일 세로 1열), 원형 캐릭터 이미지 + 반걸침 뱃지, 상세 팝업 |
| 커뮤니티 | 패치노트(월별 필터), 게시판(자유/정보/질문/자랑, 카드·목록형, 3종 정렬), 이벤트(전체/진행중/종료됨, 기본 카드형) |
| 상세 공통 | 본문 + 좋아요(토글)/공유(Web Share API→클립보드) 중앙 정렬 + 댓글(게시판·이벤트) + 현재 목록 Box |
| 고객센터 | 검색(제목·본문·작성자), Border 없는 목록, 상세(좋아요/공유 없음), 1:1 문의, 나의 문의 |
| 계정 | 이메일 가입(메일 인증+임시 인증번호), Google 로그인, 프로필 카드(게시글/댓글/좋아요 수), 내 정보(아이콘/닉네임/이메일/탈퇴) |
| 설정 | 공지사항, 알림 ON/OFF 4종, 다크/라이트 테마, 앱 아이콘 변경+바로가기, 한국어/English |
| 반응형 | LG/MD/SM/XS — 모바일 하단 탭·드로어 메뉴, 가로 스크롤 없음, 터치 영역 44px+ |

## 6. 참고

- `index.html`은 서브폴더 배포를 대비한 에셋 로더(상대경로 우선 → 절대경로 재시도) 포함.
- 로딩 중 스켈레톤, 데이터 없음 Empty State, Firebase 오류는 토스트로 사용자에게 안내.
