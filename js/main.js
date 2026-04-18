function toggleBlog(card) {
  const expand = card.querySelector('.blog-expand');
  const more   = card.querySelector('.blog-more');
  const isOpen = card.classList.contains('open');
  // 다른 카드 닫기
  document.querySelectorAll('.blog-card.open').forEach(c => {
    c.classList.remove('open');
    c.querySelector('.blog-expand').style.display = 'none';
    c.querySelector('.blog-more').textContent = '핵심 보기 ↓';
  });
  if (!isOpen) {
    card.classList.add('open');
    expand.style.display = 'block';
    more.textContent = '접기 ↑';
  }
}

// 음력/양력 토글 안내
document.addEventListener('DOMContentLoaded', function() {
  const lunarNote = document.getElementById('diag-lunar-note');
  document.querySelectorAll('input[name="diag-calendar"]').forEach(r => {
    r.addEventListener('change', function() {
      if (lunarNote) lunarNote.style.display = this.value === 'lunar' ? 'flex' : 'none';
    });
  });
});

function toggleHanjaInput() {
  const noHanja = document.getElementById('diag-no-hanja').checked;
  const area = document.getElementById('diag-hanja-area');
  area.style.display = noHanja ? 'none' : 'block';
  if (noHanja) {
    document.getElementById('diag-hanja').value = '';
    document.getElementById('diag-hanja-search').value = '';
    document.getElementById('diag-hanja-slots').style.display = 'none';
    document.getElementById('diag-hanja-slots').innerHTML = '';
    _diagHanjaState = [];
  }
}

function diagHanjaSearch() {
  const val = document.getElementById('diag-hanja-search').value.trim();
  if (!val || [...val].length < 2) { alert('한글 이름을 2글자 이상 입력해주세요.'); return; }

  _diagHanjaState = [...val].map((c, i) => {
    const isSurname = (i === 0);
    const cands = _diagGetCandidates(c, isSurname);
    const best = cands[0] || null;
    return best ? { h: best.h, s: best.s, o: best.o, reading: c, cands } : { h: null, s: null, o: null, reading: c, cands };
  });
  _diagRenderSlots();
  _diagSyncInput();
}

function diagHanjaDirect() {
  const val = document.getElementById('diag-hanja').value.trim();
  if (!val || [...val].length < 2) { alert('한자를 2글자 이상 입력해주세요.'); return; }
  if (typeof Rt === 'undefined') { alert('한자 DB가 로드되지 않았습니다. 새로고침 해주세요.'); return; }
  _diagHanjaState = [...val].map((c, i) => {
    const d = Rt[c];
    if (!d) return { h: c, s: null, o: null, reading: c, cands: [] };
    return { h: c, s: d.s, o: d.o, reading: d.e, cands: _diagGetCandidates(d.e, i===0) };
  });
  _diagRenderSlots();
}

const OCOL_D = {'木':'#2d6a4f','火':'#c0392b','土':'#8b5e0a','金':'#4a4a6a','水':'#2a7f7f'};
const OEMO_D2 = {'木':'🌿','火':'🔥','土':'⛰','金':'⚡','水':'💧'};

function _diagRenderSlots() {
  const el = document.getElementById('diag-hanja-slots');
  if (!_diagHanjaState.length) { el.style.display='none'; return; }
  el.style.display = 'flex';
  el.style.gap = '8px';
  el.style.flexWrap = 'wrap';
  el.innerHTML = _diagHanjaState.map((item, i) => {
    const label = i===0 ? '성(姓)' : '이름'+i;
    const color = item.o ? OCOL_D[item.o] : '#888';
    return `<div style="text-align:center;cursor:pointer;" onclick="diagOpenPicker(${i})">
      <div style="font-size:10px;color:var(--ink3);margin-bottom:3px;">${label}</div>
      <div style="width:52px;height:56px;border:1.5px solid ${item.h?'rgba(123,174,90,0.5)':'rgba(123,174,90,0.2)'};
           background:${item.h?'rgba(123,174,90,0.06)':'#f9f9f6'};display:flex;flex-direction:column;
           align-items:center;justify-content:center;border-radius:4px;transition:all 0.15s;">
        <span style="font-family:var(--serif);font-size:22px;font-weight:700;color:${color};">${item.h||'+'}</span>
        ${item.s ? `<span style="font-size:9px;color:var(--ink3);">${item.s}획</span>` : ''}
      </div>
    </div>`;
  }).join('');
}

function _diagSyncInput() {
  const val = _diagHanjaState.map(x => x.h || '').join('');
  document.getElementById('diag-hanja').value = val;
}

