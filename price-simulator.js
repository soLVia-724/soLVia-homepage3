document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('simModal');
  if (!modal) return; // このスクリプトは price.html でのみ使用

  var openBtn = document.getElementById('simOpenBtn');
  var closeBtn = document.getElementById('simClose');
  var backdrop = document.getElementById('simBackdrop');
  var backBtn = document.getElementById('simBack');
  var restartBtn = document.getElementById('simRestart');
  var panel = modal.querySelector('.sim-modal-panel');
  var screens = modal.querySelectorAll('.sim-screen');

  var GRADE_PRICES = { elementary: 2300, junior: 2500, high: 3000 };
  var GRADE_LABELS = { elementary: '小学生', junior: '中学生', high: '高校生' };
  var SERVICE_LABELS = {
    lesson: 'オンライン授業のみ',
    video: '個別動画解説サービスのみ',
    both: 'オンライン授業＋個別動画解説サービス'
  };
  var SERVER_FEE = 1000;
  var VIDEO_WITH_LESSON = 4980;
  var VIDEO_STANDALONE = 5980;

  var state = {};
  var history = [];

  function resetState() {
    state = { grade: null, service: null, frequency: null, videoOption: null };
    history = ['grade'];
  }

  function clearSelectedIn(screenEl) {
    screenEl.querySelectorAll('.sim-option').forEach(function (b) {
      b.classList.remove('selected');
    });
  }

  function showScreen(name) {
    screens.forEach(function (s) {
      s.hidden = s.dataset.screen !== name;
    });
    backBtn.hidden = history.length <= 1;
    panel.scrollTop = 0;
  }

  function goTo(name) {
    history.push(name);
    showScreen(name);
  }

  function goBack() {
    if (history.length <= 1) return;
    history.pop();
    showScreen(history[history.length - 1]);
  }

  function fmt(n) {
    return '¥' + n.toLocaleString('ja-JP');
  }

  function renderResult() {
    var gradePrice = GRADE_PRICES[state.grade];
    var lessonsIncluded = state.service === 'lesson' || state.service === 'both';
    var videoIncluded =
      state.service === 'video' ||
      state.service === 'both' ||
      (state.service === 'lesson' && state.videoOption === 'yes');

    var weekly = lessonsIncluded ? parseInt(state.frequency, 10) : 0;
    var monthlyLessons = weekly * 4;
    var lessonCost = lessonsIncluded ? gradePrice * monthlyLessons : 0;
    var videoCost = videoIncluded ? (lessonsIncluded ? VIDEO_WITH_LESSON : VIDEO_STANDALONE) : 0;
    var total = lessonCost + videoCost + SERVER_FEE;

    var summaryEl = document.getElementById('simSummary');
    var summaryParts = [GRADE_LABELS[state.grade], SERVICE_LABELS[state.service]];
    if (lessonsIncluded) summaryParts.push('週' + weekly + 'コマ');
    summaryEl.textContent = summaryParts.join('・');

    document.getElementById('simTotal').innerHTML = fmt(total) + '<span> / 月</span>';

    var items = [];
    if (lessonsIncluded) {
      items.push(
        '<li><span>オンライン授業（月' +
          monthlyLessons +
          '回：' +
          fmt(gradePrice) +
          ' × ' +
          monthlyLessons +
          'コマ）</span><span>' +
          fmt(lessonCost) +
          '</span></li>'
      );
    }
    if (videoIncluded) {
      items.push(
        '<li><span>個別解説動画サービス（月10問まで・' +
          (lessonsIncluded ? '授業とセット' : '単体') +
          '）</span><span>' +
          fmt(videoCost) +
          '</span></li>'
      );
    }
    items.push('<li><span>サーバー利用費</span><span>' + fmt(SERVER_FEE) + '</span></li>');

    document.getElementById('simBreakdown').innerHTML = items.join('');
  }

  function openModal() {
    resetState();
    screens.forEach(clearSelectedIn);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sim-open');
    showScreen('grade');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sim-open');
  }

  modal.addEventListener('click', function (e) {
    var btn = e.target.closest('.sim-option');
    if (!btn) return;

    var screenEl = btn.closest('.sim-screen');
    var screenName = screenEl.dataset.screen;
    var value = btn.dataset.value;

    clearSelectedIn(screenEl);
    btn.classList.add('selected');

    if (screenName === 'grade') {
      state.grade = value;
      goTo('service');
    } else if (screenName === 'service') {
      state.service = value;
      if (value === 'video') {
        // 動画のみ：授業を取らないのでコマ数はスキップ。動画は確定で「はい」扱い。
        state.frequency = null;
        state.videoOption = 'yes';
        goTo('result');
        renderResult();
      } else {
        goTo('frequency');
      }
    } else if (screenName === 'frequency') {
      state.frequency = value;
      if (state.service === 'both') {
        // 両方選択済みなので動画オプション確認はスキップし、自動的に「はい」扱い。
        state.videoOption = 'yes';
        goTo('result');
        renderResult();
      } else {
        goTo('videoOption');
      }
    } else if (screenName === 'videoOption') {
      state.videoOption = value;
      goTo('result');
      renderResult();
    }
  });

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  backBtn.addEventListener('click', goBack);
  restartBtn.addEventListener('click', function () {
    resetState();
    screens.forEach(clearSelectedIn);
    showScreen('grade');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
});