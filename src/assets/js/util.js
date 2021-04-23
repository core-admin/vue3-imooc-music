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

export const formatTime = interval => {
  interval = interval | 0
  // 不足两位 往前填充一个0
  const minute = (((interval / 60) | 0) + '').padStart(2, '0')
  const second = ((interval % 60) + '').padStart(2, '0')
  return `${minute}:${second}`
}
