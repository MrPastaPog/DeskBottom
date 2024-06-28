import React, {useState, useEffect} from 'react';
import ContextMenuComponent from './ContextMenuComponent';

function ContextMenu(props) {
  const [pos, setPos] = useState(null);
  const [innerComponents, setInnerComponents] = useState(null);
  
  function onClick(e) {
    const rightClick = e.button === 2
    if(rightClick) {
      setPos(pos => pos = {x: e.pageX, y: e.pageY});
    } else {
      if(e.target.classList[0] === 'context-menu-component') return;
      setPos(pos => pos = null)
    }
    switch(e.target.classList[0]) {
      case "object": 
        setInnerComponents(<>


          <ContextMenuComponent text="Scale [Up, Down]" 
          element={<>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleUp', {detail: e.target.id}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleDown', {detail: e.target.id}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Rotate [Scroll]" 
          element={<>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateClockwise', {detail: e.target.id}))}} 
          text=">"/>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateAnticlockwise', {detail: e.target.id}))}} 
          text="<"/>
          </>}/>


          <ContextMenuComponent text="Layer" 
          element={<>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerUp', {detail: e.target.id}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerDown', {detail: e.target.id}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Flip [F]" callback={() => {document.dispatchEvent(new CustomEvent('flip', {detail: e.target.id}))}}/>


          <ContextMenuComponent text="Lock [L]" callback={() => {document.dispatchEvent(new CustomEvent('lock', {detail: e.target.id}))}}/>
        </>)
        break;
      case "page-object":
      
        setInnerComponents(<>


          <ContextMenuComponent text="Scale [Up, Down]" 
          element={<>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleUp', {detail: e.target.id}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleDown', {detail: e.target.id}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Layer" 
          element={<>
          <ContextMenuComponent 
          className="layer" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerUp', {detail: e.target.id}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="layer" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerDown', {detail: e.target.id}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Rotate [Scroll]" 
          element={<>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateClockwise', {detail: e.target.id}))}} 
          text=">"/>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateAnticlockwise', {detail: e.target.id}))}} 
          text="<"/>
          </>}/>
          

          <ContextMenuComponent text="Page" 
          element={<>
          <ContextMenuComponent 
          className="page" 
          callback={() => {document.dispatchEvent(new CustomEvent('pageRight', {detail: e.target.id}))}} 
          text=">"/>
          <ContextMenuComponent 
          className="page" 
          callback={() => {document.dispatchEvent(new CustomEvent('pageLeft', {detail: e.target.id}))}} 
          text="<"/>
          </>}/>


          <ContextMenuComponent text="Random Page [R]" callback={() => {document.dispatchEvent(new CustomEvent('randomPage', {detail: e.target.id}))}} />


          <ContextMenuComponent text="Lock [L]" callback={() => {document.dispatchEvent(new CustomEvent('lock', {detail: e.target.id}))}}/>
        </>)
        break;
      case "split-object":
        setInnerComponents(<>


          <ContextMenuComponent text="Scale [Up, Down]" 
          element={<>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleUp', {detail: e.target.id}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleDown', {detail: e.target.id}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Rotate [Scroll]" 
          element={<>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateClockwise', {detail: e.target.id}))}} 
          text=">"/>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateAnticlockwise', {detail: e.target.id}))}} 
          text="<"/>
          </>}/>


          <ContextMenuComponent text="Layer" 
          element={<>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerUp', {detail: e.target.id}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerDown', {detail: e.target.id}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Flip [F]" callback={() => {document.dispatchEvent(new CustomEvent('flip', {detail: e.target.id}))}}/>


          <ContextMenuComponent text="Lock [L]" callback={() => {document.dispatchEvent(new CustomEvent('lock', {detail: e.target.id}))}}/>
        </>)
        break;
      case "dice":
        setInnerComponents(<>
          <ContextMenuComponent text="Scale [Up, Down]" 
          element={<>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleUp', {detail: e.target.id}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleDown', {detail: e.target.id}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Layer" 
          element={<>
          <ContextMenuComponent 
          className="layer" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerUp', {detail: e.target.id}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="layer" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerDown', {detail: e.target.id}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Rotate [Scroll]" 
          element={<>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateClockwise', {detail: e.target.id}))}} 
          text=">"/>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateAnticlockwise', {detail: e.target.id}))}} 
          text="<"/>
          </>}/>
          

          <ContextMenuComponent text="Page" 
          element={<>
          <ContextMenuComponent 
          className="page" 
          callback={() => {document.dispatchEvent(new CustomEvent('pageRight', {detail: e.target.id}))}} 
          text=">"/>
          <ContextMenuComponent 
          className="page" 
          callback={() => {document.dispatchEvent(new CustomEvent('pageLeft', {detail: e.target.id}))}} 
          text="<"/>
          </>}/>
          <ContextMenuComponent text="Roll [R]" callback={() => {document.dispatchEvent(new CustomEvent('randomPage', {detail: e.target.id}))}} />
          <ContextMenuComponent text="Lock [L]" callback={() => {document.dispatchEvent(new CustomEvent('lock', {detail: e.target.id}))}}/>
        </>)
        break;
      case "deck":

        console.log(document.getElementById(e.target.id).props)
        setInnerComponents(<>
          <ContextMenuComponent text="Scale [Up, Down]" 
          element={<>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleUp', {detail: e.target.deckId}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleDown', {detail: e.target.deckId}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Layer" 
          element={<>
          <ContextMenuComponent 
          className="layer" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerUp', {detail: e.target.deckId}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="layer" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerDown', {detail: e.target.deckId}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Rotate [Scroll]" 
          element={<>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateClockwise', {detail: e.target.deckId}))}} 
          text=">"/>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateAnticlockwise', {detail: e.target.deckId}))}} 
          text="<"/>
          </>}/>
          

          <ContextMenuComponent text="Page" 
          element={<>
          <ContextMenuComponent 
          className="page" 
          callback={() => {document.dispatchEvent(new CustomEvent('pageRight', {detail: e.target.deckId}))}} 
          text=">"/>
          <ContextMenuComponent 
          className="page" 
          callback={() => {document.dispatchEvent(new CustomEvent('pageLeft', {detail: e.target.deckId}))}} 
          text="<"/>
          </>}/>
          <ContextMenuComponent text="Shuffle [R]" callback={() => {document.dispatchEvent(new CustomEvent('randomPage', {detail: e.target.id}))}} />
          <ContextMenuComponent text="Lock [L]" callback={() => {document.dispatchEvent(new CustomEvent('lock', {detail: e.target.id}))}}/></>)
        break;
      case "page-split-object":
        setInnerComponents(<>


          <ContextMenuComponent text="Scale [Up, Down]" 
          element={<>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleUp', {detail: e.target.id}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="scale" 
          callback={() => {document.dispatchEvent(new CustomEvent('scaleDown', {detail: e.target.id}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Layer" 
          element={<>
          <ContextMenuComponent 
          className="layer" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerUp', {detail: e.target.id}))}} 
          text="+"/>
          <ContextMenuComponent 
          className="layer" 
          callback={() => {document.dispatchEvent(new CustomEvent('layerDown', {detail: e.target.id}))}} 
          text="-"/>
          </>}/>


          <ContextMenuComponent text="Rotate [Scroll]" 
          element={<>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateClockwise', {detail: e.target.id}))}} 
          text=">"/>
          <ContextMenuComponent 
          className="rotate" 
          callback={() => {document.dispatchEvent(new CustomEvent('rotateAnticlockwise', {detail: e.target.id}))}} 
          text="<"/>
          </>}/>
          

          <ContextMenuComponent text="Page" 
          element={<>
          <ContextMenuComponent 
          className="page" 
          callback={() => {document.dispatchEvent(new CustomEvent('pageRight', {detail: e.target.id}))}} 
          text=">"/>
          <ContextMenuComponent 
          className="page" 
          callback={() => {document.dispatchEvent(new CustomEvent('pageLeft', {detail: e.target.id}))}} 
          text="<"/>
          </>}/>


          <ContextMenuComponent text="Random Page [R]" callback={() => {document.dispatchEvent(new CustomEvent('randomPage', {detail: e.target.id}))}} />


          <ContextMenuComponent text="Lock [L]" callback={() => {document.dispatchEvent(new CustomEvent('lock', {detail: e.target.id}))}}/>
        </>)
        break;
      default:
        setPos(null);
        setInnerComponents(null);
        break;
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', onClick);
    return() => {
      document.removeEventListener('mousedown', onClick);
    }
  })

  if(!pos) return;
  return(
    <div className="context-menu" style={{minWidth: 200, minHeight: 50, top: pos.y, left: pos.x}}>{innerComponents}</div>
  )
}
export default ContextMenu