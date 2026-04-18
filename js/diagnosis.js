function openPortfolio() {
  document.getElementById('portfolio-modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closePortfolio() {
  document.getElementById('portfolio-modal').style.display = 'none';
  document.body.style.overflow = '';
}
document.getElementById('portfolio-modal').addEventListener('click', function(e) {
  if (e.target === this) closePortfolio();
});

function setDiagTab(idx) {
  document.getElementById('diagnosis').scrollIntoView({behavior:'smooth'});
}

/* ── 수리 진단 — suri-db.js + manse-db.js 직접 사용 ── */

const CHOSUNG_OHANG_MAP = {
  'ㄱ':'木','ㄲ':'木','ㅋ':'木',
  'ㄴ':'火','ㄷ':'火','ㄸ':'火','ㄹ':'火','ㅌ':'火',
  'ㅇ':'土','ㅎ':'土',
  'ㅅ':'金','ㅆ':'金','ㅈ':'金','ㅉ':'金','ㅊ':'金',
  'ㅁ':'水','ㅂ':'水','ㅃ':'水','ㅍ':'水'
};
const CHO_LIST_D = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const ONAME_D = {'木':'목(木)','火':'화(火)','土':'토(土)','金':'금(金)','水':'수(水)'};
const OEMO_D  = {'木':'🌿','火':'🔥','土':'⛰','金':'⚡','水':'💧'};
const GEN_D = {'木':'火','火':'土','土':'金','金':'水','水':'木'};
const KIL_D = {'木':'土','火':'金','土':'水','金':'木','水':'火'};

// 흉괘 목록 (상담 요망 기준)
const HYUNG_GUA_LIST = ['화택규','산지박','산풍고','천수송'];

/* ── 괘별 운세 점수 테이블 ── */
// 재물(財), 직업(職), 건강(健), 가정(家), 연애(戀), 종합(綜)
// 점수 1~5 (0.5 단위 가능)
const GUA_FORTUNE = {
  '건위천':    {재:3,직:5,건:3,가:3,연:2,종:4},
  '천택리':    {재:3,직:4,건:3,가:3,연:3,종:3},
  '천화동인':  {재:4,직:5,건:4,가:4,연:4,종:4.5},
  '천뢰무망':  {재:3.5,직:3.5,건:4,가:4,연:3.5,종:3.5},
  '천풍구':    {재:3,직:3,건:3,가:2,연:2,종:2.5},
  '천수송':    {재:2,직:2,건:2,가:1.5,연:1.5,종:1.5},
  '천산둔':    {재:2,직:2,건:3,가:2.5,연:2,종:2},
  '천지비':    {재:2,직:2,건:2.5,가:2,연:2,종:2},
  '택천쾌':    {재:3,직:3.5,건:3,가:3,연:3,종:3},
  '태위택':    {재:3,직:3,건:3,가:2.5,연:3,종:3},
  '택화혁':    {재:3.5,직:3.5,건:3,가:2.5,연:2.5,종:3},
  '택뢰수':    {재:3,직:3,건:3,가:3,연:3,종:3},
  '택풍대과':  {재:4,직:4.5,건:3.5,가:3.5,연:3.5,종:4},
  '택수곤':    {재:2,직:2,건:2,가:2,연:2,종:2},
  '택산함':    {재:3,직:3.5,건:3,가:4,연:4,종:3.5},
  '택지췌':    {재:4.5,직:4,건:3.5,가:4,연:3.5,종:4},
  '화천대유':  {재:5,직:4,건:3.5,가:3.5,연:3.5,종:4},
  '화택규':    {재:2,직:2,건:2,가:1.5,연:1.5,종:1.5},
  '이위화':    {재:3.5,직:3.5,건:3,가:3,연:3.5,종:3},
  '화뢰서합':  {재:3,직:3.5,건:3.5,가:3,연:3,종:3},
  '화풍정':    {재:3.5,직:5,건:4,가:3.5,연:3.5,종:4},
  '화수미제':  {재:4,직:4,건:3.5,가:3.5,연:3.5,종:3.5},
  '화산려':    {재:2.5,직:2.5,건:2.5,가:2,연:2.5,종:2.5},
  '화지진':    {재:4,직:4.5,건:3.5,가:3.5,연:3.5,종:4},
  '뇌천대장':  {재:3.5,직:3.5,건:3.5,가:3,연:3,종:3.5},
  '뇌택귀매':  {재:4,직:4.5,건:4,가:3.5,연:4,종:4},
  '뇌화풍':    {재:3.5,직:3.5,건:3,가:3,연:3,종:3},
  '진위뢰':    {재:3,직:3,건:3,가:2.5,연:2.5,종:2.5},
  '뇌풍항':    {재:3.5,직:3.5,건:3.5,가:4,연:4,종:3.5},
  '뇌수해':    {재:3.5,직:3.5,건:3.5,가:3.5,연:3.5,종:3.5},
  '뇌산소과':  {재:2.5,직:2.5,건:3,가:2.5,연:2.5,종:2.5},
  '뇌지예':    {재:4,직:4,건:3.5,가:4,연:3.5,종:4},
  '풍천소축':  {재:2.5,직:2.5,건:3,가:3,연:3,종:2.5},
  '풍택중부':  {재:3,직:3,건:3.5,가:3.5,연:3.5,종:3},
  '풍화가인':  {재:3.5,직:3.5,건:3.5,가:5,연:4.5,종:4},
  '풍뢰익':    {재:4.5,직:4,건:4,가:4,연:4,종:4},
  '손위풍':    {재:4,직:4,건:3.5,가:3,연:3,종:3.5},
  '풍수환':    {재:3,직:3,건:3,가:2.5,연:2.5,종:2.5},
  '풍산점':    {재:3,직:3,건:3.5,가:3.5,연:3.5,종:3},
  '풍지관':    {재:3.5,직:4,건:3.5,가:3.5,연:3.5,종:3.5},
  '수천수':    {재:3.5,직:4,건:3.5,가:3.5,연:3.5,종:3.5},
  '수택절':    {재:3,직:3,건:3.5,가:3,연:3,종:3},
  '수화기제':  {재:4,직:4,건:3.5,가:3.5,연:3.5,종:3.5},
  '수뢰둔':    {재:2,직:2.5,건:2.5,가:2.5,연:2.5,종:2.5},
  '수풍정':    {재:5,직:4,건:4,가:4,연:3.5,종:4},
  '중수감':    {재:2,직:2,건:2,가:2,연:2,종:2},
  '수산건':    {재:2,직:2,건:2.5,가:2.5,연:2.5,종:2},
  '수지비':    {재:4,직:4,건:4,가:4.5,연:4,종:4},
  '산천대축':  {재:5,직:4.5,건:4,가:4,연:3.5,종:4.5},
  '산택손':    {재:2.5,직:2.5,건:3,가:3,연:3,종:2.5},
  '산화비':    {재:3.5,직:5,건:3.5,가:3.5,연:3.5,종:4},
  '산뢰이':    {재:3,직:3,건:3,가:3,연:3,종:3},
  '산풍고':    {재:2,직:2,건:2,가:2,연:2,종:2},
  '산수몽':    {재:3,직:3,건:3,가:3,연:3,종:3},
  '간위산':    {재:2.5,직:2.5,건:3,가:2.5,연:2.5,종:2.5},
  '산지박':    {재:1.5,직:1.5,건:2,가:1.5,연:1.5,종:1.5},
  '지천태':    {재:4.5,직:4.5,건:4.5,가:4.5,연:4.5,종:4.5},
  '지택림':    {재:4,직:4.5,건:3.5,가:4,연:4,종:4},
  '지화명이':  {재:3,직:3.5,건:3,가:3,연:3,종:3},
  '지뢰복':    {재:3.5,직:3.5,건:3.5,가:3.5,연:3.5,종:3.5},
  '지풍승':    {재:4,직:5,건:4,가:4,연:4,종:4.5},
  '지수사':    {재:3,직:4,건:3,가:3,연:2.5,종:3},
  '지산겸':    {재:3.5,직:3.5,건:3.5,가:4,연:3.5,종:3.5},
  '곤위지':    {재:3.5,직:3.5,건:3.5,가:4,연:3.5,종:3.5},
};

/* 수리별 운세 점수 테이블 — l값 기반, 특성 있는 수리는 항목별 차등 */
const SURI_FORTUNE = (() => {
  const sI = n => (typeof SURI !== 'undefined' && SURI[n]) ? SURI[n] : {l:3};
  // l값 → 기본 점수
  const base = l => ({1:2, 2:2.5, 3:3, 4:4, 5:4.5}[l] || 3);

  // 81수 전체 기본값 생성
  const t = {};
  for (let i = 1; i <= 81; i++) {
    const l = sI(i).l;
    const b = base(l);
    t[i] = {재:b, 직:b, 건:b, 가:b, 연:b, 종:b};
  }

  // 특성이 명확한 수리 보정
  // 1 출발권위 — 직업·종합 강
  t[1]  = {재:4,   직:5,   건:4,   가:3.5, 연:3,   종:4.5};
  // 3 지도적인물 — 직업·재물 강
  t[3]  = {재:4.5, 직:5,   건:4,   가:3.5, 연:3.5, 종:4.5};
  // 5 부귀봉록 — 재물 강
  t[5]  = {재:5,   직:4.5, 건:4,   가:4,   연:4,   종:4.5};
  // 6 계승발전 — 가정 강
  t[6]  = {재:4,   직:4,   건:4.5, 가:5,   연:4,   종:4.5};
  // 7 맹호출림 — 직업·재물 강
  t[7]  = {재:4.5, 직:5,   건:4,   가:3.5, 연:3,   종:4.5};
  // 8 수복겸전 — 전항목 균형 길
  t[8]  = {재:4.5, 직:4.5, 건:5,   가:4.5, 연:4,   종:4.5};
  // 11 중인신망 — 연애·가정 강
  t[11] = {재:3.5, 직:4,   건:3.5, 가:4.5, 연:4.5, 종:4};
  // 13 총명지모 — 직업 최강
  t[13] = {재:4,   직:5,   건:4,   가:3.5, 연:3.5, 종:4.5};
  // 15 군계일학 — 직업·명예 강
  t[15] = {재:4,   직:5,   건:4,   가:4,   연:3.5, 종:4.5};
  // 16 덕망유복 — 가정·연애 강
  t[16] = {재:4,   직:4.5, 건:4,   가:5,   연:4.5, 종:4.5};
  // 17 명망사해 — 직업 강, 가정 보통
  t[17] = {재:4,   직:4.5, 건:3.5, 가:3,   연:3,   종:4};
  // 18 부귀영달 — 재물·직업 강
  t[18] = {재:5,   직:5,   건:4,   가:3.5, 연:3.5, 종:4.5};
  // 21 두령수 — 직업 강, 연애·가정 약
  t[21] = {재:4,   직:5,   건:4,   가:2.5, 연:2,   종:4};
  // 23 일흥중천 — 직업 강, 가정 약
  t[23] = {재:4,   직:5,   건:4,   가:2,   연:2,   종:4};
  // 24 부귀영화재물풍부 — 재물 최강
  t[24] = {재:5,   직:4.5, 건:4,   가:4,   연:4,   종:4.5};
  // 25 지모순조 — 균형 길
  t[25] = {재:4.5, 직:4.5, 건:4,   가:4,   연:4,   종:4.5};
  // 27 대인격 — 직업(예술) 강, 가정 약
  t[27] = {재:3.5, 직:4.5, 건:3.5, 가:2.5, 연:3,   종:4};
  // 29 권력재물 — 재물·직업 강
  t[29] = {재:5,   직:5,   건:4,   가:3.5, 연:3.5, 종:4.5};
  // 31 자수성가 — 균형 대길
  t[31] = {재:4.5, 직:4.5, 건:4,   가:4,   연:4,   종:4.5};
  // 32 의외득재 — 재물 강
  t[32] = {재:5,   직:4,   건:4,   가:4,   연:4,   종:4.5};
  // 33 권위충천 — 재물·직업 강
  t[33] = {재:5,   직:5,   건:4,   가:3.5, 연:3,   종:4.5};
  // 35 온유화순 — 가정·건강 강
  t[35] = {재:4,   직:4,   건:5,   가:5,   연:4.5, 종:4.5};
  // 37 권위인덕 — 직업·재물 강
  t[37] = {재:4.5, 직:5,   건:4,   가:4,   연:3.5, 종:4.5};
  // 38 문예기예 — 직업(예술) 강, 재물 보통
  t[38] = {재:3.5, 직:5,   건:3.5, 가:3.5, 연:3.5, 종:4};
  // 39 위세강중 — 직업·재물 강
  t[39] = {재:4.5, 직:5,   건:4,   가:3.5, 연:3,   종:4.5};
  // 41 선견고명 — 균형 대길
  t[41] = {재:4.5, 직:4.5, 건:4,   가:4,   연:4,   종:4.5};
  // 45 통달사해 — 전항목 강
  t[45] = {재:4.5, 직:5,   건:4,   가:4,   연:4,   종:5};
  // 47 일확천금 — 재물 강
  t[47] = {재:5,   직:4.5, 건:4,   가:4,   연:3.5, 종:4.5};
  // 48 배후조종 — 가정·종합 강
  t[48] = {재:4,   직:4,   건:4.5, 가:5,   연:4,   종:4.5};
  // 52 비룡승천 — 재물·직업 강
  t[52] = {재:5,   직:5,   건:4,   가:3.5, 연:3.5, 종:4.5};
  // 57 고진감래 — 균형 대길
  t[57] = {재:4.5, 직:4.5, 건:4.5, 가:4.5, 연:4,   종:4.5};
  // 58 선흉후길 — 직업·명예 강
  t[58] = {재:4,   직:4.5, 건:3.5, 가:3.5, 연:3.5, 종:4};
  // 61 영달격
  t[61] = {재:4.5, 직:5,   건:4,   가:4,   연:3.5, 종:4.5};
  // 63 길상격
  t[63] = {재:4.5, 직:4.5, 건:4.5, 가:4.5, 연:4.5, 종:4.5};
  // 65 유덕격
  t[65] = {재:4,   직:4,   건:4.5, 가:5,   연:4.5, 종:4.5};
  // 67 형통격
  t[67] = {재:4.5, 직:5,   건:4,   가:4,   연:4,   종:4.5};
  // 68 공명격
  t[68] = {재:4.5, 직:5,   건:4,   가:4,   연:4,   종:4.5};
  // 71 발전격
  t[71] = {재:4,   직:4.5, 건:4,   가:4,   연:4,   종:4.5};
  // 73 노력격
  t[73] = {재:3.5, 직:4,   건:3.5, 가:3.5, 연:3.5, 종:4};
  // 75 수분격
  t[75] = {재:3.5, 직:4,   건:4,   가:4,   연:4,   종:4};
  // 77 희비격
  t[77] = {재:3.5, 직:4,   건:3.5, 가:3.5, 연:3.5, 종:4};
  // 78 만고격
  t[78] = {재:3.5, 직:4,   건:3.5, 가:3.5, 연:3.5, 종:4};
  // 81 환원격 — 전항목 대길
  t[81] = {재:5,   직:5,   건:5,   가:5,   연:5,   종:5};

  return t;
})();

/* 6가지 운세 별점 계산 */

/* ── 별점 엔진 (판정 엔진과 완전 분리 — 시간축 가중치 적용) ── */
function calcFortuneStars(hangulSuri, hanjaSuri, guaObj, age) {
  age = age || 35;
  const hs = hangulSuri || hanjaSuri;
  const w  = getSuriWeights(age);
  const gw = getGuaWeights(age);

  // 수리 점수 — SURI_FORTUNE × 나이 가중치
  const getSuriF = n => SURI_FORTUNE[n] || {재:3,직:3,건:3,가:3,연:3,종:3};
  function weightedSuriScore(key) {
    const total = getSuriF(hs.won)[key]*w.won + getSuriF(hs.hyung)[key]*w.hyung
                + getSuriF(hs.yi)[key]*w.yi   + getSuriF(hs.jung)[key]*w.jung;
    const wSum  = w.won + w.hyung + w.yi + w.jung;
    return total / wSum;
  }

  // 주역 점수 — GUA_FORTUNE × 나이 가중치 (원격=1~30, 이격=30~55, 정격=55+)
  const getF  = g => {
    if (!g) return null;
    if (g._avgFortune) return g._avgFortune; // 한글+한자 평균
    return GUA_FORTUNE[g.name] || null;
  };
  const wonF  = guaObj ? getF(guaObj.원격) : null;
  const yiF   = guaObj ? getF(guaObj.이격) : null;
  const jungF = guaObj ? getF(guaObj.정격) : null;
  function weightedGuaScore(key) {
    const items = [
      wonF  && {v:wonF[key],  w:gw.won},
      yiF   && {v:yiF[key],   w:gw.yi},
      jungF && {v:jungF[key], w:gw.jung},
    ].filter(Boolean);
    if (!items.length) return null;
    const wSum = items.reduce((a,b)=>a+b.w, 0);
    return items.reduce((a,b)=>a+b.v*b.w, 0) / wSum;
  }

  function calc(suriKey, guaKey) {
    const sVal = weightedSuriScore(suriKey);
    const gVal = weightedGuaScore(guaKey);
    return gVal === null ? sVal : sVal*0.3 + gVal*0.7;
  }

  return {
    재물: Math.min(5, Math.max(1, +calc('재','재').toFixed(1))),
    직업: Math.min(5, Math.max(1, +calc('직','직').toFixed(1))),
    건강: Math.min(5, Math.max(1, +calc('건','건').toFixed(1))),
    가정: Math.min(5, Math.max(1, +calc('가','가').toFixed(1))),
    연애: Math.min(5, Math.max(1, +calc('연','연').toFixed(1))),
    종합: Math.min(5, Math.max(1, +calc('종','종').toFixed(1))),
  };
}

function getChoOhangD(ch) {
  const code = ch.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return '?';
  const cho = Math.floor((code - 0xAC00) / 28 / 21);
  return CHOSUNG_OHANG_MAP[CHO_LIST_D[cho]] || '?';
}
function getOhangFromReadingD(reading) {
  return reading ? getChoOhangD(reading[0]) : '?';
}

/* 오행 배열 상극 여부 */
function hasOhangSanggeuk(ohangArr) {
  for (let i = 0; i < ohangArr.length - 1; i++) {
    const a = ohangArr[i], b = ohangArr[i+1];
    if (a==='?' || b==='?') continue;
    if (KIL_D[a]===b || KIL_D[b]===a) return true;
  }
  return false;
}

/* 주역 괘 이름이 흉괘인지 */
function isHyungGua(guaObj) {
  if (!guaObj) return false;
  const names = [guaObj.원격, guaObj.이격, guaObj.정격].filter(Boolean).map(g => g.name);
  return names.some(n =>HYUNG_GUA_LIST.includes(n));
}

/* wuxing 문자열에서 오행 추출 ("木火" → ['木','火']) */
function parseWuxing(str) {
  if (!str || str === '-') return [];
  const map = {'木':1,'火':1,'土':1,'金':1,'水':1};
  return [...str].filter(c => map[c]);
}

/* 사주 오행 분포 계산 */
function getSajuOhangDist(sajuResult) {
  const dist = {木:0, 火:0, 土:0, 金:0, 水:0};
  const wx = sajuResult.wuxing;
  ['year','month','day','time'].forEach(k => {
    parseWuxing(wx[k]).forEach(o => { if(dist[o]!==undefined) dist[o]++; });
  });
  return dist;
}

/* 사주에서 부족 오행 (0개) */
function getDeficientOhang(dist) {
  return Object.entries(dist).filter(([o,n]) => n===0).map(([o]) => o);
}

/* 이름 오행이 부족 오행을 보완하는지 — 한글 초성 기준만 사용 */
function nameCompensates(nameOhang, deficient) {
  if (!deficient.length) return true;
  const ohangSet = new Set(nameOhang.filter(o => o !== '?'));
  return deficient.every(o => ohangSet.has(o));
}

/* 한자 수리 계산 */
function calcHanjaSuriLanding(name) {
  const db = (typeof Rt !== 'undefined') ? Rt : (typeof HANJA_DB !== 'undefined' ? HANJA_DB : null);
  if (!db) return null;
  const chars = [...name.trim()];
  if (chars.length < 2) return null;
  const strokes = chars.map(c => db[c] ? db[c].s : null);
  if (strokes.some(s => s === null)) return null;
  const sS = strokes[0], nS = strokes.slice(1);
  const norm = n => { while(n > 81) n -= 80; return n; };
  return {
    chars, strokes,
    won:   norm(nS.reduce((a,b) => a+b, 0)),
    hyung: norm(sS + nS[0]),
    yi:    norm(sS + nS[nS.length-1]),
    jung:  norm(sS + nS.reduce((a,b) => a+b, 0)),
    ohang: chars.map(c => db[c] ? getOhangFromReadingD(db[c].e) : '?'),
  };
}

function suriColorClass(l) {
  if (l >= 4) return 'suri-good';
  if (l >= 3) return 'suri-mid';
  return 'suri-bad';
}

/* ── 생년월일 파싱 ── */
function parseBirth(str) {
  if (!str) return null;
  const m = str.replace(/[.\s년월일]/g, '-').match(/(\d{4})-?(\d{1,2})-?(\d{1,2})/);
  if (!m) return null;
  return { year: +m[1], month: +m[2], day: +m[3] };
}

/* ══════════════════════════════════════════════════════
   판정 엔진 — 시간축 기반 오노마 알고리즘
   수리: 원격(0~20) / 형격(21~40) / 이격(41~55) / 정격(55+, 평생)
   주역: 원격괘(1~30) / 이격괘(30~55) / 정격괘(55+)
   ※ 수리와 주역의 구간이 다름 — 각각 독립 계산 후 종합
══════════════════════════════════════════════════════ */

/* 수리 l값 → 길/흉 */
function suriIsGood(n) {
  const sI = x => (typeof SURI !== 'undefined' && SURI[x]) ? SURI[x] : {l:3};
  return sI(n).l >= 4;
}
function suriIsBad(n) {
  const sI = x => (typeof SURI !== 'undefined' && SURI[x]) ? SURI[x] : {l:3};
  return sI(n).l <= 1;
}

/* 괘 등급 분류 */
const STRONG_HYUNG_GUA = ['화택규','산지박','산풍고','천수송'];
function guaGrade(gua) {
  if (!gua) return 0; // 없음
  if (STRONG_HYUNG_GUA.includes(gua.name)) return -2; // 강흉
  // GUA_FORTUNE 기반으로 종합운 낮으면 흉
  const f = GUA_FORTUNE[gua.name];
  if (!f) return 0;
  const avg = (f.재+f.직+f.건+f.가+f.연+f.종) / 6;
  if (avg >= 4)   return 2;  // 길
  if (avg >= 3.2) return 1;  // 주의
  if (avg >= 2.5) return -1; // 흉
  return -2;                 // 강흉
}

/* 나이별 수리 가중치 */
function getSuriWeights(age) {
  if (age <= 20) return {won:1.0, hyung:0.8, yi:0.6, jung:0.8};
  if (age <= 30) return {won:0.2, hyung:1.0, yi:0.9, jung:1.0};
  if (age <= 40) return {won:0.1, hyung:1.0, yi:1.0, jung:1.0};
  if (age <= 55) return {won:0.0, hyung:0.3, yi:1.0, jung:1.0};
  return             {won:0.0, hyung:0.1, yi:0.4, jung:1.0};
}

/* 나이별 주역 가중치 (원격=1~30, 이격=30~55, 정격=55+) */
function getGuaWeights(age) {
  if (age < 30)  return {won:0.8, yi:1.0, jung:0.8};
  if (age < 55)  return {won:0.2, yi:1.0, jung:1.0};
  return             {won:0.0, yi:0.3, jung:1.0};
}

/* ── 수리 엔진 ── */
function calcSuriScore(hS, age) {
  if (!hS) return {score:0, warnings:[]};
  const w = getSuriWeights(age);
  const sI = n => (typeof SURI !== 'undefined' && SURI[n]) ? SURI[n] : {l:3};

  // 각 격 원점수: 길=+2, 흉=-2, 정격 흉=-4(특별), 정격 길=+3
  const rawScore = (n, isJung) => {
    const l = sI(n).l;
    if (isJung) return l >= 4 ? 3 : (l <= 1 ? -4 : 0);
    return l >= 4 ? 2 : (l <= 1 ? -2 : 0);
  };

  const wonS   = rawScore(hS.won,   false) * w.won;
  const hyungS = rawScore(hS.hyung, false) * w.hyung;
  const yiS    = rawScore(hS.yi,    false) * w.yi;
  const jungS  = rawScore(hS.jung,  true)  * w.jung;
  const total  = wonS + hyungS + yiS + jungS;

  const warnings = [];
  if (suriIsBad(hS.jung))          warnings.push({type:'정격흉', weight:'high'});
  if (age <= 40 && suriIsBad(hS.hyung)) warnings.push({type:'형격흉', weight:'mid'});
  if (age <= 55 && suriIsBad(hS.yi))    warnings.push({type:'이격흉', weight:'mid'});
  if (age <= 20 && suriIsBad(hS.won))   warnings.push({type:'원격흉', weight:'low'});

  return {score: total, warnings};
}

/* ── 주역 엔진 ── */
function calcGuaScore(guaObj, age) {
  if (!guaObj) return {score:0, warnings:[], hasMixedSignal:false};
  const w = getGuaWeights(age);

  const wonG  = guaGrade(guaObj.원격);
  const yiG   = guaGrade(guaObj.이격);
  const jungG = guaGrade(guaObj.정격);

  const total = wonG * w.won + yiG * w.yi + jungG * w.jung;

  const warnings = [];
  // 현재/미래 구간 강흉
  if (age < 30  && wonG  <= -2) warnings.push({type:'1구간강흉', weight:'mid'});
  if (age < 55  && yiG   <= -2) warnings.push({type:'2구간강흉', weight:'high'});
  if (jungG <= -2)               warnings.push({type:'3구간강흉', weight:'high'});
  // 현재/미래 연속 흉
  if (age < 55 && yiG < 0 && jungG < 0) warnings.push({type:'미래연속흉', weight:'high'});

  return {score: total, warnings, wonG, yiG, jungG};
}

/* ── 오행 상극 여부 ── */
function ohangConflict(ohangArr) {
  const valid = ohangArr.filter(o => o !== '?');
  return hasOhangSanggeuk(valid);
}

/* ── 최종 판정 엔진 ── */
function judgeGrade(suri, hangulSuri, guaObj, sajuDist, hangulOhang) {
  const age = suri._age || 35;
  const hS = hangulSuri || suri;

  // 한글 수리 엔진
  const suriResult = calcSuriScore(hS, age);

  // 한글 주역 엔진
  const guaResult  = calcGuaScore(guaObj, age);

  // 한자 주역 엔진 (있으면)
  let hanjaGuaResult = null;
  if (suri._mode === 'hanja') {
    try {
      const hjanjaGua = calcGua(suri.won, suri.hyung, suri.yi, suri.jung);
      hanjaGuaResult = calcGuaScore(hjanjaGua, age);
    } catch(e) {}
  }

  // 오행 상극
  const hasOhangConflict = ohangConflict(hangulOhang);

  // 전체 경고 수집
  const allWarnings = [...suriResult.warnings, ...guaResult.warnings];
  if (hanjaGuaResult) allWarnings.push(...hanjaGuaResult.warnings);

  const highWarnings = allWarnings.filter(w => w.weight === 'high');
  const midWarnings  = allWarnings.filter(w => w.weight === 'mid');

  // 한글/한자 괘 충돌 감지
  let mixedSignal = false;
  if (hanjaGuaResult) {
    const guaGoodFuture   = guaResult.yiG   >= 0 && guaResult.jungG >= 0;
    const hanjaGoodFuture = hanjaGuaResult.yiG >= 0 && hanjaGuaResult.jungG >= 0;
    if (guaGoodFuture !== hanjaGoodFuture) mixedSignal = true;
  }

  // ── 판정 ──

  // 개명 권유 조건
  const jungBad = suriIsBad(hS.jung); // 정격 흉수
  const futureSuriBad = (age <= 55 && suriIsBad(hS.yi)) || jungBad;
  const futureGuaBad  = guaResult.jungG <= -2 || (age < 55 && guaResult.yiG <= -2);
  const futureGuaBoth = hanjaGuaResult
    ? (futureGuaBad && (hanjaGuaResult.jungG <= -2 || (age < 55 && hanjaGuaResult.yiG <= -2)))
    : futureGuaBad;

  if (jungBad) {
    return { grade:'개명 권유', cls:'review', level:4,
      reasons: buildReasons2(hS, age, suriResult.warnings, guaResult, '정격 흉수') };
  }
  if (futureGuaBoth && highWarnings.length >= 2) {
    return { grade:'개명 권유', cls:'review', level:4,
      reasons: buildReasons2(hS, age, suriResult.warnings, guaResult, '미래 주역 연속 흉') };
  }
  if (futureSuriBad && futureGuaBad) {
    return { grade:'개명 권유', cls:'review', level:4,
      reasons: buildReasons2(hS, age, suriResult.warnings, guaResult, '수리+주역 미래 불안') };
  }
  if (hasOhangConflict && highWarnings.length >= 1) {
    return { grade:'개명 권유', cls:'review', level:4,
      reasons: buildReasons2(hS, age, suriResult.warnings, guaResult, '오행 상극+구조 불안') };
  }

  // 상담 요망 (충돌형)
  if (mixedSignal) {
    return { grade:'상담 요망', cls:'caution', level:2.5,
      reasons: ['한글·한자 주역괘 흐름 충돌 — 정밀 해석 필요'] };
  }
  if (highWarnings.length >= 1 && suriResult.score > 0) {
    return { grade:'상담 요망', cls:'caution', level:2.5,
      reasons: buildReasons2(hS, age, suriResult.warnings, guaResult, '수리↔주역 혼합 구조') };
  }

  // 개명 고려
  if (midWarnings.length >= 2 || (futureSuriBad || futureGuaBad)) {
    return { grade:'개명 고려', cls:'caution', level:3,
      reasons: buildReasons2(hS, age, suriResult.warnings, guaResult, '') };
  }
  if (hasOhangConflict) {
    return { grade:'개명 고려', cls:'caution', level:3,
      reasons: ['오행 상극'] };
  }

  // 개명 불필요
  return { grade:'개명 불필요', cls:'stable', level:1, reasons:[] };
}

function buildReasons2(hS, age, suriWarns, guaResult, extra) {
  const sI = n => (typeof SURI !== 'undefined' && SURI[n]) ? SURI[n] : {n:'특수수',l:3};
  const r = [];
  suriWarns.forEach(w => {
    if (w.type === '정격흉') r.push(`정격 ${hS.jung}수(${sI(hS.jung).n}) 흉수 — 평생 영향`);
    if (w.type === '이격흉') r.push(`이격 ${hS.yi}수(${sI(hS.yi).n}) 흉수`);
    if (w.type === '형격흉') r.push(`형격 ${hS.hyung}수(${sI(hS.hyung).n}) 흉수`);
  });
  if (guaResult.jungG <= -2) r.push('정격(55세+) 주역 강흉괘');
  if (age < 55 && guaResult.yiG <= -2) r.push('이격(30~55세) 주역 강흉괘');
  if (extra) r.push(extra);
  return r;
}

/* ── 판정별 안내 메시지 ── */
function getUrgencyMsg(gradeObj) {
  const msgs = {
    4: `⚠️ <strong>개명을 진지하게 검토하실 필요가 있습니다.</strong><br>
        이 상태를 방치하면 관계·재정·중요한 결정의 순간에서 반복적인 걸림돌이 생길 가능성이 높습니다.<br>
        <strong style="color:var(--green-dark);">전문 상담을 통해 정확한 원인과 개명 방향을 함께 점검해보시길 강하게 권합니다.</strong>`,
    3: `현재 이름에서 <strong>보완이 필요한 구조</strong>가 감지되었습니다.<br>
        삶의 특정 흐름에서 반복적인 걸림돌이 생길 수 있으니 전문 상담을 통해 정확한 원인을 파악해보시길 권합니다.`,
    2: `수리와 오행은 무난하지만 <strong>이름이 삶의 흐름과 완전히 조화롭지 않을 수 있습니다.</strong><br>
        이름이 막힌 느낌이 드신다면 전문 상담을 통해 정확히 확인해보세요.`,
    1: `현재 이름의 수리 구조는 전반적으로 <strong>안정적인 흐름</strong>을 보이고 있습니다.<br>
        더 세밀한 해석은 전문 상담을 통해 확인하실 수 있습니다.`,
  };
  return msgs[gradeObj.level] || msgs[1];
}

/* ── 메인 렌더 함수 ── */
function renderDiagResult(name, suri, sajuResult, hangulName) {
  const sI = n => (typeof SURI !== 'undefined' && SURI[n]) ? SURI[n] : {n:'특수수',l:3,d:'독특한 기운의 수'};

  // 오행은 항상 한글 초성 기준
  const hangulChars = hangulName ? [...hangulName] : suri.chars;
  const hangulOhang = hangulChars.map(getChoOhangD);

  // 한글 수리 별도 계산 (한자 입력 시에도 판정에 사용)
  const hangulSuri = (hangulName && typeof calcHangulSuri === 'function') ? calcHangulSuri(hangulName) : null;

  const jInfo=sI(suri.jung), hInfo=sI(suri.hyung), yInfo=sI(suri.yi), wInfo=sI(suri.won);

  // 주역괘
  let guaObj = null;
  try { guaObj = calcGua(suri.won, suri.hyung, suri.yi, suri.jung); } catch(e) {}

  // 사주 오행
  const sajuDist = sajuResult ? getSajuOhangDist(sajuResult) : null;

  // 판정
  const gradeObj = judgeGrade(suri, hangulSuri, guaObj, sajuDist, hangulOhang);

  // 등급 표시
  document.getElementById('result-title').textContent = `"${name}" 진단 결과`;
  const gradeEl = document.getElementById('result-grade');
  gradeEl.textContent = gradeObj.grade;
  gradeEl.className = 'result-grade ' + gradeObj.cls;

  // 나이/구간 + 판정 근거
  const phaseLabel = {'won':'원격 구간(0~20세)','hyung':'형격 구간(21~40세)','yi':'이격 구간(41~55세)','jung':'정격 구간(56세~)'};
  const subEl = document.getElementById('result-grade-sub');
  if (subEl) {
    const ageStr = suri._age ? `현재 ${suri._age}세 · ${phaseLabel[suri._phase]||''} · ` : '';
    const reasonStr = gradeObj.reasons && gradeObj.reasons.length
      ? '판정 근거: ' + gradeObj.reasons.map(r=>`<span style="background:rgba(0,0,0,0.06);padding:2px 8px;border-radius:2px;margin-right:4px;">${r}</span>`).join('')
      : '';
    subEl.innerHTML = `<span style="color:var(--ink3);font-size:12px;">${ageStr}</span>${reasonStr}`;
  }

  // ── 운세 별점 ──
  function starsHTML(score) {
    const full  = Math.floor(score);
    const half  = (score - full) >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) +
      (half ? '<span style="opacity:0.4;">★</span>' : '') +
      '<span style="color:#ddd;">★</span>'.repeat(empty);
  }

  const fortuneEl = document.getElementById('fortune-grid');
  try {
    const hSuriF = hangulSuri || suri;
    // 한글 수리 기반 괘
    const hGuaF = (() => { try { return calcGua(hSuriF.won, hSuriF.hyung, hSuriF.yi, hSuriF.jung); } catch(e) { return null; } })();
    // 한자 수리 기반 괘 (있으면)
    const jGuaF = (suri._mode === 'hanja') ? (() => { try { return calcGua(suri.won, suri.hyung, suri.yi, suri.jung); } catch(e) { return null; } })() : null;

    // 한글/한자 괘가 모두 있으면 평균 괘 객체 생성
    let finalGuaF = hGuaF;
    if (hGuaF && jGuaF) {
      // 괘별 GUA_FORTUNE 점수를 평균 내어 합성 객체 생성
      const avgGuaObj = {};
      ['원격','이격','정격'].forEach(k => {
        const hF = hGuaF[k] && GUA_FORTUNE[hGuaF[k].name] ? GUA_FORTUNE[hGuaF[k].name] : null;
        const jF = jGuaF[k] && GUA_FORTUNE[jGuaF[k].name] ? GUA_FORTUNE[jGuaF[k].name] : null;
        if (hF && jF) {
          // 두 괘의 GUA_FORTUNE 평균을 가진 가상 괘 객체
          const avgF = {};
          ['재','직','건','가','연','종'].forEach(key => { avgF[key] = (hF[key] + jF[key]) / 2; });
          // 기존 괘 구조 유지하되 name에 평균값 주입
          avgGuaObj[k] = {...hGuaF[k], _avgFortune: avgF};
        } else {
          avgGuaObj[k] = hGuaF[k]; // 한글만 있으면 한글 사용
        }
      });
      finalGuaF = avgGuaObj;
    }

    const stars = calcFortuneStars(hangulSuri, suri._mode==='hanja' ? suri : null, finalGuaF, suri._age || 35);
    const labels = {재물:'💰 재물운', 직업:'💼 직업운', 건강:'🌿 건강운', 가정:'🏠 가정운', 연애:'❤️ 연애운', 종합:'⭐ 종합운'};
    fortuneEl.innerHTML =
      `<div style="grid-column:1/-1;font-size:11px;letter-spacing:0.12em;color:var(--green-dark);margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(123,174,90,0.15);">수리·주역 기반 운세 분석</div>` +
      Object.entries(stars).map(([k,v]) =>
        `<div class="fortune-item">
          <div class="fortune-label">${labels[k]||k}</div>
          <div class="fortune-stars" style="color:#f0a500;">${starsHTML(v)}</div>
          <div class="fortune-score">${v.toFixed(1)} / 5.0</div>
        </div>`).join('');
    fortuneEl.style.display = 'grid';
    fortuneEl.style.gridTemplateColumns = 'repeat(3,1fr)';
    fortuneEl.style.gap = '10px';
    fortuneEl.style.marginBottom = '20px';
  } catch(e) { fortuneEl.style.display = 'none'; }

  // ── 수리/주역/오행 렌더링 헬퍼 ──
  function suriCls(n) {
    const l = sI(n).l;
    if (l >= 4) return 'good';
    if (l >= 2) return 'mid';
    return 'bad';
  }

  function renderSuriGrid(suriData, label, phase, age) {
    const phases = {
      won:   {k:'원격(元格)', range:'0~20세', desc:'이름 고유 기운'},
      hyung: {k:'형격(亨格)', range:'21~40세', desc:'직업·사회운'},
      yi:    {k:'이격(利格)', range:'41~55세', desc:'관계·내면운'},
      jung:  {k:'정격(貞格)', range:'56세~(평생)', desc:'종합·평생운'},
    };
    const keys = ['won','hyung','yi','jung'];
    let html = `<div class="suri-section-title">${label}</div>`;
    keys.forEach(k => {
      const v = suriData[k];
      const info = sI(v);
      const p = phases[k];
      const cls = suriCls(v);
      // 이미 지난 구간 표시
      const isPast = (k==='won' && age>20) || (k==='hyung' && age>40) || (k==='yi' && age>55);
      const pastMark = isPast ? ' <span style="font-size:9px;opacity:0.5;">(지남)</span>' : '';
      html += `<div class="suri-item ${cls}" style="${isPast?'opacity:0.45;':''}">
        <div class="suri-label">${p.k}${pastMark}</div>
        <div class="suri-phase">${p.range} · ${p.desc}</div>
        <div class="suri-num ${cls}">${v}</div>
        <div class="suri-name ${cls}">${info.n}</div>
        <div class="suri-desc">${info.d}</div>
      </div>`;
    });
    return html;
  }

  function renderGuaSection(guaObj, label) {
    if (!guaObj) return '';
    const items = [
      {k:'원격', g:guaObj.원격},
      {k:'이격', g:guaObj.이격},
      {k:'정격', g:guaObj.정격},
    ].filter(x => x.g);
    if (!items.length) return '';
    let html = `<div class="gua-section-title">${label}</div><div class="gua-cards">`;
    items.forEach(({k,g}) => {
      const isHyungG = HYUNG_GUA_LIST.includes(g.name);
      const cls = isHyungG ? 'bad' : 'good';
      html += `<div class="gua-card ${cls}">
        <div class="gua-card-sym">${g.sym||''}</div>
        <div class="gua-card-info">
          <div class="gua-card-top">
            <span class="gua-card-label">${k}</span>
            <span class="gua-card-name ${cls}">${g.name}${isHyungG?' ⚠️':''}</span>
            <span class="gua-card-hanja">${g.hanja||''}</span>
          </div>
          <div class="gua-card-meaning">${g.meaning||''}</div>
          <div class="gua-card-desc">${g.desc||''}</div>
        </div>
      </div>`;
    });
    html += '</div>';
    return html;
  }

  // ── 수리 사격 렌더 (괘 제외) ──
  const age = suri._age || 0;
  let gridHTML = '';

  if (hangulSuri) {
    gridHTML += renderSuriGrid(hangulSuri, '✍️ 한글 이름 수리', suri._phase, age);
  } else if (suri._mode !== 'hanja') {
    gridHTML += renderSuriGrid(suri, '✍️ 한글 이름 수리', suri._phase, age);
  }
  if (suri._mode === 'hanja') {
    gridHTML += renderSuriGrid(suri, '📖 한자 이름 수리', suri._phase, age);
  }
  document.getElementById('suri-grid').innerHTML = gridHTML;

  // ── 주역괘 (full-width 별도 영역) ──
  const guaEl = document.getElementById('gua-display');
  let guaHTML = '';
  try {
    const hSuriG = hangulSuri || suri;
    const hGua = calcGua(hSuriG.won, hSuriG.hyung, hSuriG.yi, hSuriG.jung);
    guaHTML += renderGuaSection(hGua, '☯ 한글 이름 주역괘');
  } catch(e) {}
  if (suri._mode === 'hanja') {
    try {
      const jGua = calcGua(suri.won, suri.hyung, suri.yi, suri.jung);
      guaHTML += `<div style="margin-top:16px;">` + renderGuaSection(jGua, '☯ 한자 이름 주역괘') + `</div>`;
    } catch(e) {}
  }
  guaEl.innerHTML = guaHTML;

  // 오행 (한글 초성 기준)
  let ohangHtml = '<div style="font-size:11px;color:var(--ink3);margin-bottom:6px;">오행 (한글 초성 기준)</div>';
  ohangHtml += '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px;">';
  hangulOhang.forEach((o,i) => {
    if (o==='?') return;
    ohangHtml += `<span class="ohang-chip-diag ${o}">${OEMO_D[o]||''} ${ONAME_D[o]||o}</span>`;
    if (i<hangulOhang.length-1 && hangulOhang[i+1]!=='?') {
      const next=hangulOhang[i+1];
      let rel='→';
      if(GEN_D[o]===next) rel='→ 상생 ✨';
      else if(KIL_D[o]===next) rel='→ 상극 ⚔️';
      ohangHtml+=`<span style="font-size:11px;color:var(--ink3);">${rel}</span>`;
    }
  });
  ohangHtml += `</div>`;
  document.getElementById('ohang-row').innerHTML = ohangHtml;

  // 사주 오행
  const sajuEl = document.getElementById('saju-row');
  if (sajuEl) sajuEl.style.display = 'none';

  // 주역괘
  let guaHtml = '';
  if (guaObj) {
    const guaItems = [
      guaObj.원격 ? {label:'원격', g:guaObj.원격} : null,
      guaObj.이격 ? {label:'이격', g:guaObj.이격} : null,
      guaObj.정격 ? {label:'정격', g:guaObj.정격} : null,
    ].filter(Boolean);
    const guaStr = guaItems.map(({label,g})=>{
      const isHyungG = HYUNG_GUA_LIST.includes(g.name);
      return `${label}: <span style="${isHyungG?'color:#8B2A20;font-weight:600;':''}">${g.name}${isHyungG?' ⚠️':''}</span>`;
    }).join(' / ');
    guaHtml = `<li><span class="point-icon">☯</span><span style="font-size:12px;">주역괘 — ${guaStr}</span></li>`;
  }

  const concern = document.getElementById('diag-concern').value.trim();
  document.getElementById('result-points').innerHTML = [
    concern ? `<li><span class="point-icon">💬</span><span>고민 "${concern}" — 수리·사주 연관성은 전문 상담에서 확인하실 수 있습니다.</span></li>` : '',
  ].join('');

  document.getElementById('urgency-text').innerHTML = getUrgencyMsg(gradeObj);

  // 판정 결과 재강조
  const repeatBadge = document.getElementById('result-grade-repeat-badge');
  const repeatMsg = document.getElementById('result-grade-repeat-msg');
  if (repeatBadge) {
    const colorMap = {stable:'var(--green-dark)', caution:'#c47c00', review:'#c0392b'};
    repeatBadge.style.color = colorMap[gradeObj.cls] || 'var(--green-dark)';
    repeatBadge.textContent = gradeObj.grade;
  }
  if (repeatMsg) {
    const msgMap = {
      '개명 권유': '이름 구조에서 심각한 문제가 감지되었습니다. 개명을 진지하게 검토해보세요.',
      '개명 고려': '이름에 보완이 필요한 구조가 확인되었습니다. 전문 상담으로 정확히 확인해보세요.',
      '상담 요망': '수리는 무난하나 주역괘에서 주의 신호가 나타났습니다.',
      '상담 요망': '이름이 삶의 흐름과 완전히 조화롭지 않을 수 있습니다.',
      '개명 불필요': '현재 이름의 수리 구조는 전반적으로 안정적입니다. 개명이 필요하지 않습니다.',
    };
    repeatMsg.textContent = msgMap[gradeObj.grade] || '';
  }

  // 고민 키워드 기반 상담 연결 CTA
  const concernVal = (document.getElementById('diag-concern').value || '').toLowerCase();
  const concernCtaEl  = document.getElementById('concern-cta');
  const concernTextEl = document.getElementById('concern-cta-text');
  const concernBtnEl  = document.getElementById('concern-cta-btn');
  if (concernVal && concernCtaEl) {
    const rules = [
      { keys:['진로','직장','직업','취업','이직','커리어','일'],
        text:'현재 이름 흐름과 직업 방향성이 충돌할 가능성이 있습니다. 개명 여부보다 진로 상담을 함께 보면 더 정확한 방향을 잡을 수 있습니다.',
        btn:'진로 상담 연결하기' },
      { keys:['연애','남자친구','여자친구','재회','헤어','이별','짝사랑','썸'],
        text:'이름 구조와 현재 관계 흐름을 함께 보면 반복되는 관계 패턴의 원인을 더 분명히 볼 수 있습니다.',
        btn:'연애·재회 상담 연결하기' },
      { keys:['가족','부부','남편','아내','부모','자녀','아이','갈등'],
        text:'현재 이름 흐름이 가족 관계나 정서적 충돌과 맞물리는지 함께 볼 필요가 있습니다.',
        btn:'가족 상담 연결하기' },
      { keys:['사업','매출','돈','재정','창업','브랜드','상호','장사'],
        text:'사업의 흐름은 상호·브랜드명과 본인의 이름 구조를 함께 봐야 정확합니다.',
        btn:'사업 상담 연결하기' },
      { keys:['건강','몸','피로','우울','불안','스트레스'],
        text:'이름 구조가 체력과 에너지 흐름에 미치는 영향을 함께 살펴보는 상담을 연결해드립니다.',
        btn:'삶의 흐름 상담 연결하기' },
    ];
    const matched = rules.find(r => r.keys.some(k => concernVal.includes(k)));
    if (matched) {
      concernTextEl.textContent = matched.text;
      concernBtnEl.textContent  = matched.btn;
      concernCtaEl.style.display = 'block';
    } else {
      concernCtaEl.style.display = 'none';
    }
  } else if (concernCtaEl) {
    concernCtaEl.style.display = 'none';
  }

  document.getElementById('result-box').style.display = 'block';
  setTimeout(()=>document.getElementById('result-box').scrollIntoView({behavior:'smooth',block:'nearest'}),100);
}

