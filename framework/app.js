(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const E = window.JeopardyEngine;
  let data;
  try { data = E.validate(JSON.parse($('game-data').textContent)); }
  catch (e) { $('fatal').hidden = false; $('fatal').textContent = 'Die Spieldaten sind ungültig. ' + e.message; return; }
  document.title = data.title; $('title').textContent = data.title;
  const music = $('music'), musicToggle = $('music-enabled');
  let musicAttempt = 0, musicTimer;
  function stopMusic(message) {
    musicAttempt++;
    clearTimeout(musicTimer);
    musicToggle.checked = false;
    music.pause();
    $('music-status').textContent = message || 'Musik ausgeschaltet.';
  }
  function musicUnavailable() {
    stopMusic('Musik nicht verfügbar. Das Spiel funktioniert auch ohne Musik. Optional Jeopardy-theme-song.mp3 neben die HTML-Datei legen und erneut einschalten.');
    music.removeAttribute('src');
    music.load();
  }
  music.addEventListener('error', musicUnavailable);
  musicToggle.addEventListener('change', async () => {
    if (!musicToggle.checked) { stopMusic(); return; }
    const attempt = ++musicAttempt;
    clearTimeout(musicTimer);
    musicTimer = setTimeout(() => { if (attempt === musicAttempt) musicUnavailable(); }, 12000);
    $('music-status').textContent = 'Musik wird geladen …';
    if (!music.hasAttribute('src')) {
      // Repository games share one track online; downloaded games use an optional sibling file.
      music.src = location.protocol === 'file:' ? 'Jeopardy-theme-song.mp3' : music.dataset.src;
    }
    try {
      await music.play();
      if (attempt === musicAttempt) {
        clearTimeout(musicTimer);
        $('music-status').textContent = 'Musik läuft. Hier jederzeit ausschalten.';
      }
    } catch (error) {
      if (attempt !== musicAttempt) return;
      if (error.name === 'NotAllowedError') stopMusic('Der Browser hat die Wiedergabe blockiert. Zum Starten erneut einschalten.');
      else musicUnavailable();
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMusic('Musik pausiert. Im Menü wieder einschalten.'); });
  window.addEventListener('pagehide', () => stopMusic());
  const all = E.questions(data);
  // Exact content identity prevents stale state when a question or rule changes.
  const signature = JSON.stringify(data);
  const storageKey = 'jeopardy-v2-' + data.id;
  let state = E.fresh(data), savedOK = true, notice = '', pendingFeedback = null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.signature === signature) {
        state = E.restore(data, saved.state); notice = 'Gespeicherter Spielstand geladen.';
        const last = state.history[state.history.length - 1];
        if (last && saved.feedbackId === last.id) pendingFeedback = last.id;
      }
      else notice = 'Geänderte Aufgaben: neues Spiel gestartet.';
    }
  } catch (_) { notice = 'Kein nutzbarer Spielstand verfügbar. Neues Spiel gestartet.'; }
  let view = null, current = null, revealed = false, selected = 0, returnFocus = null, lastTurn = '', inputValue='', choices=[], inputLocked=false, teacherTools=false;
  function say(text, result) { $('status').textContent = text; if(result)$('status').dataset.result=result;else delete $('status').dataset.result; }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify({ signature, state, feedbackId: pendingFeedback })); savedOK = true; }
    catch (_) { savedOK = false; say('Speichern nicht verfügbar. Dieses Spiel läuft bis zum Schließen weiter.'); }
  }
  function node(tag, text, cls) { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (cls) n.className = cls; return n; }
  function button(text, action, cls) { const b = node('button', text, cls); b.type = 'button'; b.addEventListener('click', action); return b; }
  const colors = ['#2ec4b6', '#ff9b78', '#bda0ee', '#7ae582', '#ffd166'];
  $('board').style.setProperty('--category-count', data.categories.length);
  const tiles = {};
  data.categories.forEach((c, i) => { const h = node('div', c.title, 'category'); h.style.setProperty('--category', colors[i]); $('board').appendChild(h); });
  for (let row = 0; row < 5; row++) data.categories.forEach((c, ci) => {
    const q = c.questions[row];
    const b = button(String(q.points), () => openQuestion(q), 'tile');
    b.style.setProperty('--category', colors[ci]); b.dataset.question = q.id;
    b.setAttribute('aria-label', c.title + ', ' + q.points + ' Punkte');
    $('board').appendChild(b); tiles[q.id] = b;
  });
  function render() {
    const totals = E.scores(data, state);
    $('teams').textContent = ''; $('teams').style.setProperty('--team-count', state.names.length);
    state.names.forEach((name, i) => { const t = node('div', undefined, 'team'); t.appendChild(node('span', name, 'team-name')); t.appendChild(node('span', totals[i] + ' P', 'score')); $('teams').appendChild(t); });
    all.forEach(q => {
      const used = state.history.some(e => e.id === q.id);
      const b = tiles[q.id]; b.disabled = used || inputLocked; b.classList.toggle('used', used); b.textContent = used ? '✓' : String(q.points);
      if (used) b.appendChild(node('small', 'Gespielt'));
    });
    $('progress').textContent = state.history.length + ' / ' + all.length + ' gespielt' + (state.history.length < all.length ? ' · Am Zug: ' + state.names[E.turn(state)] : '');
    $('undo').disabled = !state.history.length;
    Array.from($('teams').children).forEach((t, i) => { t.classList.toggle('active', state.history.length < all.length && i === E.turn(state)); });
    const turnText = state.history.length === all.length ? 'Alle Karten gespielt!' : state.names[E.turn(state)] + ' ist dran';
    $('turn-banner').textContent = turnText;
    if (lastTurn !== turnText) {
      $('turn-banner').classList.remove('turn-change');
      void $('turn-banner').offsetWidth;
      $('turn-banner').classList.add('turn-change'); lastTurn = turnText;
    }
    $('winner').hidden = state.history.length !== all.length;
    if (!$('winner').hidden) {
      const best = Math.max.apply(null, totals), winners = state.names.filter((_, i) => totals[i] === best);
      $('winner').textContent = (winners.length > 1 ? 'Unentschieden: ' + winners.join(' & ') : winners[0] + ' gewinnt!') + ' · ' + state.names.map((n, i) => n + ': ' + totals[i] + ' Punkte').join(' · ');
    }
  }
  function show(kind, title, focusId) {
    if (!view) returnFocus = document.activeElement;
    view = kind;
    ['question', 'menu', 'reset', 'feedback'].forEach(v => $(v + '-view').hidden = v !== kind);
    $('dialog').dataset.view = kind;
    $('close').hidden = kind === 'feedback';
    if (kind === 'feedback') $('dialog').setAttribute('aria-describedby', 'feedback-score feedback-next-team');
    else $('dialog').removeAttribute('aria-describedby');
    $('dialog-title').textContent = title;
    $('overlay').hidden = false; $('app').setAttribute('aria-hidden', 'true');
    if ('inert' in $('app')) $('app').inert = true;
    document.body.classList.add('modal-open');
    (focusId ? $(focusId) : $('dialog')).focus();
    $('dialog').scrollTop = 0;
  }
  function close() {
    const wasFeedback = view === 'feedback';
    if (wasFeedback) {
      if (inputLocked) return;
      pendingFeedback = null; save();
    }
    view = null; current = null; revealed = false;
    $('overlay').hidden = true; $('app').removeAttribute('aria-hidden');
    if ('inert' in $('app')) $('app').inert = false;
    document.body.classList.remove('modal-open');
    const focus = returnFocus && returnFocus.isConnected && !returnFocus.disabled ? returnFocus : Object.values(tiles).find(b => !b.disabled) || $('settings');
    if (wasFeedback && state.history.length === all.length) { $('winner').tabIndex=-1; $('winner').focus(); }
    else focus.focus();
  }
  function openQuestion(q) {
    if (view || inputLocked || state.history.some(e => e.id === q.id)) return;
    current = q; revealed = false; inputValue=''; choices=[];
    selected = E.turn(state);
    $('meta').textContent = state.names[selected]+' ist dran · '+data.categories.find(c => c.questions.includes(q)).title + ' · ' + q.points + ' Punkte';
    $('answer').textContent = q.answer; $('explanation').textContent = q.explanation; $('teacher-note').textContent = q.teacherNote || '';
    $('notes').hidden = true; $('notes-toggle').setAttribute('aria-expanded', 'false');
    $('question-table').textContent = '';
    if (q.table) {
      const table = node('table'), head = node('thead'), row = node('tr'), body = node('tbody');
      table.appendChild(node('caption', 'Angaben zur Aufgabe'));
      q.table.headers.forEach(h => { const th = node('th', h); th.scope = 'col'; row.appendChild(th); });
      head.appendChild(row); table.appendChild(head);
      q.table.rows.forEach(r => { const tr = node('tr'); r.forEach(v => tr.appendChild(node('td', v))); body.appendChild(tr); });
      table.appendChild(body); $('question-table').appendChild(table);
    }
    renderQuestion(); show('question', q.question, q.response&&q.response.type==='number'?'number-input':undefined);
  }
  function renderQuestion() {
    $('answer').hidden = !revealed; $('reveal').textContent = revealed ? 'Antwort ausblenden' : 'Antwort anzeigen';
    $('correct').disabled = $('wrong').disabled = !revealed;
    const type=current.response?current.response.type:'manual';
    $('notes-toggle').hidden=!teacherTools;
    $('reveal').hidden=type!=='manual'&&!teacherTools;
    $('teacher-tools').hidden=type!=='manual'&&!teacherTools;
    $('player-response').hidden=type==='manual'||revealed;
    $('number-response').hidden=type!=='number'; $('choice-response').hidden=type!=='choice';
    $('grading').hidden=type!=='manual'&&!revealed;
    if(type==='number') { $('number-input').value=inputValue; $('number-unit').textContent=current.response.unit?'('+current.response.unit+')':''; }
    if(type==='choice') {
      $('choice-help').textContent=current.response.correct.length===1?'Wählt eine Antwort.':'Wählt alle passenden Antworten.';
      $('choices').textContent='';
      current.response.options.forEach((text,i)=>{const b=button(text,()=>{choices=current.response.correct.length===1?[i]:choices.includes(i)?choices.filter(x=>x!==i):choices.concat(i);renderQuestion();$('choices').children[i].focus();});b.setAttribute('aria-pressed',String(choices.includes(i)));$('choices').appendChild(b);});
    }
    $('submit-response').disabled=type==='number'?E.canonicalNumber(inputValue)===null:!choices.length;
    $('correct').textContent = state.names[selected] + ' · Richtig';
    $('wrong').textContent = state.names[selected] + ' · Falsch';
    $('grade-label').textContent = type!=='manual'&&!revealed?state.names[selected]+' · Eure Antwort wird beim Abgeben automatisch gewertet.':'Bewertung für ' + state.names[selected] + (revealed ? '' : ' · Zuerst Antwort anzeigen');
    $('pick-team').textContent = '';
    state.names.forEach((name, i) => {
      const b = node('span', name + (i === selected ? ' · am Zug' : ''), 'team-indicator');
      b.classList.toggle('active', i === selected); $('pick-team').appendChild(b);
    });
  }
  function reveal() { if (view !== 'question'||(current.response&&current.response.type!=='manual'&&!teacherTools)) return; revealed = !revealed; renderQuestion(); }
  function notes() { if (view !== 'question'||!teacherTools) return; $('notes').hidden = !$('notes').hidden; $('notes-toggle').setAttribute('aria-expanded', String(!$('notes').hidden)); }
  function grade(correct) {
    if (view !== 'question' || !revealed || !current) return;
    finish(correct);
  }
  function finish(correct) {
    if(view!=='question'||!current) return;
    const id = current.id;
    if (!E.rate(data, state, id, selected, correct)) return;
    pendingFeedback=id; inputLocked=true; save(); render();
    showFeedback();
    if (savedOK) say(correct ? 'Richtig! Punkte gutgeschrieben.' : 'Nicht richtig.',correct?'correct':'wrong');
    // A second tap must not dismiss the new feedback or reach the board.
    setTimeout(()=>{inputLocked=false;$('feedback-continue').disabled=false;render();},450);
  }
  function showFeedback() {
    const result = state.history[state.history.length - 1];
    const q = all.find(item => item.id === result.id);
    const finished = state.history.length === all.length;
    const team = state.names[result.team];
    current = null; revealed = false;
    $('meta').textContent = 'Antwort von ' + team;
    $('dialog').dataset.outcome = result.correct ? 'correct' : 'wrong';
    $('feedback-symbol').textContent = result.correct ? '✓' : '×';
    const before = E.scores(data, Object.assign({}, state, {history:state.history.slice(0,-1)}))[result.team];
    const delta = E.scores(data,state)[result.team] - before;
    $('feedback-score').textContent = (delta > 0 ? '+' : delta < 0 ? '−' : '') + Math.abs(delta) + ' Punkte für ' + team;
    $('feedback-review').hidden = result.correct;
    $('feedback-answer').textContent = result.correct ? '' : q.answer;
    $('feedback-explanation').textContent = result.correct ? '' : q.explanation;
    $('feedback-next-label').textContent = finished ? 'Spiel abgeschlossen' : 'Teamwechsel';
    $('feedback-next-team').textContent = finished ? 'Alle Karten sind gespielt!' : state.names[E.turn(state)] + ' ist jetzt dran';
    $('feedback-continue').textContent = finished ? 'Ergebnis ansehen' : 'Weiter mit ' + state.names[E.turn(state)];
    $('feedback-continue').disabled = inputLocked;
    show('feedback', result.correct ? 'Richtig!' : 'Nicht richtig');
  }
  $('feedback-continue').addEventListener('click', () => { if (view === 'feedback') close(); });
  function numberKey(key) {
    if(view!=='question'||revealed||!current.response||current.response.type!=='number')return;
    if(key==='⌫')inputValue=inputValue.slice(0,-1);
    else if(key==='Löschen')inputValue='';
    else if(key==='±')inputValue=inputValue.startsWith('-')?inputValue.slice(1):'-'+inputValue;
    else if(inputValue.length<24 && (/^\d$/.test(key)||((key===','||key==='.')&&!/[,.]/.test(inputValue))))inputValue+=key;
    renderQuestion();
  }
  function submitResponse(){if(view!=='question'||revealed||!current)return;const result=E.evaluateAnswer(current,current.response.type==='number'?inputValue:choices);if(result!==null)finish(result);}
  ['7','8','9','4','5','6','1','2','3',',','0','⌫','±','Löschen'].forEach(k=>{const b=button(k,()=>numberKey(k));if(k==='⌫')b.setAttribute('aria-label','Letzte Ziffer löschen');if(k==='±')b.setAttribute('aria-label','Vorzeichen wechseln');$('numpad').appendChild(b);});
  $('submit-response').addEventListener('click',submitResponse);
  function menu() {
    $('meta').textContent = 'SPIELEINSTELLUNGEN'; $('names').textContent = '';
    state.names.forEach((name, i) => {
      const label = node('label', 'Team ' + (i + 1)), input = node('input'); input.value = name; input.maxLength = 40;
      input.addEventListener('change', () => { state.names[i] = input.value.trim() || data.teams[i] || 'Team '+(i+1); input.value = state.names[i]; save(); render(); });
      label.appendChild(input); $('names').appendChild(label);
    });
    $('add-team').disabled=state.history.length>0||state.names.length>=6;
    $('remove-team').disabled=state.history.length>0||state.names.length<=2;
    $('team-count-help').textContent=state.history.length?'Die Teamzahl bleibt im laufenden Spiel fest. Für eine andere Teamzahl zuerst zurücksetzen.':'2 bis 6 Teams · Teamzahl vor der ersten Bewertung frei ändern.';
    $('teacher-tools-enabled').checked=teacherTools;
    renderScoring();
    $('rules').textContent = 'Richtige Antworten geben den Kartenwert. Die gewählte Wertung gilt für alle Teams.';
    $('storage-info').textContent = savedOK ? 'Der Spielstand wird nach Möglichkeit in diesem Browser gespeichert. Auf gemeinsam genutzten Geräten vor der nächsten Klasse zurücksetzen.' : 'Dieser Browser erlaubt das Speichern nicht. Beim Schließen oder Neuladen kann der Spielstand verloren gehen.';
    show('menu', 'Menü');
  }
  function renderScoring() {
    $('subtract-on-wrong').checked=state.scoring.subtractOnWrong;
    $('allow-negative-scores').checked=state.scoring.allowNegativeScores;
    $('subtract-on-wrong').disabled=state.history.length>0;
    $('allow-negative-scores').disabled=state.history.length>0||!state.scoring.subtractOnWrong;
    $('scoring-help').textContent=state.history.length?'Die Wertung bleibt im laufenden Spiel fest. Für Änderungen zuerst zurücksetzen.':'Optional: Bei falschen Antworten den Kartenwert abziehen. Ohne Freigabe negativer Werte stoppt der Punktestand bei 0.';
  }
  ['subtract-on-wrong','allow-negative-scores'].forEach(id=>$(id).addEventListener('change',()=>{
    if(state.history.length) {renderScoring();return;}
    state.scoring.subtractOnWrong=$('subtract-on-wrong').checked;
    state.scoring.allowNegativeScores=$('allow-negative-scores').checked;
    renderScoring();save();render();
  }));
  $('close').addEventListener('click', close);
  $('settings').addEventListener('click', menu);
  $('teacher-tools-enabled').addEventListener('change',()=>{teacherTools=$('teacher-tools-enabled').checked;});
  $('add-team').addEventListener('click',()=>{if(state.history.length||state.names.length>=6)return;state.names.push('Team '+(state.names.length+1));save();render();menu();$('add-team').focus();});
  $('remove-team').addEventListener('click',()=>{if(state.history.length||state.names.length<=2)return;state.names.pop();save();render();menu();$('remove-team').focus();});
  $('reveal').addEventListener('click', reveal); $('notes-toggle').addEventListener('click', notes);
  $('correct').addEventListener('click', () => grade(true)); $('wrong').addEventListener('click', () => grade(false));
  $('undo').addEventListener('click', () => { if (view || !state.history.length) return; state.history.pop(); save(); render(); if (savedOK) say('Letzte abgeschlossene Karte zurückgenommen.'); });
  $('reset-open').addEventListener('click', () => { $('meta').textContent = 'NEUES SPIEL'; show('reset', 'Spiel zurücksetzen?', 'reset-cancel'); });
  $('reset-cancel').addEventListener('click', menu);
  $('reset-confirm').addEventListener('click', () => { state = E.fresh(data, state.names, state.scoring); selected = 0; save(); render(); close(); if (savedOK) say('Neues Spiel gestartet.'); });
  // No backdrop close: accidental touches on large classroom screens are common.
  document.addEventListener('keydown', e => {
    if (e.repeat && ['Enter', ' ', 'Escape'].includes(e.key)) { e.preventDefault(); return; }
    if (!view) return;
    if (e.key === 'Tab') {
      const list = Array.from($('dialog').querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex="0"]')).filter(el => el.getClientRects().length);
      const first = list[0], last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === $('dialog'))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || document.activeElement === $('dialog'))) { e.preventDefault(); first.focus(); }
      return;
    }
    if (view === 'feedback' && ['Enter', ' ', 'Escape'].includes(e.key)) { e.preventDefault(); close(); return; }
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if(view==='question'&&!revealed&&current.response&&current.response.type==='number'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.repeat){
      if(/^[0-9,.]$/.test(e.key)){e.preventDefault();numberKey(e.key);return;}
      if(e.key==='Backspace'||e.key==='Delete'||e.key==='-'){e.preventDefault();numberKey(e.key==='Backspace'?'⌫':e.key==='Delete'?'Löschen':'±');return;}
      if(e.key==='Enter'&&e.target===$('number-input')){e.preventDefault();submitResponse();return;}
    }
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) && e.target!==$('number-input')) || e.target.isContentEditable || view !== 'question') return;
    const key = e.key.toLowerCase();
    if (['a', 'r', 'f', 'h'].includes(key)) e.preventDefault();
    if (key === 'a') reveal(); else if (key === 'r') grade(true); else if (key === 'f') grade(false); else if (key === 'h') notes();
  });
  document.addEventListener('focusin', e => { if (view && !$('dialog').contains(e.target)) $('dialog').focus(); });
  if (document.fullscreenEnabled && document.documentElement.requestFullscreen) {
    $('fullscreen').hidden = false;
    $('fullscreen').addEventListener('click', () => {
      try { const action = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); if (action && action.catch) action.catch(() => say('Vollbild nicht verfügbar. Das Spiel bleibt im Browser bedienbar.')); }
      catch (_) { say('Vollbild nicht verfügbar.'); }
    });
    document.addEventListener('fullscreenchange', () => { $('fullscreen').textContent = document.fullscreenElement ? 'Vollbild beenden' : 'Vollbild'; });
  }
  render(); say(notice); save();
  if (pendingFeedback) showFeedback();
})();
