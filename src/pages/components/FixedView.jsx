

function FixedView(props) {
  function handleClick(e) {
    document.dispatchEvent(new CustomEvent('closeFixedView'))
  }
  if (!props.src) return null;
  return(<><img className={"fixed-view"} src={props.src} style={{borderRadius: props.borderRadius}}/> <button className="fixed-view-button" onClick={handleClick}>CLOSE</button></>)
}
export default FixedView