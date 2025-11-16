# Mission-Driven Frontend Assignment

본 레포지토리는 **Mission-Driven 프론트엔드 과제 제출용 프로젝트**입니다.  
제공된 **Figma 시안**을 기준으로 콘텐츠 등록 페이지를 구현하였으며,  
Next.js 16 기반으로 개발 후 AWS EC2 환경에 배포하였습니다.

---

## 📍 Deployment

- **URL:** http://54.180.153.212
- **Infra:** AWS EC2 (t3.micro, Free Tier)
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx

---

## 🔧 Features

### UI / Interaction

- 제공된 Figma 시안 기반 콘텐츠 등록 폼 구현
- 반응형 레이아웃 (모바일/데스크탑 대응)
- 컴포넌트 단위 구조화로 재사용성 및 유지보수성 향상
- 주요 사용자 인터랙션 구현
  - 이미지 업로드 및 미리보기
  - 카테고리 선택 모달
  - 날짜 선택기 (CustomDayPicker)
  - 시간 입력 (24시간 형식 셀렉트)
  - 다중 회차 관리
  - 실시간 폼 검증

### Development

- Next.js 16 (App Router) 기반 구조
- TypeScript로 정적 타입 검사 적용
- React Server/Client Component 분리
- 폴더 구조를 역할 단위로 정리하여 유지보수성 강화
- 커스텀 훅을 통한 로직 재사용
- Zustand를 활용한 전역 상태 관리

### UX Improvements

- **시간 입력 방식 개선**: Figma 시안의 오전/오후 토글 + 텍스트 입력 방식 대신 24시간 형식 셀렉트 박스로 구현
  - 모바일 환경에서 키보드 전환 불필요
  - 00시(자정)와 12시(정오)의 모호함 해소
  - 시간의 순서와 범위를 직관적으로 표현
- **이미지 최적화**: 업로드 시 자동 리사이징 (대표 이미지: 800x800px, 추가 이미지: 600x600px)
- **메모리 관리**: Blob URL 자동 해제로 메모리 누수 방지
- **시작 시간 변경 시 종료 시간 자동 조정**: 사용자 편의성 향상

---

## 🛠 Tech Stack

### Frontend

- Next.js 16.0.1
- React 19.2.0
- TypeScript 5
- Yarn

### Styling

- Tailwind CSS 4
- Pretendard 폰트

### State Management

- Zustand 5.0.8

### UI Libraries

- Sonner (Toast 알림)
- Motion (애니메이션)
- react-day-picker (날짜 선택)
- date-fns (날짜 처리)

### Deployment

- AWS EC2 (Ubuntu 22.04)
- PM2 (프로세스 관리)
- Nginx (Reverse Proxy)
- Node.js 20 LTS
- 로컬 빌드 후 EC2 업로드 방식 적용

---

## 🚀 Getting Started

### Install dependencies

```bash
yarn install
```

### Local development

```bash
yarn dev
```

### Production build

```bash
yarn build
yarn start
```

---

## 🌐 Deployment Architecture

서비스는 아래와 같은 구조로 배포되었습니다:

Client → Nginx(80) → PM2(3000) → Next.js (Production)

### Deployment Steps

#### 1) Local Build

EC2 t3.micro 환경에서 Next.js 빌드 시 메모리 부족 문제가 있어,  
로컬에서 빌드 후 빌드 결과물을 EC2로 업로드하는 방식을 사용했습니다.

#### 2) EC2로 업로드

```bash
scp -i mission-driven.pem project.zip ubuntu@{EC2_IP}:~
```

#### 3) 압축 해제 & 의존성 설치

```bash
unzip project.zip -d mission-driven
cd mission-driven
yarn install --production
```

#### 4) PM2로 실행

```bash
pm2 start yarn --name mission-driven -- start
pm2 startup
pm2 save
```

#### 5) Nginx Reverse Proxy 설정

#### (파일 위치: /etc/nginx/sites-available/mission-driven)

