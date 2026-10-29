/* MIT. A lifecycle/accessibility wrapper around unmodified Pell 1.x. */
(function(global){
 'use strict';
 function create(options){
  const {element,onChange,sanitize,label='Rich text editor',actions}=options;
  if(!element||typeof sanitize!=='function')throw new TypeError('element and sanitize callback are required');
  if(element.childNodes.length)throw new Error('Mount Pell into an empty container');
  const abort=new AbortController(),signal=abort.signal;let range=null,destroyed=false;
  const notify=()=>{if(!destroyed&&onChange)onChange(editor.content.innerHTML);};
  const editor=global.pell.init({element,onChange:notify,defaultParagraphSeparator:'p',actions,styleWithCSS:false});
  const content=editor.content,bar=element.querySelector('.pell-actionbar');
  content.setAttribute('role','textbox');content.setAttribute('aria-multiline','true');content.setAttribute('aria-label',label);
  document.addEventListener('selectionchange',()=>{const s=getSelection();if(s?.rangeCount&&content.contains(s.anchorNode)&&content.contains(s.focusNode))range=s.getRangeAt(0).cloneRange();},{signal});
  const restore=()=>{if(range&&content.contains(range.startContainer)&&content.contains(range.endContainer)){const s=getSelection();s.removeAllRanges();s.addRange(range);}};
  bar.addEventListener('mousedown',e=>{if(e.button===0&&e.target.closest('button'))e.preventDefault();},{signal});
  bar.addEventListener('click',()=>restore(),{capture:true,signal});
  bar.addEventListener('click',notify,{signal});
  const buttons=[...bar.querySelectorAll('button')];buttons.forEach(b=>b.setAttribute('aria-label',b.title));
  const sync=()=>buttons.forEach(b=>{if(b.classList.contains('pell-button-selected'))b.setAttribute('aria-pressed','true');else b.setAttribute('aria-pressed','false');});
  const observer=new MutationObserver(sync);observer.observe(bar,{subtree:true,attributes:true,attributeFilter:['class']});sync();
  content.addEventListener('paste',event=>{event.preventDefault();global.pell.exec('insertText',event.clipboardData.getData('text/plain'));notify();},{signal});
  content.addEventListener('drop',event=>event.preventDefault(),{signal});
  return {content,getHTML:()=>sanitize(content.innerHTML),setHTML(html){if(destroyed)throw Error('Editor destroyed');content.innerHTML=sanitize(html);range=null;},focus(){content.focus();},destroy(){if(destroyed)return;destroyed=true;abort.abort();observer.disconnect();range=null;element.replaceChildren();}};
 }
 global.PellAdapter={create};
})(window);
