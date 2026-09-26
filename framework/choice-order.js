/* Random display order; original indices remain the scoring contract. */
(function(root){
  'use strict';
  function shuffle(items,random=Math.random){
    const out=items.slice();
    for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
    return out;
  }
  function prepare(questions,random=Math.random){
    const orders=new Map(),groups=new Map();
    for(const q of questions){
      const r=q.response;if(!r||r.type!=='choice')continue;
      if(r.correct.length!==1){orders.set(q.id,shuffle(r.options.map((_,i)=>i),random));continue;}
      const n=r.options.length;if(!groups.has(n))groups.set(n,[]);groups.get(n).push(q);
    }
    for(const [n,group] of groups){
      // Randomized balanced positions: no fixed ABCD cycle or dominant letter.
      const offset=shuffle(Array.from({length:n},(_,i)=>i),random);
      const targets=shuffle(group.map((_,i)=>offset[i%n]),random);
      group.forEach((q,i)=>{
        const correct=q.response.correct[0];
        const order=shuffle(q.response.options.map((_,j)=>j).filter(j=>j!==correct),random);
        order.splice(targets[i],0,correct);orders.set(q.id,order);
      });
    }
    return orders;
  }
  const api={shuffle,prepare};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChoiceOrder=api;
})(typeof globalThis!=='undefined'?globalThis:window);
