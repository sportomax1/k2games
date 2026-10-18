(()=>{'use strict';
const $=id=>document.getElementById(id);
let startBoard=[],mode='',result=null,running=false,run=0;
const api=()=>window.ColorClusters;
const fmt=ms=>{const s=Math.floor(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function show(){const el=$('computerCompare');if(el)el.textContent=result&&result.mode===api().mode()?'Computer '+fmt(result.time)+' · '+result.moves+' swaps · Retry to compete':'Computer — · Retry uses the same layout'}
function cancel(){run++;running=false;$('computerSolve').disabled=false}
function plan(values,cols,rows,colors){
 const a=values.slice(),goal=Array.from({length:a.length},(_,i)=>Math.floor(i/cols)%colors),steps=[];
 for(let z=0;z<a.length*2;z++){
  const i=a.findIndex((v,k)=>v!==goal[k]);if(i<0)break;
  let j=-1;
  for(let k=0;k<a.length;k++)if(k!==i&&a[k]===goal[i]&&a[k]!==goal[k]){
   if(goal[k]===a[i]){j=k;break}if(j<0)j=k;
  }
  if(j<0)throw Error('No valid swap found');
  [a[i],a[j]]=[a[j],a[i]];steps.push([i,j]);
 }
 if(a.some((v,i)=>v!==goal[i]))throw Error('Unable to finish board');
 return steps;
}
function solve(){
 cancel();const g=api();if(!g)return;
 const board=g.get(),dims=g.dims(),moves=plan(board,dims.cols,dims.rows,dims.colors);
 startBoard=board.slice();mode=g.mode();g.load(board);running=true;
 $('computerSolve').disabled=true;$('computerCompare').textContent='Computer solving…';
 const id=run,begin=performance.now(),delay=Math.max(18,Math.min(100,5000/Math.max(1,moves.length)));
 let index=0;
 function frame(){
  if(id!==run)return;
  if(index===moves.length){
   running=false;$('computerSolve').disabled=false;
   result={mode,time:performance.now()-begin,moves:moves.length};
   g.computerDone(result.time,result.moves);show();return;
  }
  const [a,b]=moves[index++];g.computerSwap(a,b);
  setTimeout(frame,delay);
 }
 frame();
}
function retry(){cancel();if(!startBoard.length||mode!==api().mode()){api().fresh();startBoard=api().get();mode=api().mode()}else api().load(startBoard);show()}
function newGame(){cancel();startBoard=[];result=null;api().fresh();show()}
$('computerSolve').addEventListener('click',solve);
$('computerRetry').addEventListener('click',retry);
$('restart').addEventListener('click',()=>{startBoard=[];result=null;show()},true);
$('mode').addEventListener('change',()=>{cancel();startBoard=[];result=null;show()},true);
show();
})();