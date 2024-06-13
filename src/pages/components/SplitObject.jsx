import React, { useState, useEffect, useRef, useContext } from 'react';

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
  const [src, setSrc] = useState(props.src || 'http://via.placeholder.com/150');
  const [backsrc, setBackSrc] = useState(props.backsrc || 'http://via.placeholder.com/150');
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


    
    objectElement.current.style.left = `${pos.x + CameraContext.CamX - ((props.width || e.target.naturalWidth) / props.gridLength.width * props.crop.x)}px`
    objectElement.current.style.top = `${pos.y + CameraContext.CamY - ((props.height || e.target.naturalHeight) / props.gridLength.height * props.crop.y)}px`
  }

  function onClick(e) {
    e.preventDefault();
    
    if (e.button !== 0) return;
    if (isLocked.current) return;
    setIsClicking(true);
    console.log(pos.x)
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
    console.log(prevCardWidth)
    scaleRef.current = Math.round((scaleRef.current + amount) * 100) / 100;
    const cardWidth = scaleRef.current * size.width / props.gridLength.width
    const cardHeight = scaleRef.current * size.height / props.gridLength.height
    console.log(cardWidth)
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
    if (e !== undefined) {
      if (e.detail !== objectElement.current.id) return;
    }
    if (isLocked.current) return;
    if (scaleRef.current <= 0.5) return;
    const prevScale = scaleRef.current;
    const prevCardWidth = prevScale * size.width / props.gridLength.width
    const prevCardHeight = prevScale * size.height / props.gridLength.height
    console.log(prevCardWidth)
    scaleRef.current = Math.round((scaleRef.current - amount) * 100) / 100;
    const cardWidth = scaleRef.current * size.width / props.gridLength.width
    const cardHeight = scaleRef.current * size.height / props.gridLength.height
    console.log(cardWidth)
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
      case 'f':
        flip();
        break;
      case 'l':
        lock();
        break;
      case 'ArrowUp':
        scaleUp(0.1);
        break;
      case 'ArrowDown':
        scaleDown(0.1);
        break;
      case 'Control':
        fixedViewChange();
        break;
      default:
        break;
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
    console.log(pos.x)
    setPos({x: posa.x + cameraPos.current.x, y: posa.y + cameraPos.current.y})
  }
  
  useEffect(() => {

    document.addEventListener('camera', cameraChange)
    document.addEventListener('fixCamera', fixCamera)
    document.addEventListener('scaleUp', (e) => scaleUp(0.1, e));
    document.addEventListener('scaleDown', (e) => scaleDown(0.1, e));
    document.addEventListener('rotateClockwise', (e) => {
      if (e !== undefined) {
        if (e.detail !== objectElement.current.id) return;
      }
      if (isLocked.current) return;
      setRotation(rotation => (rotation === 360 ? 15 : rotation + 15));
    });
    document.addEventListener('rotateAnticlockwise', (e) => {
      if (e !== undefined) {
        if (e.detail !== objectElement.current.id) return;
      }
      if (isLocked.current) return;
      setRotation(rotation => (rotation === 0 ? 345 : rotation - 15));
    });
    return () => {
      document.removeEventListener('camera', cameraChange)
      document.removeEventListener('fixCamera', fixCamera)
      document.removeEventListener('scaleUp', (e) => scaleUp(0.1, e));
      document.removeEventListener('scaleDown', (e) => scaleDown(0.1, e));
      document.removeEventListener('rotateClockwise', (e) => {
        if (e !== undefined) {
          if (e.detail !== objectElement.current.id) return;
        }
        if (isLocked.current) return;
        setRotation(rotation => (rotation === 360 ? 15 : rotation + 15));
      });
      document.removeEventListener('rotateAnticlockwise', (e) => {
        if (e !== undefined) {
          if (e.detail !== objectElement.current.id) return;
        }
        if (isLocked.current) return;
        setRotation(rotation => (rotation === 0 ? 345 : rotation - 15));
      });
    };
  }, []);

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
        src={side === 1 ? src : backsrc}
        style={{ 
          left: pos.x + CameraContext.CamX - (size.width / props.gridLength.width * props.crop.x), 
          top: pos.y + CameraContext.CamY - (size.height / props.gridLength.height* props.crop.y),
          transform: `rotate(${rotation}deg)`,
          transformOrigin: `${(size.width / props.gridLength.width) * props.crop.x + (size.width / props.gridLength.width) / 2}px ${(size.height / props.gridLength.height) * props.crop.y + (size.height / props.gridLength.height) / 2}px`,
          clipPath : `inset(
            ${(size.height * scale) / props.gridLength.height * props.crop.y}px 
            ${(size.width * scale)  / props.gridLength.width * (props.gridLength.width - props.crop.x - 1)}px
            ${(size.height * scale) / props.gridLength.height * (props.gridLength.height - props.crop.y - 1)}px
            ${(size.width * scale)  / props.gridLength.width * props.crop.x}px)`
        }}
          
        ref={objectElement}
        className="object"
        onMouseDown={onClick}
        onMouseEnter={mouseOver}
        onMouseLeave={mouseOut}
        onLoad={onRender}
        // width={(size.width / props.gridLength.width * scale) + (props.gridLength.width - 1) * (size.width / props.gridLength.width)}
        // height={(size.height / props.gridLength.height * scale) + (props.gridLength.height - 1) * (size.height / props.gridLength.height)}
        width={size.width * scale}
        height={size.height * scale}
        id={id.current}
      />
      {props.cb}
      {fixedView ? <FixedView src={props.src} /> : null}
    </>
  );
}

export default SplitObject;
