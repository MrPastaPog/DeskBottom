function InsertItemToIndex(array, firstIndex, secondIndex) {
  console.log(array)
  let value = array[firstIndex]
  array.splice(firstIndex, 1)
  array.splice(secondIndex, 0, value)
  return array
}
export default InsertItemToIndex