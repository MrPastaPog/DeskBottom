import PageObject from "./PageObject";
function Dice(props) {
  return(<PageObject
    pos={props.pos}
    src={['/dice/dice-1.svg', '/dice/dice-2.svg', '/dice/dice-3.svg', '/dice/dice-4.svg', '/dice/dice-5.svg', '/dice/dice-6.svg']} 
    page={props.page}
    scale={props.scale}
    size={{width: props.size.width, height:props.size.height}}
    rotation={props.rotation}
    id={props.id}
    locked={props.locked}
    side={props.side}
    key={props.id}
    className='dice'
    />)
}
export default Dice