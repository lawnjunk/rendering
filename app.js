let dom = {}
let ammount = 1000
// util
let hash = () => btoa(Date.now() + ':' +  Math.random())

// strings
let lower = (text) => text.toLowerCase()
let upper = (text) => text.toUpperCase()
let substr = (start, count) => (text) => text.substr(start, count)
let split = (delimiter) => (text) => text.split(delimiter)

let padLeft = (ch, count) => (text) => {
  let data = split('')(text)
  for(let i=text.length; i<count; i++)
    data.unshift(ch)
  return data.slice(0, count).join('')
}

let padRight = (ch, count) => (text) => {
  let data = split('')(text)
  for(let i=text.length; i<count; i++)
    data.push(ch)
  return data.slice(0, count).join('')
}

// number
let limit = (min, max) => (num) => Math.min(max, Math.max(min, num))
let decimalToHex = (num) => num.toString(16)
let hexToDecimal = (hex) => parseInt(hex, 16)
let toHexByte = (value) => {
  value = typeof value === 'number' ? decimalToHex(value) : value
  return padLeft('0', 2)(value)
}
// functions
let compose = (...fns) => (arg) => fns.reduce((r, fn) => fn(r), arg)
let partial = (fn, ...defalts) => (...args) => fn(...defaults, ...args)
let partialRight = (fn, ...defalts) => (...args) => fn(...args, ...defaults)

// collections
let concat = (...B) => (A) => Array.prototype.concat.call(A, ...B)
let each = (cb) => (collection) => Array.prototype.forEach.call(collection, cb)
let map = (cb) => (collection) => Array.prototype.map.call(collection, cb)
let filter = (cb) => (collection) => Array.prototype.filter.call(collection, cb)
let reduce = (cb) => (collection) => Array.prototype.reduce.call(collection, cb)
let flatMap = (cb) => compose(reduce((r, i) => concat(i)(r)), map(cb))
let join = (text) => (collection) => Array.prototype.map.call(collection, text)
  

// nodes
let find = (id) => document.getElementById(id)
let query = (query) => (node) => node.querySelectorAll(query)
let queryOne = (query) => (node) => node.querySelector(query)
let append = (...nodes) => (node) => node.append(...nodes)
let prepend = (...nodes) => (node) => node.prepend(...nodes)
let appendChildren = (nodes) => (node) => node.append(...nodes)
let prependChildren = (nodes) => (node) => node.prepend(...nodes)
let remove = (...nodes) => (node) => node.remove(...nodes)
let el = (template) => {
  let tmp = document.createElement('div')
  tmp.innerHTML = template
  return tmp.firstElementChild
}

let emitSubscribers = each(cb => cb())
let state = (() => {
  let data = new Array(ammount).fill(0)
  let subscribers = []
  return {
    set: (value) => (index) => {
      data[limit(0, data.length -1)(index)] = value.toString(16)
      emitSubscribers(subscribers)
    },
    get: () => data,
    subscribe: (cb) => {
      subscribers.push(cb)
    },
  }
})()

// render nodes
let createNode = (num, i) => el(`<p id='item-${i}' class='item'> ${num} </p>`)
let children = map(createNode)(state.get())
appendChildren(children)(document.body)

// slow
//setInterval(() => {
  //console.time('boom')
  //for(let i=0; i<ammount; i++){
    ////children = map(createNode)(map(() => Math.floor(Math.random() * 256))(state.get()))
    //document.body.textContent = ''
    //appendChildren(children)(document.body)
  //}
  //console.timeEnd('boom')
//}, 0)


let rand255 = () => Math.floor(Math.random() * 255) 
let randColor = () => `rgb(${rand255()},${rand255()},${rand255()})`

// fast
go = () => {
    console.time('boom')
      let i = Math.floor(Math.random() * ammount)
      children[i].textContent = decimalToHex(rand255())
      children[i].style.background = randColor()
      children[i].style.transform = `scale(${Math.random()})`
    console.timeEnd('boom')
    trampolinego()
}

go()

//let wat = 0
//setInterval(() => {
  //if(wat % 1000 === 0){
    //console.timeEnd('boom')
    //console.time('boom')
  //}

  //wat++
  //let i = Math.floor(Math.random() * ammount)
  //children[i].textContent = decimalToHex(rand255())
  //children[i].style.background = randColor()
  //children[i].style.transform = `scale(${Math.random()})`
//}, 0)

let trampoline = (fn) => (...args) => {
  let next = fn(...args)
  while(next instanceof Function) 
    next = next()
  return next
}

let range = (start, end, result=[]) => {
  result.push(start)
  if(start === end) return result
  return () => range(start < end ? ++start : --start, end, result)
}

let result = trampoline(range)(5, 1)
