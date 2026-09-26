/* Quizduell: shared data contract and scoring for Node and the offline creator. */
(function(root){
  'use strict';
  const math=typeof module!=='undefined'&&module.exports?require('./math'):root.GameMath;
  function validate(d){
    const errors=[];
    const str=(v,p,max)=>{if(typeof v!=='string'||!v.trim()||v.length>max)errors.push(p+': Text erforderlich (max. '+max+' Zeichen).');};
    if(!d||typeof d!=='object')throw new Error('Spieldaten fehlen.');
    if(d.schemaVersion!==1||d.gameType!=='quizduell')errors.push('schemaVersion: 1 und gameType: "quizduell" erforderlich.');
    str(d.id,'id',80);str(d.title,'title',100);
    if(typeof d.id!=='string'||!/^[a-z0-9-]+$/.test(d.id))errors.push('id: nur a–z, 0–9 und Bindestriche.');
    if(!Array.isArray(d.teams)||d.teams.length!==2)errors.push('Genau zwei Namen: Herausforderer und Olymp.');
    else d.teams.forEach((t,i)=>str(t,'teams['+i+']',40));
    const ids=new Set();
    function question(q,p,choice){
      if(!q||typeof q!=='object'){errors.push(p+': Aufgabe fehlt.');return;}
      str(q.id,p+'.id',80);
      if(typeof q.id!=='string'||!/^[a-z0-9-]+$/.test(q.id)||Object.prototype.hasOwnProperty.call(Object.prototype,q.id)||ids.has(q.id))errors.push(p+': ID ungültig oder doppelt.');
      ids.add(q.id);str(q.question,p+'.question',1600);str(q.answer,p+'.answer',1000);str(q.explanation,p+'.explanation',2000);
      if(q.level!==undefined)str(q.level,p+'.level',80);
      if(choice){
        const r=q.response;
        if(!r||r.type!=='choice'||!Array.isArray(r.options)||r.options.length!==4||!r.options.every(v=>typeof v==='string'&&v.trim()&&v.length<=300)||new Set(r.options.map(v=>typeof v==='string'?v.trim():v)).size!==4)errors.push(p+': Vier unterschiedliche Textoptionen erforderlich.');
        if(!r||!Array.isArray(r.correct)||r.correct.length!==1||!Number.isInteger(r.correct[0])||r.correct[0]<0||r.correct[0]>3)errors.push(p+': correct enthält genau einen Index von 0 bis 3.');
        if(r&&Array.isArray(r.options)&&Array.isArray(r.correct)&&q.answer!==r.options[r.correct[0]])errors.push(p+': answer muss exakt der richtigen Option entsprechen.');
      }
      for(const key of ['questionMath','answerMath'])if(q[key]!==undefined){try{math.validate(q[key]);}catch(e){errors.push(p+'.'+key+': '+e.message);}}
      const allowed=['id','question','answer','explanation','level','questionMath','answerMath',...(choice?['response']:[])];
      if(Object.keys(q).some(k=>!allowed.includes(k)))errors.push(p+': Nicht unterstütztes Aufgabenfeld. Erlaubt: '+allowed.join(', '));
    }
    // Eight categories preserve three choices even in round six.
    if(!Array.isArray(d.categories)||d.categories.length<8||d.categories.length>20)errors.push('Quizduell braucht 8 bis 20 Kategorien mit je 3 Fragen.');
    (Array.isArray(d.categories)?d.categories:[]).forEach((c,i)=>{
      if(!c||typeof c!=='object'){errors.push('Kategorie fehlt.');return;}
      str(c.title,'Kategorie '+i,90);
      if(Object.keys(c).some(k=>!['title','questions'].includes(k)))errors.push('Kategorie '+i+': Nur title und questions unterstützt.');
      if(!Array.isArray(c.questions)||c.questions.length!==3)errors.push('Kategorie '+i+': genau 3 Fragen erforderlich.');
      (Array.isArray(c.questions)?c.questions:[]).forEach((q,j)=>question(q,i+'/'+j,true));
    });
    if(!Array.isArray(d.finalQuestions)||d.finalQuestions.length<37||d.finalQuestions.length>200)errors.push('37 bis 200 Finalfragen erforderlich (bis zu 36 gespielte Fragen plus Stichfrage).');
    (Array.isArray(d.finalQuestions)?d.finalQuestions:[]).forEach((q,i)=>question(q,'Finale '+i,false));
    if(Object.keys(d).some(k=>!['schemaVersion','gameType','id','title','teams','categories','finalQuestions'].includes(k)))errors.push('Nicht unterstütztes Quizduell-Feld. Keine Jeopardy-Punkte-/Timerregeln verwenden.');
    if(errors.length)throw new Error(errors.join('\n'));
    return d;
  }
  function score(correct,answer){return Number(Number.isInteger(answer)&&answer===correct);}
  function finalOutcome(firstScore,secondScore,remaining){
    if(secondScore>firstScore)return 'second';
    if(secondScore+remaining<firstScore)return 'first';
    if(remaining===0)return firstScore===secondScore?'tie':'first';
    return null;
  }
  const api={validate,score,finalOutcome};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.QuizduellEngine=api;
})(typeof globalThis!=='undefined'?globalThis:window);
