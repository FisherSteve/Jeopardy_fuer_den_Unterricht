/* Deliberately small, text-only mathematical data format. Never accepts HTML/TeX. */
(function(root){
  'use strict';
  const text=v=>typeof v==='string'&&v.trim().length>0&&v.length<=80;
  function validate(m){
    if(!m||typeof m!=='object'||Array.isArray(m))throw new Error('Mathefeld: Objekt erforderlich.');
    let valid=false,keys=[];
    if(m.type==='matrix'){
      keys=['type','rows'];
      valid=Array.isArray(m.rows)&&m.rows.length>=1&&m.rows.length<=4&&Array.isArray(m.rows[0])&&m.rows[0].length>=1&&m.rows[0].length<=4&&m.rows.every(r=>Array.isArray(r)&&r.length===m.rows[0].length&&r.every(text));
    }else if(m.type==='integral'){
      keys=['type','lower','upper','integrand','variable'];
      valid=text(m.integrand)&&typeof m.variable==='string'&&/^[a-zA-Z]$/.test(m.variable)&&((m.lower===undefined&&m.upper===undefined)||(text(m.lower)&&text(m.upper)));
    }
    if(!valid||Object.keys(m).some(k=>!keys.includes(k)))throw new Error('Mathefeld: matrix mit 1–4 × 1–4 Textzellen oder integral mit integrand, variable und optional lower/upper erforderlich.');
    return m;
  }
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function markup(m){
    if(!m)return '';validate(m);
    let body,label;
    if(m.type==='matrix'){
      label='Matrix, '+m.rows.length+' Zeilen und '+m.rows[0].length+' Spalten: '+m.rows.map((r,i)=>'Zeile '+(i+1)+': '+r.join(', ')).join('; ');
      body='<mrow><mo stretchy="true">(</mo><mtable>'+m.rows.map(r=>'<mtr>'+r.map(v=>'<mtd><mtext>'+esc(v)+'</mtext></mtd>').join('')+'</mtr>').join('')+'</mtable><mo stretchy="true">)</mo></mrow>';
    }else{
      label=(m.lower!==undefined?'Integral von '+m.lower+' bis '+m.upper:'Integral')+' über '+m.integrand+' bezüglich '+m.variable;
      body=(m.lower!==undefined?'<msubsup><mo>∫</mo><mtext>'+esc(m.lower)+'</mtext><mtext>'+esc(m.upper)+'</mtext></msubsup>':'<mo>∫</mo>')+'<mspace width="0.3em"/><mtext>'+esc(m.integrand)+'</mtext><mspace width="0.3em"/><mi mathvariant="normal">d</mi><mi>'+esc(m.variable)+'</mi>';
    }
    return '<div class="math-block"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="'+esc(label)+'"><mrow>'+body+'</mrow></math></div>';
  }
  const api={validate,markup};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GameMath=api;
})(typeof globalThis!=='undefined'?globalThis:window);