/* ── 사주 계산 공통 ── */
function getSaju() {
  const year  = document.getElementById('diag-year').value;
  const month = document.getElementById('diag-month').value;
  const day   = document.getElementById('diag-day').value;
  const gender = document.getElementById('diag-gender').value;
  if (!year || !month || !day) return null;
  try {
    return calcSaju(+year, +month, +day, null, null, false, gender||'남성');
  } catch(e) { console.error('사주 계산 오류:', e); return null; }
}

/* ── 나이 계산 ── */
function calcAge(year, month, day) {
  const today = new Date();
  let age = today.getFullYear() - year;
  const m = today.getMonth() + 1;
  if (m < month || (m === month && today.getDate() < day)) age--;
  return age;
}

/* ── 나이로 현재 수리 구간 판단 ── */
function getSuriPhase(age) {
  if (age <= 20) return 'won';       // 원격 구간
  if (age <= 40) return 'hyung';     // 형격 구간
  if (age <= 55) return 'yi';        // 이격 구간
  return 'jung';                     // 정격 구간
}

/* ── 통합 진단 버튼 ── */
function runDiag() {
  const year   = document.getElementById('diag-year').value;
  const month  = document.getElementById('diag-month').value;
  const day    = document.getElementById('diag-day').value;
  const gender = document.getElementById('diag-gender').value;
  const hangul = document.getElementById('diag-hangul').value.trim();
  const noHanja = document.getElementById('diag-no-hanja').checked;
  const hanja  = noHanja ? '' : document.getElementById('diag-hanja').value.trim();

  if (!year || !month || !day) {
    alert('생년월일을 선택해주세요. (정확한 나이 기반 판정에 필요합니다)'); return;
  }
  if (!gender) {
    alert('성별을 선택해주세요.'); return;
  }
  if (!hangul || hangul.length < 2) {
    alert('한글 이름을 2글자 이상 입력해주세요.'); return;
  }

  let suri = null;
  let displayName = '';

  if (!noHanja && hanja && hanja.length >= 2) {
    suri = calcHanjaSuriLanding(hanja);
    if (!suri) { alert('DB에 없는 한자가 포함되어 있습니다. 한글만으로 진단해보세요.'); return; }
    suri._mode = 'hanja';
    suri._hanjaStr = hanja;
    displayName = `${hangul}(${hanja})`;
  } else {
    suri = calcHangulSuri(hangul);
    if (!suri) { alert('이름 분석에 실패했습니다. 다시 입력해주세요.'); return; }
    suri._mode = 'hangul';
    displayName = hangul;
  }

  const age = calcAge(+year, +month, +day);
  suri._age = age;
  suri._phase = getSuriPhase(age);

  const sajuResult = getSaju();
  renderDiagResult(displayName, suri, sajuResult, hangul);
}