```nginx
server {
    listen 80;
    server_name 54.180.153.212;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📁 Folder Structure

```
mission-driven/
├── app/                      # Next.js App Router
│   ├── _components/          # 페이지별 컴포넌트
│   │   ├── RegistContent.tsx # 콘텐츠 등록 폼 메인 컴포넌트
│   │   └── SessionComponent.tsx # 회차별 정보 입력 컴포넌트
│   ├── _template/            # 페이지 템플릿
│   │   └── RegistTemplate.tsx
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 메인 페이지
│   └── globals.css          # 전역 스타일
├── components/              # 재사용 가능한 컴포넌트
│   ├── button/
│   ├── customDayPicker/
│   ├── dialog/
│   ├── header/
│   ├── heading/
│   ├── icons/
│   ├── imageButton/
│   ├── loading/
│   ├── select/
│   └── textarea/
├── hooks/                   # 커스텀 훅
│   ├── useDialog.ts
│   ├── useToast.tsx
│   └── useWindowWidth.ts
├── stores/                  # Zustand 스토어
│   └── useDialogStore.ts
├── utils/                   # 유틸리티 함수
│   ├── calcTime.ts         # 시간 계산 로직
│   └── imageResize.ts      # 이미지 리사이징
├── models/                  # TypeScript 타입 정의
│   ├── category.ts
│   └── contents.ts
├── data/                    # 정적 데이터
│   ├── categories.ts
│   └── time.ts
└── modals/                  # 모달 컴포넌트
    └── CategoryModal.tsx
