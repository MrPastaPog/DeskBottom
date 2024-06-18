function ConvertInsetToNum(inset) {
  inset = inset.replace('inset(', '')
  inset = inset.replace(')', '')
  inset = inset.replaceAll('%', '')
  inset = inset.split(" ")
  for(let i = 0; i < inset.length; i++) {
    inset[i] = Number(inset[i])
  }
  return inset
}
 

function ObjectsTouching(element1, element2, element1GridLength, element2GridLength) {
  element1 = document.getElementById(element1); 
  element2 = document.getElementById(element2);
  if (!element1 || !element2) return undefined; 
  const rect1 = element1.getBoundingClientRect(); 
  const rect2 = element2.getBoundingClientRect(); 
  if(element1.style.clipPath.includes('inset')) {
    let inset = ConvertInsetToNum(element1.style.clipPath)  //converts inset string to list of numbers
    rect1.x += inset[3] / 100 * rect1.width
    rect1.y += inset[0] / 100 * rect1.height
    rect1.width = rect1.width / element1GridLength.width
    rect1.height = rect1.height / element1GridLength.height
  }
  if(element2.style.clipPath.includes('inset')) {
    let inset = ConvertInsetToNum(element2.style.clipPath) 
    rect2.x += inset[3] / 100 * rect2.width
    rect2.y += inset[0] / 100 * rect2.height
    rect2.width = rect2.width / element2GridLength.width
    rect2.height = rect2.height / element2GridLength.height
    
  }
  return rect1.x < rect2.x + rect2.width &&  rect1.x + rect1.width > rect2.x &&  rect1.y < rect2.y + rect2.height &&  rect1.y + rect1.height > rect2.y 
}
export default ObjectsTouching