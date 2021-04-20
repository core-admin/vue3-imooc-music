export const addClass = (el, className) => {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export const removeClass = (el, className) => {
  el.classList.remove(className)
}
