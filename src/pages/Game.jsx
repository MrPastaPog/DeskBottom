import ContextMenu from "./components/ContextMenu";
import Object from "./components/Object";
import PageObject from "./components/PageObject";
import Dice from "./components/Dice";
import React, {useState, useEffect, useRef, createContext} from 'react';
import FixedView from "./components/FixedView";
import makeid from "../makeid";
import SplitObject from "./components/SplitObject";
import PageSplitObject from "./components/PageSplitObject";
import ObjectsTouching from "../ObjectsTouching";
import InsertItemToIndex from "../InsertItemToIndex";

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
      let id = jsonObject.id || makeid(10)
      switch(jsonObject.component) {
        case "Object":
          ComponentJsx = <Object
          pos={jsonObject.pos || {x: 0, y: 0}}
          src={jsonObject.src} 
          backSrc={jsonObject.backSrc} 
          scale={jsonObject.scale}
          size={jsonObject.size || {width: 0, height: 0}}
          rotation={jsonObject.rotation}
          id={id}
          locked={jsonObject.locked}
          side={jsonObject.side}
          layer={jsonObject.layer}
          key={id}
          />
          break;
        case "PageObject":
          ComponentJsx = <PageObject
          pos={jsonObject.pos || {x: 0, y: 0}}
          src={jsonObject.src} 
          page={jsonObject.page}
          scale={jsonObject.scale}
          size={jsonObject.size || {width: 0, height: 0}}
          rotation={jsonObject.rotation}
          id={id}
          locked={jsonObject.locked}
          side={jsonObject.side}
          layer={jsonObject.layer}
          key={id}
          />
          break;
        case "Dice":
          ComponentJsx = <Dice
          pos={jsonObject.pos || {x: 0, y: 0}}
          page={jsonObject.page}
          scale={jsonObject.scale}
          size={jsonObject.size || {width: 0, height: 0}}
          rotation={jsonObject.rotation}
          id={id}
          locked={jsonObject.locked}
          side={jsonObject.side}
          layer={jsonObject.layer}
          key={id}
          />
          break;
        case "SplitObject":
          ComponentJsx = <SplitObject 
          pos={jsonObject.pos || {x: 0 , y: 0}}
          src={jsonObject.src} 
          backSrc={jsonObject.backSrc} 
          backsplit={jsonObject.backsplit || false}
          scale={jsonObject.scale}
          size={jsonObject.size || {width: 0, height: 0}}
          rotation={jsonObject.rotation}
          locked={jsonObject.locked}
          side={jsonObject.side}
          layer={jsonObject.layer}
          id={id}
          key={id}
          gridLength={jsonObject.gridLength || {width: 1, height: 1}}
          crop={jsonObject.crop || {x: 0, y: 0}}
          />
          break;
        case "PageSplitObject":
          ComponentJsx = <PageSplitObject
          pos={jsonObject.pos || {x: 0 , y: 0}}
          src={jsonObject.src} 
          backSrc={jsonObject.backSrc} 
          backsplit={jsonObject.backsplit || false}
          scale={jsonObject.scale}
          size={jsonObject.size || {width: 0, height: 0}}
          rotation={jsonObject.rotation}
          locked={jsonObject.locked}
          side={jsonObject.side}
          layer={jsonObject.layer}
          id={id}
          key={id}
          gridLength={jsonObject.gridLength || {width: 1, height: 1}}
          crop={jsonObject.crop || {x: 0, y: 0}}
          />
          break;
      }
      setJsonTable(jsonTable => jsonTable = [...jsonTable, ComponentJsx])
    })
  }
  
  function getTouchingObjectIndices(prevTable, objectIndex, id) {
    let touchingIndices = [];
    prevTable.forEach((prevObject) => {
      console.log(prevObject.props.id)
      if (prevObject.props.id === id) {touchingIndices.push(objectIndex); return;}
      if (ObjectsTouching(id, prevObject.props.id, prevTable[objectIndex].props.gridLength, prevObject.props.gridLength)) {
        touchingIndices.push(prevTable.indexOf(prevObject))
      }
    })
    return touchingIndices
  }

function moveLayer(id, direction) {
  setJsonTable(prevTable => {
    let newTable = [...prevTable];
    console.log(newTable)
    const objectIndex = newTable.findIndex(component => component.props.id === id);
    if (objectIndex === -1) return newTable;
    console.log('abc')
    console.log(objectIndex)
    const touchingIndices = getTouchingObjectIndices(newTable, objectIndex, id);
    console.log(touchingIndices)
    const touchIndex = touchingIndices.indexOf(objectIndex);

    if (direction === 1) {
      if (touchIndex + 1 >= touchingIndices.length) return prevTable; // Prevents out of bounds
      const movement = touchingIndices[touchIndex+1] - touchingIndices[touchIndex];
      if (objectIndex + movement >= newTable.length) return prevTable; // Prevents out of bounds
      
      // Swap the elements
      [newTable[objectIndex], newTable[objectIndex+movement]] = [newTable[objectIndex+movement], newTable[objectIndex]];

      console.log(newTable);
    } else if (direction === -1) {
      if (touchIndex - 1 < 0) return prevTable; // Prevents out of bounds
      const movement = touchingIndices[touchIndex] - touchingIndices[touchIndex-1];
      if (objectIndex - movement < 0) return prevTable; // Prevents out of bounds

      // Swap the elements
      [newTable[objectIndex], newTable[objectIndex-movement]] = [newTable[objectIndex-movement], newTable[objectIndex]];
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
    document.addEventListener('layerUp', layerUp)
    document.addEventListener('layerDown', layerDown)
    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
    return () => {
      document.removeEventListener('mousedown', mouseDown)
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', mouseUp)
      document.removeEventListener('layerUp', layerUp)
      document.removeEventListener('layerDown', layerDown)
    }
  })
  useEffect(() => {
    fetch('table.json').then((r) => r.json())
    .then((json) => {
      RenderJson(json)
    })
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