/* ── 한자 피커 (진단 폼용) ── */
let _diagHanjaState = [];
let _diagPickerIdx = null;

const DIAG_DUEUM_MAP = {
  '이':['이','리'],'나':['나','라'],'노':['노','로'],'뇨':['뇨','료'],
  '누':['누','루'],'뉴':['뉴','류'],'유':['유','류'],'여':['여','려'],
  '연':['연','련'],'열':['열','렬'],'염':['염','렴'],'영':['영','령'],
  '예':['예','례'],'임':['임','림'],'입':['입','립'],
  '윤':['윤','륜'],'율':['율','률'],
};

const DIAG_SURNAME_FIRST = {
  '가':'賈','강':'姜','견':'甄','경':'慶','고':'高','곽':'郭','구':'具','권':'權',
  '김':'金','나':'羅','남':'南','노':'盧','도':'都','류':'柳','마':'馬','문':'文',
  '민':'閔','박':'朴','배':'裵','백':'白','변':'卞','서':'徐','석':'石','성':'成',
  '손':'孫','송':'宋','신':'申','심':'沈','안':'安','양':'梁','오':'吳','왕':'王',
  '우':'禹','원':'元','유':'劉','윤':'尹','이':'李','임':'林','장':'張','전':'全',
  '정':'鄭','조':'趙','주':'朱','지':'池','진':'陳','차':'車','채':'蔡','최':'崔',
  '추':'秋','하':'河','한':'韓','허':'許','현':'玄','홍':'洪','황':'黃',
};

