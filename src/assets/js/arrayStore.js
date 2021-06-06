import storage from 'good-storage'

const insertArray = (arr, val, compare, maxLen) => {
  if (compare && typeof compare === 'function') {
    const index = arr.findIndex(compare)
    if (index === 0) return

    if (index > 0) {
      arr.splice(index, 1)
    }

    arr.unshift(val)
  } else {
    arr.unshift(val)
  }

  // 最多存储maxLen条
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

const deleteFromArray = (arr, compare) => {
  if (compare && typeof compare === 'function') {
    const index = arr.findIndex(compare)
    if (index > -1) {
      arr.splice(index, 1)
    }
  }
}

export const save = (key, item, compare, maxLen) => {
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export const remove = (key, compare) => {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key) {
  return storage.get(key, [])
}

export function clear(key) {
  storage.remove(key)
  return []
}

export function saveAll(key, items) {
  storage.set(key, items)
}
