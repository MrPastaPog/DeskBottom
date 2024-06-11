import React, { useState, useEffect, useRef, useContext } from 'react';
import makeid from '../../makeid';
import FixedView from './FixedView';
import { Camera } from '../Game';
function PageObject(props) {
  
  const [pos, setPos] = useState(props.pos || { x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const camera = useContext(Camera);
  const [src, setSrc] = useState(src => src = props.src || ['http://via.placeholder.com/150']);
  const [page, setPage] = useState(page => page = props.page || 0)
  const [scale, setScale] = useState(props.scale || 1);
  const [size, setSize] = useState(size => size = props.size || {width: 0, height: 0});
  const [rotation, setRotation] = useState(props.rotation || 0);
  const [fixedView, setFixedView] = useState(false);
  const id = useRef(props.id || makeid(10));
  const isLocked = useRef(props.locked || false);
  const objectElement = useRef();
  const scaleRef = useRef(scale);


  function onRender(e) {
    if(size.width !== 0 && size.height !== 0) return;
    setSize({width: e.target.naturalWidth, height: e.target.naturalHeight})
  }

  function onClick(e) {
    e.preventDefault();
    
    if(e.button === 0) {
      if(isLocked.current) return;
      setIsClicking(true);
      setOffsetX(e.pageX - pos.x);
      setOffsetY(e.pageY - pos.y);
    } 
    
  }


  function onDrag(e) {

      if(isLocked.current) return;
      if (!isClicking || e.buttons === 0) {
        setIsClicking(false);
        return;
      }
      setPos({ x: e.pageX - offsetX, y: e.pageY - offsetY });
    
  }

  function offClick(e) {

    if (e.button === 0) {
      setIsClicking(false);
    }
  }

  function mouseOver() {
    setIsCursorHovering(true)
  }

  function mouseOut() {
    setIsCursorHovering(false)
  }
  
  function scaleUp(amount, e) { 
    if(e !== undefined) {
      if(e.detail !== objectElement.current.id) return;
    }
    if(isLocked.current) return;
    if(scaleRef.current >= 3) {return;}
    scaleRef.current = Math.round((scaleRef.current + amount) * 100) / 100;
    setScale(scale => scale = scaleRef.current);
    const width = objectElement.current.naturalWidth 
    const height = objectElement.current.naturalHeight
    setSize(size => size = {width: width, height: height}) 
    const [currentWidth, currentHeight] = [scaleRef.current * width, scaleRef.current * height];
    const offsetX = (currentWidth + amount * width - currentWidth) / 2;
    const offsetY = (currentHeight + amount * height - currentHeight) / 2;
    setPos(pos => {
      pos = {x: pos.x - offsetX, y: pos.y - offsetY}
      return pos;
    })
  }

  function scaleDown(amount, e) {
    if(e !== undefined) {
      if(e.detail !== objectElement.current.id) return;
    }
    if(isLocked.current) return;
    if(scaleRef.current <= 0.5) return;
    scaleRef.current = Math.round((scaleRef.current - amount) * 100) / 100;
    setScale(scale => scale = scaleRef.current);
    const width = objectElement.current.naturalWidth 
    const height = objectElement.current.naturalHeight
    setSize(size => size = {width: width, height: height}) 
    const [currentWidth, currentHeight] = [scaleRef.current * width, scaleRef.current * height];
    const offsetX = (currentWidth + amount * width - currentWidth) / 2;
    const offsetY = (currentHeight + amount * height - currentHeight) / 2;
    setPos(pos => {
      pos = {x: pos.x + offsetX, y: pos.y + offsetY}
      return pos;
    })
  }

  function changePage(index) {
    
    setPage(prevPage => {
      if(index >= src.length) return prevPage;
      if(index < 0) return prevPage;
      return index;
    })
  }

  function pageLeft() {
    setPage(prevPage => (prevPage - 1 + src.length) % src.length);
  }

  function pageRight() {
    setPage(prevPage => (prevPage + 1) % src.length);
  }

  function fixedViewChange() {
    setFixedView(fixedView => !fixedView)
  }
  function fixedViewClose() {
    setFixedView(fixedView => false);
  }

  function randomPage() {
    setPage(page => Math.floor(Math.random() * src.length))
  }

  function keyPress(e) {
    if(!isCursorHovering) return;
    switch(e.key) {
      case 'ArrowLeft': pageLeft(); break;
      case 'ArrowRight': pageRight(); break;
      case 'l': lock(); break;
      case 'ArrowUp': scaleUp(0.1); break;
      case 'ArrowDown': scaleDown(0.1); break;
      case 'Control': fixedViewChange(); break;
      case 'r': randomPage(); break;

    }
    if(isNaN(Number(e.key)) === false) {
      changePage(Number(e.key) - 1)
    }
  }

  function onScroll(e) {
    
    if(isLocked.current) return;
    if(!isCursorHovering) return;
    const scrollUp = e.deltaY < 0;
    scrollUp ? 
    setRotation(rotation => rotation = rotation === 360 ? 15 : rotation + 15)
      : 
    setRotation(rotation => rotation = rotation === 0 ? 345 : rotation - 15)
  }

  function lock(e) {
    if(e !== undefined) {
      if(e.detail !== objectElement.current.id) return;
    }
    isLocked.current = !isLocked.current
    objectElement.current.style.border = isLocked.current ? '2px solid red' : 'None';
  }



  useEffect(() => console.log(camera), [camera])

  useEffect(() => {
    

    document.addEventListener('scaleUp', (e) => scaleUp(0.1, e));
    document.addEventListener('scaleDown', (e) => scaleDown(0.1, e));
    document.addEventListener('rotateClockwise', (e) => {
      if(e !== undefined) {
        if(e.detail !== objectElement.current.id) return;
      }
      if(isLocked.current) return;
      setRotation(rotation => rotation = rotation === 360 ? 15 : rotation + 15)
    })
    document.addEventListener('rotateAnticlockwise', (e) => {
      if(e !== undefined) {
        if(e.detail !== objectElement.current.id) return;
      }
      if(isLocked.current) return;
      setRotation(rotation => rotation = rotation === 0 ? 345 : rotation - 15)
    })
    return () => {

      document.removeEventListener('scaleUp', (e) => scaleUp(0.1, e));
      document.removeEventListener('scaleDown', (e) => scaleDown(0.1, e));
      document.removeEventListener('rotateClockwise', (e) => {
        if(e !== undefined) {
          if(e.detail !== objectElement.current.id) return;
        }
        if(isLocked.current) return;
        setRotation(rotation => rotation = rotation === 0 ? 345 : rotation + 15)
      })
      document.removeEventListener('rotateAnticlockwise', (e) => {
        if(e !== undefined) {
          if(e.detail !== objectElement.current.id) return;
        }
        if(isLocked.current) return;
        setRotation(rotation => rotation = rotation === 360 ? 15 : rotation - 15)
      })
    }
  }, [])

    

  useEffect(() => {
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', offClick);
    document.addEventListener('pageLeft', pageLeft);
    document.addEventListener('pageRight', pageRight);
    document.addEventListener('lock', lock);
    document.addEventListener('closeFixedView', fixedViewClose)
    document.addEventListener('randomPage', randomPage);
    return () => {
      
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', offClick);
      document.removeEventListener('pageLeft', pageLeft);
      document.removeEventListener('pageRight', pageRight);
      document.removeEventListener('lock', lock);
      document.removeEventListener('closeFixedView', fixedViewClose)
      document.removeEventListener('randomPage', randomPage);
    };
  }, [isClicking]);



  useEffect(() => {
    document.addEventListener('keydown', keyPress)
    document.addEventListener('wheel', onScroll)
    objectElement.current.style.border = isCursorHovering ? 
      isLocked.current ? 
        '2px solid red' 
        : 
        'None' 
      : 
      'None';

    return () => {
      document.removeEventListener('keydown', keyPress);
      document.removeEventListener('wheel', onScroll);
    }
  }, [isCursorHovering])

  return (<>
    <img
      src={src[page]}
      style={{ left: pos.x + camera.CamX, top: pos.y + camera.CamY, transform: `rotate(${rotation}deg)`}}
      ref={objectElement}
      className="page-object"
      onMouseDown={onClick}
      onMouseEnter={mouseOver}
      onMouseLeave={mouseOut}
      onLoad={onRender}
      width={scale * size.width}
      height={scale * size.height}
      id={id.current}
    />
    
    {fixedView ? <FixedView src={props.src[page]}></FixedView> : null}
  </>);
} 
export default PageObject