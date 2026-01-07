# 💰 금융 계산기 - 무료 금융 도구 모음

대출, 적금, 투자, 퇴직금, 환율 계산을 한 곳에서!

## 📊 제공하는 계산기

1. **대출 계산기** - 주택담보/신용대출 월 상환금 계산
2. **적금 계산기** - 적금 만기 금액 및 이자 계산
3. **투자 수익률 계산기** - 복리 투자 시뮬레이션
4. **퇴직금 계산기** - 근속 기간별 퇴직금 계산
5. **환율 계산기** - 실시간 환율 조회 및 환전 계산

## 🚀 GitHub Pages로 무료 배포하기

### 1. GitHub Repository 생성
```bash
cd finance-tools
git init
git add .
git commit -m "Initial commit: 금융 계산기 웹사이트"
```

### 2. GitHub에 Push
```bash
# GitHub에서 새 repository 생성 (예: finance-tools)
git remote add origin https://github.com/yourusername/finance-tools.git
git branch -M main
git push -u origin main
```

### 3. GitHub Pages 활성화
1. GitHub repository 페이지 접속
2. **Settings** 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source**에서 **main** 브랜치 선택
5. **Save** 클릭
6. 약 1-2분 후 `https://yourusername.github.io/finance-tools/` 에서 접속 가능!

### 4. sitemap.xml과 robots.txt 업데이트
배포 후 다음 파일들에서 `yourusername`을 본인 GitHub 아이디로 변경:
- `sitemap.xml` (모든 URL)
- `robots.txt` (Sitemap URL)

```bash
# 수정 후 다시 push
git add .
git commit -m "Update sitemap and robots.txt with actual domain"
git push
```

## 🔍 Google 검색 노출 (SEO)

### 1. Google Search Console 등록
1. [Google Search Console](https://search.google.com/search-console) 접속
2. **속성 추가** 클릭
3. **URL 접두어** 선택 후 사이트 주소 입력
4. **소유권 확인** - HTML 파일 다운로드 후 프로젝트 루트에 업로드
   ```bash
   # googleXXXXXXXXXXXXXXXX.html 파일을 finance-tools/ 폴더에 넣고
   git add googleXXXXXXXXXXXXXXXX.html
   git commit -m "Add Google Search Console verification"
   git push
   ```
5. **확인** 클릭
6. **Sitemaps** 메뉴에서 `sitemap.xml` 제출

### 2. 네이버 웹마스터 도구 등록
1. [네이버 웹마스터 도구](https://searchadvisor.naver.com/) 접속
2. 사이트 등록 후 소유권 확인
3. 사이트맵 제출: `https://yourusername.github.io/finance-tools/sitemap.xml`

### 3. 다음(Daum) 검색등록
1. [다음 검색등록](https://register.search.daum.net/index.daum) 접속
2. URL 등록

## 💵 Google AdSense로 수익 창출

### AdSense 신청 전 체크리스트
- ✅ 사이트가 2-4주 이상 운영됨
- ✅ 20-30개 이상의 양질의 콘텐츠 (현재 5개 계산기 완료)
- ✅ 개인정보처리방침 페이지 (선택사항이지만 권장)
- ✅ 저작권 문제 없는 오리지널 콘텐츠
- ✅ 사용자 친화적인 디자인 (완료)

### AdSense 신청 단계

#### 1단계: AdSense 계정 생성
1. [Google AdSense](https://www.google.com/adsense/) 접속
2. **시작하기** 클릭
3. 사이트 URL 입력: `https://yourusername.github.io/finance-tools/`
4. 이메일과 개인정보 입력

#### 2단계: 사이트에 AdSense 코드 추가
승인 대기 중에도 광고 코드를 추가해야 합니다.

1. AdSense에서 제공하는 코드 복사
2. 모든 HTML 파일의 `<head>` 태그에 추가:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossorigin="anonymous"></script>
   ```

3. 광고 위치에 코드 추가 (이미 주석으로 준비됨):
   ```html
   <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
   <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
   </script>
   ```

#### 3단계: 승인 대기
- 승인까지 보통 **1일~2주** 소요
- 승인 거절 시 **1개월 후** 재신청 가능

#### 4단계: 승인 후
1. 광고 단위 생성
2. 광고 코드를 각 계산기 페이지에 배치
3. 수익 발생 시작!

### AdSense 수익 최적화 팁
- 광고는 페이지당 3-4개 정도가 적당
- 콘텐츠 사이에 자연스럽게 배치
- 모바일 최적화 필수 (이미 완료됨)
- 페이지 로딩 속도 중요
- 사용자 경험을 해치지 않도록 주의

## 📈 트래픽 증가 전략

### 1. SEO 최적화 (완료)
- ✅ 메타 태그 최적화
- ✅ sitemap.xml 생성
- ✅ robots.txt 설정
- ✅ 모바일 반응형

### 2. 콘텐츠 추가 (추천)
- 각 계산기에 관련 정보 추가 (이미 완료)
- 금융 팁, 가이드 문서 추가
- 자주 묻는 질문(FAQ) 섹션

### 3. 소셜 미디어 활용
- 블로그에 소개 글 작성
- 커뮤니티(클리앙, 뽐뿌 등)에 유용한 도구로 소개
- 네이버 카페, 블로그에 링크 공유

### 4. 검색 키워드 공략
현재 타겟 키워드:
- "대출 계산기", "적금 계산기"
- "투자 수익률 계산", "퇴직금 계산"
- "환율 계산기", "실시간 환율"

## 🛠 기술 스택

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **호스팅**: GitHub Pages (무료)
- **API**: exchangerate-api.com (실시간 환율)
- **Analytics**: Google Analytics (추가 권장)
- **광고**: Google AdSense

## 📝 라이선스

이 프로젝트는 개인 사용 및 학습 목적으로 자유롭게 사용 가능합니다.

## 🎯 다음 할 일

- [ ] GitHub Pages 배포
- [ ] Google Search Console 등록
- [ ] 네이버 웹마스터 도구 등록
- [ ] Google AdSense 신청
- [ ] Google Analytics 추가 (선택)
- [ ] 개인정보처리방침 페이지 추가 (AdSense 승인율 상승)

## 💡 문의

이슈나 개선 사항이 있으면 GitHub Issues를 통해 알려주세요!
