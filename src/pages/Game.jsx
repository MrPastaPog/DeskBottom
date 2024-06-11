import ContextMenu from "./components/ContextMenu";
import Object from "./components/Object";
import PageObject from "./components/PageObject";
import Dice from "./components/Dice";
import React, {useState, useEffect, useRef, createContext} from 'react';
import FixedView from "./components/FixedView";
import makeid from "../makeid";


export const Camera = createContext();

function Game() {

  const [jsonTable, setJsonTable] = useState([]);
  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);
  const cameraOffset = useRef({x: 0, y: 0});
  const cameraFixOffset = useRef({x: 0, y: 0})
  const middleClick = useRef(false);




  function RenderJson(json) {
    json.map(jsonObject => {
      let ComponentJsx;
      switch(jsonObject.component) {
        case "Object":
          ComponentJsx = <Object
          pos={{x: (jsonObject.pos.x || 0) , y: (jsonObject.pos.y || 0)}}
          src={jsonObject.src} 
          backsrc={jsonObject.backsrc} 
          scale={jsonObject.scale}
          size={{width: jsonObject.size.width || 0, height:jsonObject.size.height || 0}}
          rotation={jsonObject.rotation}
          id={jsonObject.id === undefined ? makeid(10) : jsonObject.id}
          locked={jsonObject.locked}
          side={jsonObject.side}
          key={jsonObject.id === undefined ? makeid(10) : jsonObject.id}
          />
          break;
        case "PageObject":
          ComponentJsx = <PageObject
          pos={{x: (jsonObject.pos.x || 0) , y: (jsonObject.pos.y || 0)}}
          src={jsonObject.src} 
          page={jsonObject.page}
          scale={jsonObject.scale}
          size={jsonObject.size || 0}
          rotation={jsonObject.rotation}
          id={jsonObject.id || makeid(10)}
          locked={jsonObject.locked}
          side={jsonObject.side}
          key={jsonObject.id || makeid(10)}
          />
          break;
        case "Dice":
          ComponentJsx = <Dice
          pos={jsonObject.pos || {x: 0, y: 0}}
          page={jsonObject.page}
          scale={jsonObject.scale}
          size={jsonObject.size || 0}
          rotation={jsonObject.rotation}
          id={jsonObject.id || makeid(10)}
          locked={jsonObject.locked}
          side={jsonObject.side}
          key={jsonObject.id || makeid(10)}
          />
          break;
      }
      console.log(ComponentJsx)
      
        setJsonTable(jsonTable => jsonTable = [...jsonTable, ComponentJsx])
      
    })
  }
  

  function moveLayer(id, direction) {
    
    setJsonTable(prevTable => {
      
      const index = prevTable.findIndex(component => component.props.id === id );
      
      if(prevTable[index].props.locked) return; 
      console.log(index)
      if (index === -1) return prevTable;
      
      const newTable = [...prevTable];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex > newTable.length - 1) return prevTable;
      if (newIndex >= 0 && newIndex < newTable.length) {
        const [movedComponent] = newTable.splice(index, 1);
        newTable.splice(newIndex, 0, movedComponent);
      }

      return newTable;
    });
  }

  function layerUp(e) {
    const id = e.detail;
    moveLayer(id, 1);
  }

  function layerDown(e) {
    const id = e.detail;
    moveLayer(id, -1);
  }

  function mouseDown(e) {
    if (e.button === 1) {
      middleClick.current = true
      cameraOffset.current = {x: e.pageX, y: e.pageY}
    }
  }

  function mouseMove(e) {
    if (!middleClick.current) return;
    console.log(cameraFixOffset.current, e.pageX, cameraOffset.current)
    setCameraX(cameraFixOffset.current.x + e.pageX - cameraOffset.current.x)
    setCameraY(cameraFixOffset.current.y + e.pageY - cameraOffset.current.y)
  }

  function mouseUp(e) {

    if (e.button !== 1) return;
    middleClick.current = false;
    cameraFixOffset.current.x = cameraX
    cameraFixOffset.current.y = cameraY
  }

  useEffect(() => {
    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
    return () => {
      document.removeEventListener('mousedown', mouseDown)
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', mouseUp)
    }
  })

  useEffect(() => {
    
    fetch('table.json').then((r) => r.json())
    .then((json) => {
      RenderJson(json)
    })
    
    document.addEventListener('layerUp', layerUp)
    document.addEventListener('layerDown', layerDown)
    
    return() => {
      document.removeEventListener('layerUp', layerUp)
      document.removeEventListener('layerDown', layerDown)
      
    }
  }, [])

  return(<>
    <Camera.Provider value={{CamX: cameraX, CamY: cameraY}}>
    {jsonTable}
    </Camera.Provider>
    <ContextMenu /> 
    <FixedView/>
    
  </>)
}
export default Game