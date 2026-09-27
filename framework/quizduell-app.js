(() => {
'use strict';
const $ = s => document.querySelector(s);
const screen = $('#screen');
const toastEl = $('#toast');
const letters = ['A','B','C','D'];
const E=window.QuizduellEngine;
let data;
try{data=E.validate(JSON.parse($('#game-data').textContent))}catch(e){$('#fatal').hidden=false;$('#fatal').textContent=e.message;return}
document.title=data.title;
let bank;
function randomizeBank(){const orders=window.ChoiceOrder.prepare(data.categories.flatMap(c=>c.questions));bank=data.categories.map(c=>({name:c.title,questions:c.questions.map(q=>({q:q.question,a:orders.get(q.id).map(i=>q.response.options[i]),correct:orders.get(q.id).indexOf(q.response.correct[0]),explanation:q.explanation,level:q.level,questionMath:q.questionMath,answerMath:q.answerMath}))}));
}
const FINAL_BANK=data.finalQuestions.map(q=>({q:q.question,answer:q.answer,explanation:q.explanation,level:q.level,questionMath:q.questionMath,answerMath:q.answerMath}));
let state={};
let soundOn=false;
let audioCtx=null;
let toastTimer=null;
let finalTimer=null;
let finalTickStart=0;
let finalSeconds=5;
let olympMaskTimer=null;
function stopOlympMask(){
 clearTimeout(olympMaskTimer);olympMaskTimer=null;
 $('#secretDialog').querySelectorAll('[data-secret]').forEach(b=>{b.classList.remove('conceal-glow');b.disabled=false;});
 $('#secretClose').disabled=false;$('#secretStatus').textContent='';
}
function readFinalSeconds(){const input=$('#finalSeconds');if(!input)return true;const n=Number(input.value);if(!Number.isInteger(n)||n<5||n>600){input.setCustomValidity('Bitte ganze Sekunden von 5 bis 600 eingeben.');input.reportValidity();return false;}finalSeconds=n;input.setCustomValidity('');return true;}
function wireFinalSeconds(){const input=$('#finalSeconds');if(!input)return;input.value=finalSeconds;input.onchange=readFinalSeconds;input.oninput=()=>input.setCustomValidity('');}
function timerSetting(){return '<div class="field"><label for="finalSeconds">Finale: Sekunden je Frage (5–600)</label><input id="finalSeconds" type="number" min="5" max="600" step="1" inputmode="numeric" value="'+finalSeconds+'"></div>';}

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),1900)}
function initAudio(){if(!soundOn)return;if(!audioCtx){try{audioCtx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}} if(audioCtx&&audioCtx.state==='suspended')audioCtx.resume().catch(()=>{})}
function tone(freq=520,dur=.09,type='sine',gain=.035){if(!soundOn)return;initAudio();if(!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=gain;o.connect(g);g.connect(audioCtx.destination);const t=audioCtx.currentTime;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.start(t);o.stop(t+dur)}
function chime(ok){if(ok){tone(523,.11,'sine',.045);setTimeout(()=>tone(659,.13,'sine',.04),90)}else{tone(180,.18,'sawtooth',.028)}}
function stopTimer(){if(finalTimer){clearInterval(finalTimer);finalTimer=null}}
function makeFloaters(){const f=$('#floaters');let html='';for(let i=0;i<34;i++){const w=24+Math.random()*82,h=10+Math.random()*32;const hot=i%13===0;html+=`<i class="floater ${hot?'hot':''}" style="left:${Math.random()*96}%;top:${Math.random()*96}%;width:${w}px;height:${h}px;animation-duration:${10+Math.random()*12}s;animation-delay:${-Math.random()*12}s"></i>`}f.innerHTML=html}
function resetState(){stopTimer();randomizeBank();state={view:'setup',teamName:data.teams[0],olympName:data.teams[1],round:0,teamScore:0,olympScore:0,usedCategories:[],offers:[],category:null,qIndex:0,phase:'',olympAnswer:null,teamAnswer:null,roundTeamStart:0,roundOlympStart:0,history:[],final:null}}

function render(){
 stopTimer();
 stopOlympMask();
 clearTimeout(toastTimer);toastEl.classList.remove('show');
 if(state.view==='setup') renderSetup();
 else if(state.view==='category') renderCategory();
 else if(state.view==='question') renderQuestion();
 else if(state.view==='roundEnd') renderRoundEnd();
 else if(state.view==='finalIntro') renderFinalIntro();
 else if(state.view==='finalGame') renderFinalGame();
 else if(state.view==='tiebreak') renderTiebreak();
 else if(state.view==='winner') renderWinner();
 screen.focus({preventScroll:true});
}
function scoreHeader(){return `<div class="scorebar"><div class="side"><div class="score">${state.teamScore}</div><div class="side-badge"><div class="side-name">${esc(state.teamName)}</div><div class="side-sub">Herausforderer</div></div></div><div class="roundmark"><div class="big">Runde ${Math.min(state.round+1,6)} / 6</div><div class="small">Hauptrunde · ${Math.min(state.round*3+state.qIndex+1,18)} / 18</div></div><div class="side right"><div class="side-badge"><div class="side-name">${esc(state.olympName)}</div><div class="side-sub">Olymp</div></div><div class="score">${state.olympScore}</div></div></div>`}
function renderSetup(){
 screen.innerHTML=`<section class="hero"><div><div class="eyebrow">Offline · Single HTML · 16:9</div><h1 class="hero-title">Quizduell <span>Olymp</span></h1><p class="hero-copy">${esc(data.title)}: Sechs Runden à drei Fragen. Der Olymp antwortet zuerst, danach das Team. Richtige Antworten zählen je einen Punkt, falsche null. Jeder Punkt wird zu einer Frage im Finale mit einstellbarer Zeit (Standard: fünf Sekunden).</p><div class="note" style="margin-top:18px">Neue Inhalte mit Prompt-Quizduell.md und Spiel-Erstellen.html erstellen. Diese Partie wird nicht gespeichert; Neuladen beginnt ein neues Spiel.</div></div><div class="panel"><div class="setup-grid"><div class="field"><label for="teamInput">Herausforderer</label><input id="teamInput" value="${esc(state.teamName)}" maxlength="40"></div><div class="field"><label for="olympInput">Olymp</label><input id="olympInput" value="${esc(state.olympName)}" maxlength="40"></div>${timerSetting()}<div class="btnrow"><button class="btn primary" id="startBtn">Spiel starten</button></div><div class="note">Olymp: mit <b>1–4</b> einloggen oder die Touch-Eingabe öffnen. Das Team sieht während der Eingabe weg. Eine gemeinsame Anzeige kann keine technisch geheime Eingabe garantieren.</div></div></div></section>`;
 $('#teamInput').addEventListener('input',e=>state.teamName=e.target.value||'Team');
 $('#olympInput').addEventListener('input',e=>state.olympName=e.target.value||'Olymp');
 $('#startBtn').addEventListener('click',startGame);wireFinalSeconds();

}
function startGame(){if(!readFinalSeconds())return;initAudio();state.teamName=$('#teamInput')?.value.trim()||'Klasse';state.olympName=$('#olympInput')?.value.trim()||'Olymp';state.round=0;state.teamScore=0;state.olympScore=0;state.usedCategories=[];state.history=[];offerCategories();}
function offerCategories(){state.view='category';state.qIndex=0;state.category=null;const available=bank.map((c,i)=>i).filter(i=>!state.usedCategories.includes(i));state.offers=shuffle(available).slice(0,3);render()}
function renderCategory(){const chooser=state.round%2===0?'OLYMP':'TEAM';const who=chooser==='OLYMP'?state.olympName:state.teamName;screen.innerHTML=`${scoreHeader()}<section class="category-wrap"><div class="eyebrow">Kategoriewahl · ${chooser==='OLYMP'?'Der Olymp wählt':'Die Herausforderer wählen'}</div><h2 class="screen-title">Drei Kategorien. Eine Entscheidung.</h2><p class="screen-sub">${esc(who)} bestimmt die Kategorie für die nächsten drei Fragen.</p><div class="category-grid">${state.offers.map((idx,n)=>{const c=bank[idx];return `<button class="cat" data-cat="${idx}"><div class="cat-index">Kategorie ${n+1}</div><div class="cat-name">${esc(c.name)}</div></button>`}).join('')}</div><div class="progress">${[0,1,2,3,4,5].map(i=>`<i class="prog-dot ${i<state.round?'done':i===state.round?'current':''}"></i>`).join('')}</div></section>`;
 document.querySelectorAll('.cat').forEach(b=>b.addEventListener('click',()=>chooseCategory(+b.dataset.cat)));
}
function chooseCategory(idx){if(state.view!=='category'||!state.offers.includes(idx))return;tone(440,.07);state.category=idx;state.usedCategories.push(idx);state.qIndex=0;state.phase='olymp';state.olympAnswer=null;state.teamAnswer=null;state.roundTeamStart=state.teamScore;state.roundOlympStart=state.olympScore;state.view='question';render()}
function currentQ(){return bank[state.category].questions[state.qIndex]}
function renderQuestion(){const q=currentQ();const reveal=state.phase==='reveal';const phaseText=state.phase==='olymp'?'Olymp antwortet verdeckt':state.phase==='team'?'Team berät und antwortet':'Auflösung';
 if(reveal){screen.innerHTML=`${scoreHeader()}<section class="question-stage"><div class="category-pill">${esc(bank[state.category].name)} · Frage ${state.qIndex+1}/3</div>${revealMarkup(q)}${statusMarkup()}</section>`;wireQuestion();return;}
 screen.innerHTML=`${scoreHeader()}<section class="question-stage"><div class="qhead"><div class="category-pill"><i class="dot"></i>${esc(bank[state.category].name)}${q.level?' · '+esc(q.level):''} · Frage ${state.qIndex+1}/3</div><div class="phase-pill">${phaseText}</div></div><div class="question-card"><div><div class="question-text">${esc(q.q)}</div>${window.GameMath.markup(q.questionMath)}</div></div><div class="answers">${q.a.map((a,i)=>answerMarkup(a,i,q.correct,reveal)).join('')}</div>${statusMarkup(q)}${reveal?revealMarkup(q):''}</section>`;
 wireQuestion();
}
function answerMarkup(a,i,correct,reveal){let cls='answer';if(state.phase==='team'&&state.teamAnswer===i)cls+=' selected';if(reveal){if(i===correct)cls+=' correct';else if(i===state.olympAnswer||i===state.teamAnswer)cls+=' wrong';else cls+=' dim'}const disabled=state.phase!=='team'?'disabled':'';return `<button class="${cls}" data-answer="${i}" aria-pressed="${state.phase==='team'&&state.teamAnswer===i}" ${disabled}><span class="letter">${letters[i]}</span><span class="txt">${esc(a)}</span></button>`}
function statusMarkup(){
 if(state.phase==='olymp')return `<div class="status-card"><div><div class="status-main">${esc(state.olympName)}: Antwort verdeckt einloggen</div><div class="status-sub">Team bitte wegsehen. Taste 1–4 drücken oder Touch-Eingabe öffnen.</div></div><button class="btn primary" id="touchOlymp">Olymp: Touch-Eingabe</button></div>`;
 if(state.phase==='team')return `<div class="status-card"><div><div class="status-main">${esc(state.teamName)} ist dran</div><div class="status-sub">Antwort anklicken oder 1–4 wählen und mit Enter einloggen.</div></div><button class="btn primary" id="lockTeam" ${state.teamAnswer===null?'disabled':''}>Antwort einloggen</button></div>`;
 return `<div class="status-card"><div><div class="status-main">Antwort aufgelöst</div><div class="status-sub">Punkte wurden automatisch addiert.</div></div><button class="btn primary" id="nextQ">${state.qIndex<2?'Nächste Frage':'Runde auswerten'}</button></div>`
}
function revealMarkup(q){const oa=state.olympAnswer,ta=state.teamAnswer;const oOk=oa===q.correct,tOk=ta===q.correct;return `<div class="learning-feedback ${tOk ? 'is-correct' : ''}" role="status"><h2>${state.teamAnswer===q.correct?'Richtig!':'Nicht richtig'} · ${esc(state.teamName)} +${E.score(q.correct,state.teamAnswer)} · ${esc(state.olympName)} +${E.score(q.correct,state.olympAnswer)}</h2><p><strong>Richtige Antwort: ${esc(q.a[q.correct])}</strong></p>${window.GameMath.markup(q.answerMath)}<p>${esc(q.explanation)}</p><p>${state.qIndex<2?esc(state.olympName)+' antwortet als Nächstes.':'Weiter zur Rundenwertung.'}</p></div><div class="reveal-grid"><div class="reveal-card"><div class="reveal-label">${esc(state.teamName)}</div><div class="reveal-answer">${letters[ta]} · ${esc(q.a[ta])} ${tOk?'✓':'✕'}</div></div><div class="reveal-card righty"><div class="reveal-label">${esc(state.olympName)}</div><div class="reveal-answer">${letters[oa]} · ${esc(q.a[oa])} ${oOk?'✓':'✕'}</div></div></div>`}
function wireQuestion(){
 if(state.phase==='olymp')$('#touchOlymp').addEventListener('click',()=>{const d=$('#secretDialog');d.classList.remove('pointer-input');d.showModal();$('#secretTitle').focus();});
 if(state.phase==='team'){document.querySelectorAll('.answer').forEach(b=>b.addEventListener('click',()=>selectTeam(+b.dataset.answer)));$('#lockTeam').addEventListener('click',lockTeam)}
 if(state.phase==='reveal')$('#nextQ').addEventListener('click',nextQuestion);
}
function olympSecret(i){
 if(state.view!=='question'||state.phase!=='olymp'||!Number.isInteger(i)||i<0||i>3)return;
 const dialog=$('#secretDialog');
 state.olympAnswer=i;tone(330,.07);
 function finish(){stopOlympMask();if(dialog.open)dialog.close();state.phase='team';render();toast('Olymp-Antwort ist eingeloggt.');}
 // The distraction belongs only to the open Olymp input, never to the team buttons.
 if(!dialog.open||window.matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
 // This permutation must never depend on the chosen or correct answer.
 const order=shuffle([0,1,2,3]),buttons=dialog.querySelectorAll('[data-secret]');
 state.phase='mask';
 $('#secretTitle').focus();
 buttons.forEach(b=>b.disabled=true);$('#secretClose').disabled=true;
 $('#secretStatus').textContent='Antwort eingeloggt.';
 let step=0;
 function advance(){
  if(state.view!=='question'||state.phase!=='mask')return;
  buttons.forEach(b=>b.classList.remove('conceal-glow'));
  if(step===order.length){finish();return;}
  buttons[order[step++]].classList.add('conceal-glow');
  olympMaskTimer=setTimeout(advance,400);
 }
 advance();
}
function selectTeam(i){if(state.view!=='question'||state.phase!=='team'||!Number.isInteger(i)||i<0||i>3)return;state.teamAnswer=i;tone(430,.05);document.querySelectorAll('.answer').forEach((b,j)=>{b.classList.toggle('selected',j===i);b.setAttribute('aria-pressed',String(j===i));});$('#lockTeam').disabled=false;}
function lockTeam(){if(state.phase!=='team'||state.teamAnswer===null)return;const q=currentQ();state.phase='reveal';state.teamScore+=E.score(q.correct,state.teamAnswer);state.olympScore+=E.score(q.correct,state.olympAnswer);state.history.push({round:state.round,category:bank[state.category].name,q:state.qIndex,team:state.teamAnswer,olymp:state.olympAnswer,correct:q.correct});chime(state.teamAnswer===q.correct);state.continueAfter=performance.now()+450;render()}
function nextQuestion(){if(state.view!=='question'||state.phase!=='reveal'||performance.now()<state.continueAfter)return;if(state.qIndex<2){state.qIndex++;state.phase='olymp';state.olympAnswer=null;state.teamAnswer=null;render()}else{state.view='roundEnd';render()}}
function renderRoundEnd(){const rt=state.teamScore-state.roundTeamStart,ro=state.olympScore-state.roundOlympStart;let line=rt>ro?`${state.teamName} gewinnt diese Runde.`:ro>rt?`${state.olympName} gewinnt diese Runde.`:'Diese Runde endet unentschieden.';screen.innerHTML=`${scoreHeader()}<section class="round-summary"><div class="eyebrow">${esc(bank[state.category].name)} · drei Fragen gespielt</div><h2 class="screen-title">${esc(line)}</h2><div class="duel-score"><div><div class="duel-num">${rt}</div><div class="mini-label">${esc(state.teamName)}</div></div><div class="duel-vs">:</div><div><div class="duel-num olymp">${ro}</div><div class="mini-label">${esc(state.olympName)}</div></div></div><p class="screen-sub">Gesamtstand: ${state.teamScore} : ${state.olympScore}</p><button class="btn orange" id="continueRound">${state.round<5?'Nächste Runde':'Zum Finale'}</button><div class="progress">${[0,1,2,3,4,5].map(i=>`<i class="prog-dot ${i<=state.round?'done':''}"></i>`).join('')}</div></section>`;$('#continueRound').addEventListener('click',()=>{tone(510,.07);if(state.round<5){state.round++;offerCategories()}else{prepareFinal()}})}
function prepareFinal(){const first=state.teamScore<=state.olympScore?'team':'olymp';state.final={first,order:first==='team'?['team','olymp']:['olymp','team'],turnIndex:0,qIndex:0,correct:{team:0,olymp:0},questions:{team:state.teamScore,olymp:state.olympScore},bank:shuffle(FINAL_BANK),bankPos:0,question:null,stage:'intro',time:5,timedOut:false};state.view='finalIntro';render()}
function renderFinalIntro(){const f=state.final;screen.innerHTML=`<section class="final-intro"><div class="eyebrow">Das Finale</div><h2 class="screen-title">Jeder Punkt wird zur Finalfrage.</h2><p class="screen-sub">${f.first==='team'?esc(state.teamName):esc(state.olympName)} beginnt mit der niedrigeren bzw. gleichen Anzahl an Fragen. Die Zeit gilt für beide Seiten und lässt sich hier vor dem Start einstellen.</p><div class="final-pairs"><div class="final-side"><div class="mini-label">${esc(state.teamName)}</div><div class="final-qcount">${f.questions.team}<span>Fragen</span></div></div><div class="final-side ol"><div class="mini-label">${esc(state.olympName)}</div><div class="final-qcount">${f.questions.olymp}<span>Fragen</span></div></div></div>${timerSetting()}<button class="btn orange" id="startFinal">Finale starten</button></section>`;wireFinalSeconds();$('#startFinal').addEventListener('click',()=>{if(!readFinalSeconds())return;f.stage='ready';state.view='finalGame';render()})}
function activeSide(){return state.final.order[state.final.turnIndex]}
function sideName(side){return side==='team'?state.teamName:state.olympName}
function finalQuestionText(item){return item&&typeof item==='object'?item.q:String(item||'')}
function finalAnswerText(item){return item&&typeof item==='object'&&item.answer?item.answer:''}
function finalLevelText(item){return item&&typeof item==='object'&&item.level?item.level:''}
function renderFinalGame(){const f=state.final,side=activeSide(),max=f.questions[side];if(max===0){finishSide();return}const used=f.qIndex;const ready=f.stage==='ready',asking=f.stage==='asking',judging=f.stage==='judging';const fq=finalQuestionText(f.question),fa=finalAnswerText(f.question),fl=finalLevelText(f.question);screen.innerHTML=`<section class="final-game"><div class="eyebrow" style="text-align:center">Finale · ${esc(sideName(side))} · Frage ${Math.min(used+1,max)} von ${max}${fl?' · '+esc(fl):''}</div><div class="final-stats"><div class="stat"><b>${f.correct.team}</b><span>${esc(state.teamName)} richtig</span></div><div class="stat"><b>${f.correct.olymp}</b><span>${esc(state.olympName)} richtig</span></div></div>${asking||judging?`<div class="timer-ring" id="timerRing" style="--t:${Math.max(0,f.time)/finalSeconds}"><div class="timer-num" id="timerNum">${Math.ceil(Math.max(0,f.time))}</div></div>`:''}<div class="final-question">${ready?'Bereit für die nächste Finalfrage?':esc(fq)}</div>${!ready?window.GameMath.markup(f.question.questionMath):''}${judging&&fa?`<div class="status-card" style="margin-top:18px"><div><div class="status-main">Lösung: ${esc(fa)}</div><div class="status-sub">${esc(f.question.explanation)}</div>${window.GameMath.markup(f.question.answerMath)}</div></div>`:''}${ready?`<div class="judge"><button class="btn orange" id="goFinal">Frage starten</button></div>`:''}${asking?`<div class="status-card" style="margin-top:18px"><div><div class="status-main" id="timerStatus">${finalSeconds} Sekunden laufen …</div><div class="status-sub">Antwort laut geben. Danach bewertet die Spielleitung.</div></div><button class="btn primary" id="stopFinal">Antwort gegeben · aufdecken</button></div>`:''}${judging?`<div class="judge"><button class="btn good" id="judgeRight">Richtig</button><button class="btn bad" id="judgeWrong">Falsch</button></div>`:''}</section>`;
 if(asking)$('#stopFinal').addEventListener('click',revealFinal);if(ready)$('#goFinal').addEventListener('click',startFinalQuestion);if(judging){$('#judgeRight').addEventListener('click',()=>judgeFinal(true));$('#judgeWrong').addEventListener('click',()=>judgeFinal(false))}}
function revealFinal(){if(state.view!=='finalGame'||state.final.stage!=='asking')return;stopTimer();state.final.stage='judging';state.continueAfter=performance.now()+450;render()}
function tickFinal(){const f=state.final;if(!f||f.stage!=='asking'||document.hidden)return;
 f.time=Math.max(0,(finalTickStart-performance.now())/1000);
 const n=$('#timerNum'),r=$('#timerRing');if(n)n.textContent=Math.ceil(f.time);if(r)r.style.setProperty('--t',f.time/finalSeconds);
 if(f.time<=0){f.timedOut=true;revealFinal();tone(145,.22,'square',.03);}
}
function startFinalQuestion(){const f=state.final;if(state.view!=='finalGame'||f.stage!=='ready')return;
 f.question=f.bank[f.bankPos++];f.stage='asking';f.time=finalSeconds;f.timedOut=false;render();finalTickStart=performance.now()+finalSeconds*1000;finalTimer=setInterval(tickFinal,70);
}
document.addEventListener('visibilitychange',()=>{if(state.view!=='finalGame'||state.final.stage!=='asking')return;
 if(document.hidden){state.final.time=Math.max(0,(finalTickStart-performance.now())/1000);stopTimer();}
 else{finalTickStart=performance.now()+state.final.time*1000;tickFinal();if(state.final.stage==='asking')finalTimer=setInterval(tickFinal,70);}
});
function judgeFinal(ok){if(state.view!=='finalGame'||state.final.stage!=='judging'||performance.now()<state.continueAfter)return;stopTimer();const f=state.final,side=activeSide();if(ok){f.correct[side]++;chime(true)}else chime(false);f.qIndex++;
 if(f.turnIndex===1){const first=f.order[0],second=f.order[1],firstScore=f.correct[first],secondScore=f.correct[second],remaining=f.questions[second]-f.qIndex;const outcome=E.finalOutcome(firstScore,secondScore,remaining);if(outcome==='second'){finishGame(second);return}if(outcome==='first'){finishGame(first);return}}
 if(f.qIndex>=f.questions[side]){finishSide();return}f.stage='ready';f.question=null;render()}
function finishSide(){const f=state.final;if(f.turnIndex===0){f.turnIndex=1;f.qIndex=0;f.stage='ready';f.question=null;render();toast(`${sideName(activeSide())} ist jetzt dran.`);return}const a=f.correct.team,b=f.correct.olymp;if(a===b){state.view='tiebreak';state.tieQuestion=f.bank[f.bankPos++];state.tieRevealed=false;render()}else finishGame(a>b?'team':'olymp')}
function renderTiebreak(){const q=state.tieQuestion;screen.innerHTML=`<section class="final-game"><div class="eyebrow">Gleichstand · Stichfrage</div><h2 class="screen-title">Eine Frage entscheidet.</h2><div class="final-question">${esc(q.q)}</div>${window.GameMath.markup(q.questionMath)}
 ${state.tieRevealed?`<div class="learning-feedback"><strong>Lösung: ${esc(q.answer)}</strong>${window.GameMath.markup(q.answerMath)}<p>${esc(q.explanation)}</p></div><p>Die Spielleitung entscheidet, wer zuerst korrekt geantwortet hat.</p><div class="judge"><button class="btn primary" id="teamTie">${esc(state.teamName)} gewinnt</button><button class="btn orange" id="olympTie">${esc(state.olympName)} gewinnt</button><button class="btn ghost" id="drawTie">Niemand richtig · Unentschieden</button></div>`:`<p>Antwort zuerst mündlich geben. Danach gemeinsam aufdecken.</p><button class="btn primary" id="revealTie">Antwort anzeigen</button>`}</section>`;
 if(state.tieRevealed){$('#teamTie').onclick=()=>finishGame('team');$('#olympTie').onclick=()=>finishGame('olymp');$('#drawTie').onclick=()=>finishGame('draw');}
 else $('#revealTie').onclick=()=>{state.tieRevealed=true;render();};
}
function finishGame(side){stopTimer();state.winner=side;state.view='winner';render()}
function confetti(){const cols=['#5aa2ff','#8e6cff','#ffc35a','#fff','#47df9a'];let h='<div class="confetti">';for(let i=0;i<55;i++)h+=`<i style="left:${Math.random()*100}%;--d:${3.5+Math.random()*4}s;--delay:${-Math.random()*6}s;--x:${-100+Math.random()*200}px;--c:${cols[i%cols.length]}"></i>`;return h+'</div>'}
function renderWinner(){const win=state.winner==='team'?state.teamName:state.olympName;screen.innerHTML=`${confetti()}<section class="winner"><div class="eyebrow">Quizduell Olymp · Schulmodus</div><div class="winner-big">${state.winner==='draw'?'Unentschieden':'Sieg für<br><em>'+esc(win)+'</em>'}</div><p class="screen-sub">Hauptrunde ${state.teamScore} : ${state.olympScore} · Finale ${state.final.correct.team} : ${state.final.correct.olymp}</p><div class="btnrow" style="justify-content:center"><button class="btn orange" id="againBtn">Neue Partie</button><button class="btn ghost" id="setupBtn">Zurück zum Start</button></div></section>`;chime(true);$('#againBtn').addEventListener('click',()=>{const t=state.teamName,o=state.olympName;resetState();state.teamName=t;state.olympName=o;state.round=0;state.teamScore=0;state.olympScore=0;state.usedCategories=[];state.history=[];offerCategories()});$('#setupBtn').addEventListener('click',()=>{resetState();render()})}

function globalKey(e){if(e.repeat)return;if(e.target.matches('input,textarea,select')||e.target.isContentEditable)return;if($('#secretDialog').open){if(/^[1-4]$/.test(e.key)){e.preventDefault();olympSecret(+e.key-1);}return;}const k=e.key.toLowerCase();if(k==='h'){e.preventDefault();$('#shortcuts').classList.toggle('hidden');return}if(k==='v'){e.preventDefault();toggleFull();return}if(['1','2','3','4'].includes(k)){const i=+k-1;if(state.view==='question'&&state.phase==='olymp'){olympSecret(i)}else if(state.view==='question'&&state.phase==='team'){selectTeam(i)}return}if(e.key==='Enter'&&!e.target.closest('button')){e.preventDefault();if(state.view==='question'&&state.phase==='team'&&state.teamAnswer!==null)lockTeam();else if(state.view==='question'&&state.phase==='reveal')nextQuestion();else if(state.view==='finalGame'&&state.final.stage==='ready')startFinalQuestion();return}if(state.view==='finalGame'&&state.final.stage==='judging'&&k==='r')judgeFinal(true);if(state.view==='finalGame'&&state.final.stage==='judging'&&k==='f')judgeFinal(false)}
document.addEventListener('keydown',globalKey);
function toggleFull(){const el=document.documentElement;if(!document.fullscreenElement){el.requestFullscreen?.().catch(()=>{})}else document.exitFullscreen?.().catch(()=>{})}
$('#fullBtn').addEventListener('click',toggleFull);$('#hintBtn').addEventListener('click',()=>$('#shortcuts').classList.toggle('hidden'));$('#soundBtn').addEventListener('click',()=>{soundOn=!soundOn;$('#soundBtn').textContent=soundOn?'♪':'×';toast(soundOn?'Ton an':'Ton aus')});

$('#secretClose').onclick=()=>{if(state.phase!=='mask')$('#secretDialog').close();};
$('#secretDialog').addEventListener('cancel',e=>{if(state.phase==='mask')e.preventDefault();});
$('#secretDialog').addEventListener('pointerdown',()=>$('#secretDialog').classList.add('pointer-input'));
$('#secretDialog').addEventListener('keydown',()=>$('#secretDialog').classList.remove('pointer-input'));
$('#secretDialog').querySelectorAll('[data-secret]').forEach(b=>b.onclick=()=>olympSecret(+b.dataset.secret));
if(!document.documentElement.requestFullscreen)$('#fullBtn').hidden=true;
makeFloaters();resetState();render();
})();
