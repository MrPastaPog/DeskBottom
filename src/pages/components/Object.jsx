import React, { useState, useEffect, useRef, useContext } from 'react';

import FixedView from './FixedView';
import makeid from '../../makeid';
import {Camera} from '../Game'


function Object(props) {
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
  const [camera, setCamera] = useState({x: 0, y: 0});
  const cameraPos = useRef({x: 0, y: 0});
  const [size, setSize] = useState(props.size || { width: 0, height: 0 });
  const [rotation, setRotation] = useState(props.rotation || 0);
  const [fixedView, setFixedView] = useState(false);
  const id = useRef(props.id || makeid(10));
  const isLocked = useRef(props.locked || false);
  const objectElement = useRef();
  const scaleRef = useRef(scale);
  
  function onRender(e) {
    if (size.width !== 0 && size.height !== 0) return;
    setSize({ width: e.target.naturalWidth, height: e.target.naturalHeight });
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
    setPos({ x: e.pageX - offsetX, y: e.pageY - offsetY });
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
    scaleRef.current = Math.round((scaleRef.current + amount) * 100) / 100;
    setScale(scaleRef.current);
    const width = size.width;
    const height = size.height;
    setSize({ width, height });
    const [currentWidth, currentHeight] = [scaleRef.current * width, scaleRef.current * height];
    const offsetX = (currentWidth + amount * width - currentWidth) / 2;
    const offsetY = (currentHeight + amount * height - currentHeight) / 2;
    setPos(pos => ({ x: pos.x - offsetX, y: pos.y - offsetY }));
  }

  function scaleDown(amount, e) {
    if (e !== undefined) {
      if (e.detail !== objectElement.current.id) return;
    }
    if (isLocked.current) return;
    if (scaleRef.current <= 0.2) return;
    scaleRef.current = Math.round((scaleRef.current - amount) * 100) / 100;
    setScale(scaleRef.current);
    const width = size.width;
    const height = size.height;
    setSize({ width, height });
    const [currentWidth, currentHeight] = [scaleRef.current * width, scaleRef.current * height];
    const offsetX = (currentWidth + amount * width - currentWidth) / 2;
    const offsetY = (currentHeight + amount * height - currentHeight) / 2;
    setPos(pos => ({ x: pos.x + offsetX, y: pos.y + offsetY }));
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
      case 'Shift':
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
        style={{ left: pos.x + CameraContext.CamX, top: pos.y + CameraContext.CamY, transform: `rotate(${rotation}deg)`}}
        ref={objectElement}
        className="object"
        onMouseDown={onClick}
        onMouseEnter={mouseOver}
        onMouseLeave={mouseOut}
        onLoad={onRender}
        width={scale * size.width}
        height={scale * size.height}
        id={id.current}
      />
      {props.cb}
      {fixedView ? <FixedView src={props.src} borderRadius={objectElement.current.style.borderRadius}/> : null}
    </>
  );
}

export default Object;
