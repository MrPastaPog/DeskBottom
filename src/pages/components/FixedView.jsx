

function FixedView(props) {
  function handleClick() {
    document.dispatchEvent(new CustomEvent('closeFixedView'))
  }
  if (!props.src) return null;
  return(<><img className="fixed-view" src={props.src}/> <button className="fixed-view-button" onClick={handleClick}>X</button></>)
}
export default FixedView