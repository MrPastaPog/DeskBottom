import React, { useState, useEffect, useRef, useContext } from 'react';
import splitImage from '../../SplitImage';
import FixedView from './FixedView';
import makeid from '../../makeid';
import {Camera} from '../Game'

function SplitObject(props) {

  const [pos, setPos] = useState(props.pos || { x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const CameraContext = useContext(Camera);
  const [src, setSrc] = useState();
  const [backSrc, setBackSrc] = useState();
  const [side, setSide] = useState(props.side || 1);
  const [scale, setScale] = useState(props.scale || 1);
  const cameraPos = useRef({x: 0, y: 0});
  const [size, setSize] = useState(props.size === undefined ? {width: props.size.width * props.gridLength.width, height: props.size.height * props.gridLength.height} : { width: 0, height: 0 });
  const [rotation, setRotation] = useState(props.rotation || 0);
  const [fixedView, setFixedView] = useState(false);
  const id = useRef(props.id || makeid(10));
  const isLocked = useRef(props.locked || false);
  const objectElement = useRef();
  const scaleRef = useRef(scale);
  
  function onRender(e) {

    setSize(size => ({ width: e.target.naturalWidth, height: e.target.naturalHeight }));
  }

  function onClick(e) {
    e.preventDefault();
    
    if (e.button !== 0) return;
    if (isLocked.current) return;
    setIsClicking(true);
    setOffsetX(e.pageX - pos.x);
    setOffsetY(e.pageY - pos.y);
    
  }

  function onDrag(e) {
    if (isLocked.current) return;
    if (!isClicking || e.buttons === 0) {
      setIsClicking(false);
      return;
    }
    setPos({ x: e.pageX - offsetX, y: e.pageY - offsetY});
  }




  function offClick(e) {

    if (e.button !== 0) return;
    setIsClicking(false);
  }

  function mouseOver() {
    setIsCursorHovering(true);
  }

  function mouseOut() {
    setIsCursorHovering(false);
  }

  function scaleUp(amount, e) {
    
    if (e !== undefined) {
      if (e.detail !== objectElement.current.id) return;
    }
    if (isLocked.current) return;
    if (scaleRef.current >= 3) return;
    
    const prevScale = scaleRef.current;
    const prevCardWidth = prevScale * size.width / props.gridLength.width
    const prevCardHeight = prevScale * size.height / props.gridLength.height
    scaleRef.current = Math.round((scaleRef.current + amount) * 100) / 100;
    const cardWidth = scaleRef.current * size.width / props.gridLength.width
    const cardHeight = scaleRef.current * size.height / props.gridLength.height
    const offsetCardWidth = cardWidth - prevCardWidth 
    const offsetCardHeight = cardHeight - prevCardHeight 
    setScale(scaleRef.current);
    setPos(pos => {
      pos.x -= offsetCardWidth * props.crop.x
      pos.y -= offsetCardHeight * props.crop.y
      const offsetX = offsetCardWidth / 2;
      const offsetY = offsetCardHeight / 2;
      pos.x -= offsetX
      pos.y -= offsetY
      return pos;
    })

  }

  function scaleDown(amount, e) {
    if (scale.width === 0 || scale.height === 0) return;
    
    if (e !== undefined) {
      if (e.detail !== objectElement.current.id) return;
    }
    if (isLocked.current) return;
    if (scaleRef.current <= 0.2) return;
    const prevScale = scaleRef.current;
    const prevCardWidth = prevScale * size.width / props.gridLength.width
    const prevCardHeight = prevScale * size.height / props.gridLength.height
    scaleRef.current = Math.round((scaleRef.current - amount) * 100) / 100;
    const cardWidth = scaleRef.current * size.width / props.gridLength.width
    const cardHeight = scaleRef.current * size.height / props.gridLength.height
    const offsetCardWidth = prevCardWidth - cardWidth
    const offsetCardHeight = prevCardHeight - cardHeight
    setScale(scaleRef.current);
    setPos(pos => {
      pos.x += offsetCardWidth * props.crop.x
      pos.y += offsetCardHeight * props.crop.y
      const offsetX = offsetCardWidth / 2;
      const offsetY = offsetCardHeight / 2;
      pos.x += offsetX
      pos.y += offsetY
      return pos;
    })

  }

  function fixedViewChange() {
    setFixedView(fixedView => !fixedView);
  }

  function fixedViewClose() {
    setFixedView(false);
  }

  function keyPress(e) {
    if (!isCursorHovering) return;
    switch (e.key) {
      case 'f': flip(); break;
      case 'l': lock(); break;
      case 'ArrowUp': scaleUp(0.1); break;
      case 'ArrowDown': scaleDown(0.1); break;
      case 'Shift': fixedViewChange(); break;
    }
  }

  function onScroll(e) {
    if (isLocked.current) return;
    if (!isCursorHovering) return;
    const scrollUp = e.deltaY < 0;
    setRotation(rotation => (scrollUp ? (rotation === 360 ? 15 : rotation + 15) : (rotation === 0 ? 345 : rotation - 15)));
  }

  function lock(e) {
    if (e !== undefined) {
      if (e.detail !== objectElement.current.id) return;
    }
    isLocked.current = !isLocked.current;
    objectElement.current.style.border = isLocked.current ? '2px solid red' : 'None';
  }

  function flip(e) {
    if (e !== undefined) {
      if (e.detail !== objectElement.current.id) return;
    }
    if (!isLocked.current) {
      setSide(side => side === 1 ? 2 : 1);
    }
  }

  function fixCamera() {
    const rect = objectElement.current.getBoundingClientRect();
    cameraPos.current = { x: rect.left, y: rect.top }
  }
  function cameraChange(e) {
    let posa = e.detail
    setPos({x: posa.x + cameraPos.current.x, y: posa.y + cameraPos.current.y})
  }
  
  function eventListenerScaleUp(e) {
    scaleUp(0.1, e)
  }
  function eventListenerScaleDown(e) {
    scaleDown(0.1, e)
  }

  useEffect(() => {

    document.addEventListener('camera', cameraChange)
    document.addEventListener('fixCamera', fixCamera)
    document.addEventListener('scaleUp', eventListenerScaleUp);
    document.addEventListener('scaleDown', eventListenerScaleDown);
    
    return () => {
      document.removeEventListener('camera', cameraChange)
      document.removeEventListener('fixCamera', fixCamera)
      document.removeEventListener('scaleUp', eventListenerScaleUp);
      document.removeEventListener('scaleDown', eventListenerScaleDown);
      
    };
  }, [isCursorHovering]);

  function rotateClockwise(e) {
    if (e !== undefined) {
      if (e.detail !== objectElement.current.id) return;
    }
    if (isLocked.current) return;
    setRotation(rotation => (rotation === 360 ? 15 : rotation + 15));
  }
  function rotateAnticlockwise(e) {
    if (e !== undefined) {
      if (e.detail !== objectElement.current.id) return;
    }
    if (isLocked.current) return;
    setRotation(rotation => (rotation === 0 ? 345 : rotation - 15));
  } 

  useEffect(() => {
    console.log(props.crop, props.gridLength)
    splitImage(props.src || "https://dummyimage.com/150x150/eeeeff/000000.png&text=placeholder", props.gridLength.height, props.gridLength.width, (pieces) => {
      setSrc(pieces[props.crop.y][props.crop.x])
    })
    if (props.backSplit) {
      splitImage(props.backSrc || "https://dummyimage.com/150x150/eeeeff/000000.png&text=placeholder", props.gridLength.height, props.gridLength.width, (pieces) => {
        setBackSrc(pieces[props.crop.y][props.crop.x])
      })
    } else {
      setBackSrc(props.backSrc)
    }
    document.addEventListener('rotateClockwise', rotateClockwise);
    document.addEventListener('rotateAnticlockwise', rotateAnticlockwise);
    return () => {
      document.removeEventListener('rotateClockwise', rotateClockwise);
      document.removeEventListener('rotateAnticlockwise', rotateAnticlockwise);
    }
  }, [])

  useEffect(() => {
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', offClick);
    document.addEventListener('flip', flip);
    document.addEventListener('lock', lock);
    document.addEventListener('closeFixedView', fixedViewClose);
    return () => {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', offClick);
      document.removeEventListener('flip', flip);
      document.removeEventListener('lock', lock);
      document.removeEventListener('closeFixedView', fixedViewClose);
    };
  }, [isClicking]);

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    document.addEventListener('wheel', onScroll);
    objectElement.current.style.border = isCursorHovering
      ? isLocked.current
        ? '2px solid red'
        : 'None'
      : 'None';

    return () => {
      document.removeEventListener('keydown', keyPress);
      document.removeEventListener('wheel', onScroll);
    };
  }, [isCursorHovering]);
  return (
    <>
      <img
        src={side === 1 ? src : backSrc}
        style={{ 
          left: pos.x + CameraContext.CamX, 
          top: pos.y + CameraContext.CamY,
          transform: `rotate(${rotation}deg)`
        }}
        ref={objectElement}
        className={props.className === undefined ? "split-object" : props.className + " split-object"}
        onMouseDown={onClick}
        onMouseEnter={mouseOver}
        onMouseLeave={mouseOut}
        onLoad={onRender}
        width={size.width * scale}
        height={size.height * scale}
        id={id.current}
      />
      {props.cb}
      {fixedView ? <FixedView 
      src={src} 
      borderRadius={objectElement.current.style.borderRadius}/>
       : null}
    </>
  );
}

export default SplitObject;
