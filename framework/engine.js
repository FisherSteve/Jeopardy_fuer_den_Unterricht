/* Jeopardy Engine 1.0 — pure rules, shared by browser and Node tests. */
(function (root) {
  'use strict';
  const copy = x => JSON.parse(JSON.stringify(x));
  function validate(d) {
    const errors = [];
    const str = (v, path, max) => { if (typeof v !== 'string' || !v.trim() || v.length > max) errors.push(path + ': Text erforderlich (max. ' + max + ' Zeichen).'); };
    if (!d || typeof d !== 'object') throw new Error('Spieldaten fehlen.');
    if (d.schemaVersion !== 1) errors.push('schemaVersion muss 1 sein.');
    str(d.id, 'id', 80); str(d.title, 'title', 100);
    if (typeof d.id === 'string' && !/^[a-z0-9-]+$/.test(d.id)) errors.push('id: nur a–z, 0–9 und Bindestriche.');
    if (!Array.isArray(d.teams) || d.teams.length < 2 || d.teams.length > 6) errors.push('2 bis 6 Teams erforderlich.');
    else d.teams.forEach((t, i) => str(t, 'teams[' + i + ']', 40));
    if (!d.rules || d.rules.subtractOnWrong !== false || d.rules.takeover !== false) errors.push('rules.subtractOnWrong und rules.takeover müssen false sein: keine Minuspunkte, keine Übernahme.');
    if (!Array.isArray(d.categories) || d.categories.length < 1 || d.categories.length > 5) errors.push('1 bis 5 Kategorien erforderlich.');
    const ids = new Set();
    (Array.isArray(d.categories) ? d.categories : []).forEach((c, ci) => {
      if (!c || typeof c !== 'object') { errors.push('Ungültige Kategorie ' + ci); return; }
      str(c.title, 'Kategorie ' + ci, 90);
      if (!Array.isArray(c.questions) || c.questions.length !== 5) errors.push('Kategorie ' + ci + ': genau 5 Aufgaben erforderlich.');
      (Array.isArray(c.questions) ? c.questions : []).forEach((q, qi) => {
        if (!q || typeof q !== 'object') { errors.push('Ungültige Aufgabe'); return; }
        const path = ci + '/' + qi;
        str(q.id, path + '.id', 80);
        if (typeof q.id !== 'string' || !/^[a-z0-9-]+$/.test(q.id) || Object.prototype.hasOwnProperty.call(Object.prototype, q.id) || ids.has(q.id)) errors.push(path + ': ID ungültig, reserviert oder doppelt.');
        ids.add(q.id);
        if (q.points !== (qi + 1) * 100) errors.push(path + ': Punkte müssen 100, 200, 300, 400, 500 sein.');
        str(q.question, path + '.question', 1600); str(q.answer, path + '.answer', 1000);
        str(q.explanation, path + '.explanation', 2000);
        if (q.teacherNote !== undefined && (typeof q.teacherNote !== 'string' || q.teacherNote.length > 2000)) errors.push(path + ': teacherNote ungültig.');
        if (q.response !== undefined) {
          const r=q.response;
          if (!r || !['manual','number','choice'].includes(r.type)) errors.push(path + ': response.type muss manual, number oder choice sein.');
          else if (r.type==='number') {
            if (!Array.isArray(r.accepted) || !r.accepted.length || r.accepted.length>20 || !r.accepted.every(v=>canonicalNumber(v)!==null)) errors.push(path+': accepted braucht gültige Dezimalzahlen als Strings.');
            if(r.unit!==undefined && (typeof r.unit!=='string'||r.unit.length>30)) errors.push(path+': unit ungültig.');
          } else if (r.type==='choice') {
            if(!Array.isArray(r.options)||r.options.length<2||r.options.length>6||!r.options.every(v=>typeof v==='string'&&v.trim()&&v.length<=300)||new Set(r.options).size!==r.options.length) errors.push(path+': 2 bis 6 unterschiedliche Antwortoptionen erforderlich.');
            if(!Array.isArray(r.correct)||!r.correct.length||!r.correct.every(i=>Number.isInteger(i)&&i>=0&&Array.isArray(r.options)&&i<r.options.length)||new Set(r.correct).size!==r.correct.length) errors.push(path+': correct braucht eindeutige gültige Optionsindizes.');
          }
        }
        if (q.table !== undefined) {
          const t = q.table;
          if (!t || !Array.isArray(t.headers) || t.headers.length < 1 || t.headers.length > 6 || !t.headers.every(v => typeof v === 'string') || !Array.isArray(t.rows) || t.rows.length < 1 || t.rows.length > 12 || !t.rows.every(r => Array.isArray(r) && r.length === t.headers.length && r.every(v => typeof v === 'string'))) errors.push(path + ': Tabelle ungültig.');
        }
      });
    });
    if (errors.length) throw new Error(errors.join('\n'));
    return d;
  }
  function questions(d) { return d.categories.reduce((a, c) => a.concat(c.questions), []); }
  function canonicalNumber(value) {
    if(typeof value!=='string'||value.length>40) return null;
    const v=value.trim().replace(',','.');
    if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(v)) return null;
    const negative=v[0]==='-', parts=v.replace(/^[+-]/,'').split('.');
    const integer=(parts[0]||'0').replace(/^0+(?=\d)/,'');
    const fraction=(parts[1]||'').replace(/0+$/,'');
    return (negative&&(integer!=='0'||fraction)?'-':'')+integer+(fraction?'.'+fraction:'');
  }
  function evaluateAnswer(q, value) {
    const r=q.response;
    if(!r||r.type==='manual') return null;
    if(r.type==='number') { const n=canonicalNumber(value);return n===null?null:r.accepted.some(v=>canonicalNumber(v)===n); }
    if(!Array.isArray(value)||!value.length||!value.every(i=>Number.isInteger(i)&&i>=0&&i<r.options.length)||new Set(value).size!==value.length) return null;
    return value.length===r.correct.length&&r.correct.every(i=>value.includes(i));
  }
  function fresh(d, names) { return { version: 2, names: (names || d.teams).slice(), history: [] }; }
  function turn(s) { return s.history.length % s.names.length; }
  function scores(d, s) {
    const result = s.names.map(() => 0);
    s.history.forEach(e => {
      const q = questions(d).find(q => q.id === e.id);
      if (e.correct) result[e.team] += q.points;
    });
    return result;
  }
  function rate(d, s, id, team, correct) {
    if (!questions(d).some(q => q.id === id) || s.history.some(e => e.id === id) || !Number.isInteger(team) || team < 0 || team >= s.names.length || typeof correct !== 'boolean') return false;
    if (team !== turn(s)) return false;
    s.history.push({ id, team, correct });
    return true;
  }
  // Rebuild untrusted saved data through the rules; never trust saved totals.
  function restore(d, raw) {
    if (!raw || raw.version !== 2 || !Array.isArray(raw.names) || raw.names.length<2 || raw.names.length>6 || !raw.names.every(n => typeof n === 'string' && n.trim() && n.length <= 40) || !Array.isArray(raw.history) || raw.history.length > questions(d).length) throw new Error('Ungültiger Spielstand.');
    const s = fresh(d, raw.names);
    raw.history.forEach(e => {
      if (!e || !rate(d, s, e.id, e.team, e.correct)) throw new Error('Doppelte oder ungültige Bewertung.');
    });
    return copy(s);
  }
  const api = { validate, questions, canonicalNumber, evaluateAnswer, fresh, turn, scores, rate, restore };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.JeopardyEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