function diagOpenPicker(idx) {
  const item = _diagHanjaState[idx];
  if (!item) return;
  _diagPickerIdx = idx;
  const isSurname = (idx === 0);
  document.getElementById('diag-picker-title').textContent =
    isSurname ? `"${item.reading}" 성(姓) 한자 선택` : `"${item.reading}" 이름 한자 선택`;
  const cands = item.cands.length ? item.cands : _diagGetCandidates(item.reading, isSurname);
  const grid = document.getElementById('diag-picker-grid');
  if (!cands.length) {
    grid.innerHTML = '<div style="text-align:center;padding:30px;color:var(--ink3);font-size:13px;">해당 음의 한자를 찾을 수 없습니다</div>';
  } else {
    grid.innerHTML = cands.map(c => {
      const color = OCOL_D[c.o] || '#888';
      const sel = item.h === c.h;
      return `<div onclick="diagSelectHanja('${c.h}')" style="
          border:${sel?'2px solid var(--green)':'1.5px solid rgba(123,174,90,0.2)'};
          border-radius:6px;padding:8px 4px;text-align:center;cursor:pointer;
          background:${sel?'rgba(123,174,90,0.1)':'rgba(255,255,255,0.8)'};
          transition:all 0.15s;">
        <div style="font-family:var(--serif);font-size:22px;font-weight:700;line-height:1.2;color:${color};">${c.h}</div>
        <div style="font-size:10px;color:${color};margin-top:2px;">${OEMO_D2[c.o]||''} ${c.o||''}<br>${c.s}획</div>
      </div>`;
    }).join('');
  }
  const picker = document.getElementById('diag-hanja-picker');
  picker.style.display = 'flex';
}

function diagSelectHanja(h) {
  if (_diagPickerIdx === null || typeof Rt === 'undefined') return;
  const d = Rt[h];
  if (!d) return;
  _diagHanjaState[_diagPickerIdx] = {
    ..._diagHanjaState[_diagPickerIdx], h, s: d.s, o: d.o
  };
  document.getElementById('diag-hanja-picker').style.display = 'none';
  _diagPickerIdx = null;
  _diagRenderSlots();
  _diagSyncInput();
}

function diagClosePicker(e) {
  if (!e || e.target === document.getElementById('diag-hanja-picker')) {
    document.getElementById('diag-hanja-picker').style.display = 'none';
    _diagPickerIdx = null;
  }
}

function runSuriDiag() { runDiag(); }
function runHanjaDiag() { runDiag(); }

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-icon').textContent = '+'; });
  if (!isOpen) { item.classList.add('open'); btn.querySelector('.faq-icon').textContent = '−'; }
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const spData = [
  { name: '이*준', action: '이름풀이 상담을 신청하셨습니다', time: '방금 전' },
  { name: '김*영', action: '신생아 작명 상담 중입니다', time: '1분 전' },
  { name: '박*현', action: '개명 필요도 진단을 받으셨습니다', time: '방금 전' },
  { name: '최*진', action: '인생통찰 리포트를 확인 중입니다', time: '2분 전' },
  { name: '정*아', action: '이름 검토 상담을 신청하셨습니다', time: '방금 전' },
  { name: '윤*서', action: '상호 네이밍 상담 중입니다', time: '3분 전' },
  { name: '강*민', action: '무료 이름 진단을 완료하셨습니다', time: '방금 전' },
  { name: '오*연', action: '인생통찰 리포트를 신청하셨습니다', time: '1분 전' },
  { name: '한*석', action: '개명 상담을 예약하셨습니다', time: '방금 전' },
  { name: '신*희', action: '브랜드 네이밍 상담 중입니다', time: '4분 전' },
  { name: '임*준', action: '이름풀이 무료 진단을 시작하셨습니다', time: '방금 전' },
  { name: '류*나', action: '신생아 작명 상담을 신청하셨습니다', time: '2분 전' },
  { name: '조*현', action: '이름 검토 결과를 확인 중입니다', time: '방금 전' },
  { name: '황*지', action: '인생통찰 상담을 예약하셨습니다', time: '5분 전' },
  { name: '송*우', action: '상호 작명 상담을 신청하셨습니다', time: '방금 전' },
];
const MAX_ROWS = 5;
let spIdx = Math.floor(Math.random() * spData.length);
const spList = document.getElementById('sp-list');
function addSpRow() {
  const d = spData[spIdx % spData.length]; spIdx++;
  const row = document.createElement('div');
  row.className = 'sp-row';
  row.innerHTML = `<div class="sp-avatar">${d.name[0]}</div><div class="sp-text"><strong>${d.name}님</strong>이 ${d.action}</div><div class="sp-time">${d.time}</div><div class="sp-dot"></div>`;
  spList.appendChild(row);
  const rows = spList.querySelectorAll('.sp-row');
  if (rows.length > MAX_ROWS) {
    rows[0].style.transition = 'opacity 0.3s, transform 0.3s';
    rows[0].style.opacity = '0';
    rows[0].style.transform = 'translateY(-8px)';
    setTimeout(() => rows[0].remove(), 300);
  }
}
// 페이지 로드 시 5줄 즉시 채우기
for (let i = 0; i < 5; i++) addSpRow();
// 이후 5분 간격으로 새 항목 추가
setInterval(addSpRow, 290000 + Math.random() * 20000);