const DIAG_NAME_PREFERRED = new Set([
  '仁','義','禮','智','信','孝','誠','忠','德','善','美','賢','俊','秀','英','哲',
  '明','慧','淑','貞','珍','玉','瑾','瑞','瑛','瑩','瑜','瑤','珠','昊','昌','晟',
  '晉','晶','曄','景','熙','煜','燁','煥','炳','炫','泳','浩','淵','洵','澈','瀞',
  '淸','純','洙','洪','洋','泰','潤','植','格','桓','桂','樹','松','棟',
  '鎭','鉉','錫','鐘','鎬','銀','恩','垠','雄','龍','鳳','虎','鶴',
  '壽','福','祿','吉','慶','喜','祥','禎','民','旻','旼','玟','珉','敏','閔',
  '勝','成','聖','誠','城','志','知','祉','池','惠','彗','蕙','恩','銀','映',
  '賢','鉉','玄','顯','絢','旭','昱','煜','郁','昌','彰','昶','暢','憲',
  '順','淳','珣','純','正','靜','精','廷','貞','宇','佑','祐','碩','奭','晳',
  '基','淇','琦','琪','東','棟','彤','允','潤','閏','哲','澈','喆','弘','泓',
  '亨','享','衡','宣','善','仙','容','珍','眞','欽','欣','昕','彦','奎','圭','珪',
]);

function _diagGetByReading() {
  if (typeof Rt === 'undefined') return {};
  const db = {};
  for (const [h, d] of Object.entries(Rt)) {
    if (!db[d.e]) db[d.e] = [];
    db[d.e].push({ h, s: d.s, o: d.o });
  }
  return db;
}

function _diagGetCandidates(reading, isSurname) {
  const db = _diagGetByReading();
  const readings = DIAG_DUEUM_MAP[reading] || [reading];
  const seen = new Set();
  let list = readings.flatMap(r => db[r] || []).filter(x => {
    if (seen.has(x.h)) return false;
    seen.add(x.h); return true;
  });
  if (isSurname) {
    const sc = DIAG_SURNAME_FIRST[reading];
    return list.sort((a,b) => {
      if (sc) { if (a.h===sc) return -1; if (b.h===sc) return 1; }
      return a.s - b.s;
    });
  }
  return list.sort((a,b) => {
    const ap = DIAG_NAME_PREFERRED.has(a.h) ? 0:1;
    const bp = DIAG_NAME_PREFERRED.has(b.h) ? 0:1;
    return ap - bp || a.s - b.s;
  });
}

// 블로그 카드 펼침/접힘
