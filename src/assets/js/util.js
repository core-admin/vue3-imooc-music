export const shuffle = source => {
  const arr = source.slice()
  for (let i = 0, len = arr.length; i < len; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

export const getRandomInt = max => {
  return Math.floor(Math.random() * (max + 1))
}

export const swap = (arr, i, j) => {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}
