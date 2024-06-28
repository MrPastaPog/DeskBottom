import splitImage from "../../SplitImage"
import React, {useState, useRef, useEffect} from 'react';
function Test() {
  const [src, setSrc] = useState();
  const testRef = useRef();
  useEffect(() => {
    splitImage('./Back.png', 1, 1, (pieces) => {
      setSrc( pieces[0][0])
      
    })
  }, [])
  
  useEffect(() => {
    console.log(testRef.current.width)
  }, [src])
  return(<img src={src} ref={testRef}/>)
}
export default Test