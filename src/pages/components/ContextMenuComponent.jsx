function ContextMenuComponent(props) {
  const classname = props.className == undefined ? '' : ' ' + props.className;
  return(
    <div className={`context-menu-component${classname}`}onClick={props.callback}>
      {props.text}
      {props.element}
    </div>
  )
}
export default ContextMenuComponent