```

---

## ✔ Requirements Checklist

- [x] Figma 시안 기반 UI 구현
- [x] Next.js + React + TypeScript 사용
- [x] 주요 기능 요구사항 충족
  - [x] 이미지 업로드 (대표 이미지 필수, 추가 이미지 선택)
  - [x] 카테고리 선택
  - [x] 콘텐츠 제목 입력
  - [x] 활동 방식 선택 (온라인/오프라인)
  - [x] 회차별 정보 입력 (날짜, 시간, 활동 내용)
  - [x] 다중 회차 추가/삭제
  - [x] 실시간 폼 검증
- [x] Git Commit 이력을 논리적으로 분리하여 관리
- [x] AWS EC2 배포 완료
- [x] Nginx Reverse Proxy 설정
- [x] PM2를 통한 프로세스 관리 적용
- [x] 서버 재부팅 시 자동 실행 구성 완료

---

## 🧠 Technical Considerations

### 배포 관련

- EC2 t3.micro 환경에서 Next.js 빌드 시 메모리 부족 문제가 발생하여  
  **로컬 빌드 후 EC2로 업로드**하는 방식으로 배포 전략을 수정했습니다.

- Next.js 16은 **Node.js 20 이상**을 요구하여  
  NodeSource를 이용해 Node.js 20 LTS 버전으로 재설치했습니다.

- 외부 접근 포트 문제 해결을 위해  
  보안 그룹 및 Nginx Reverse Proxy(80 → 3000)를 적용했습니다.

- 프로세스가 종료되거나 서버 재부팅 후 자동으로 복원되도록  
  **PM2 startup / pm2 save** 설정을 구성했습니다.

### 개발 관련

- **UX 개선**: Figma 시안의 시간 입력 방식을 24시간 형식 셀렉트로 변경
  - 사용성 향상 및 시간 표현의 명확성 확보
  - 변경 이유는 `SessionComponent.tsx`에 주석으로 문서화

- **이미지 처리 최적화**
  - 업로드 시 자동 리사이징으로 메모리 및 네트워크 부담 감소
  - Blob URL 관리로 메모리 누수 방지

- **상태 관리**
  - Zustand를 활용한 전역 상태 관리 (Dialog)
  - 부모-자식 컴포넌트 간 props drilling 최소화

- **날짜 선택 로직**
  - 회차 간 날짜 충돌 방지 (minDate/maxDate 자동 계산)
  - 이전/다음 회차와의 시간순 정렬 강제

- **시간 계산 로직**
  - 분 단위로 변환하여 계산 (24시간 = 1440분)
  - 시작 시간 변경 시 종료 시간 자동 조정
  - 종료 시간 검증 (시작 시간보다 빠를 수 없음)

- **폴더 구조**
  - 역할과 책임 단위로 분리하여 유지보수성과 확장성 고려
  - 컴포넌트, 훅, 유틸리티, 타입 정의 등 명확한 분리

---

## 🔮 Future Improvements

현재는 과제 제출용으로 구현되었으나, 실제 서비스 환경에서는 아래와 같은 개선사항을 추가할 예정입니다.

### API 연동 및 데이터 처리

- **백엔드 API 연동**
  - 콘텐츠 등록 API 연동 (`POST /api/contents`)
  - 이미지 업로드 API 연동 (멀티파트 폼 데이터 처리)
  - 카테고리 목록 조회 API 연동 (`GET /api/categories`)
  - React Query 또는 SWR을 통한 데이터 페칭 및 캐싱
  - API 에러 핸들링 및 재시도 로직 구현

- **이미지 처리 개선**
  - 클라이언트 리사이징 후 서버로 업로드
  - 이미지 업로드 진행률 표시
  - 이미지 업로드 실패 시 재시도 기능
  - S3 또는 CloudFront를 통한 이미지 CDN 연동

- **폼 제출 개선**
  - 폼 데이터 검증 강화 (서버 사이드 검증 포함)
  - 제출 중 로딩 상태 관리
  - 제출 성공/실패 피드백 개선
  - 제출 후 리다이렉트 또는 상태 초기화

### CI/CD 파이프라인 구축

- **GitHub Actions / GitLab CI를 통한 자동 배포**

  ```yaml
  # 예시: GitHub Actions workflow
  - 코드 푸시 시 자동 빌드 및 테스트 실행
  - main 브랜치 머지 시 자동 배포 트리거
  - 빌드 성공 시 EC2로 자동 배포
  - 배포 전 자동 테스트 실행 (단위 테스트, E2E 테스트)
  ```

- **배포 자동화 프로세스**
  - 로컬 빌드 → 수동 업로드 방식에서 **자동 배포**로 전환
  - EC2 인스턴스에 SSH를 통한 자동 배포 스크립트 실행
  - PM2 자동 재시작 및 헬스 체크
  - 배포 롤백 메커니즘 구현

- **환경 변수 관리**
  - `.env` 파일을 통한 환경별 설정 분리
  - GitHub Secrets를 통한 민감 정보 관리
  - 개발/스테이징/프로덕션 환경 분리

- **배포 전 검증**
  - TypeScript 타입 체크
  - ESLint 및 Prettier 검사
  - 빌드 성공 여부 확인
  - 배포 후 스모크 테스트 자동 실행

### 기타 개선사항

- **성능 최적화**
  - Next.js Image Optimization 적용
  - 코드 스플리팅 및 동적 임포트 최적화
  - Lighthouse 성능 점수 개선 (목표: 90점 이상)

- **에러 핸들링 강화**
  - 에러 로깅 시스템 연동 (Sentry 등)

- **모니터링 및 로깅**
  - 애플리케이션 모니터링 도구 연동
  - 사용자 행동 분석 (Google Analytics 등)
  - 성능 모니터링

- **인프라 개선**
  - Docker 기반 배포 환경 구축
  - 로드 밸런서 및 오토 스케일링 구성
  - 도메인 설정 및 DNS 구성
    - 커스텀 도메인 구매 및 연결
    - DNS 레코드 설정 (A 레코드, CNAME 등)
    - SSL/TLS 인증서 설정 (Let's Encrypt, AWS Certificate Manager 등)
    - Nginx 도메인 설정 및 HTTPS 리다이렉트
    - 서브도메인 관리 (www, api 등)

---

## ✉ Contact

과제 및 프로젝트 관련 문의는 아래 이메일로 연락 부탁드립니다.

freechird1@naver.com

---
