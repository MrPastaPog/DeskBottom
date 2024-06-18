

function FixedView(props) {
  function handleClick(e) {
    document.dispatchEvent(new CustomEvent('closeFixedView'))
  }
  
  if (!props.src) return null;
  if(props.split) {
    const objectStyle = {
      clipPath: `inset(
      ${props.inset.top}% 
      ${props.inset.right}%
      ${props.inset.bottom}% 
      ${props.inset.left}%
      )`,
      transform: `translateX(${-props.cropX / props.gridLengthWidth * 100}%) translateY(${-props.cropY / props.gridLengthHeight * 100}%)`,
      top: '5%',
      left: '5%',
      borderRadius: props.borderRadius
    }
    return(<><img className={"split-fixed-view"} width={props.gridLengthWidth * 90 + '%'} height={props.gridLengthHeight * 90  + '%'} src={props.src} style={objectStyle}/> <button className="fixed-view-button" onClick={handleClick}>CLOSE</button></>)
  } else {
    return(<><img className={"fixed-view"} src={props.src} style={{borderRadius: props.borderRadius}}/> <button className="fixed-view-button" onClick={handleClick}>CLOSE</button></>)
  }
  
}
export default FixedView