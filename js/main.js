const canvas = document.querySelector('canvas'),
  toolsBtn = document.querySelectorAll('.tool'),
  fillColor = document.querySelector('#fill-color'),
  sizeSlider = document.querySelector('#size-slider'),
  colorBtn = document.querySelectorAll('.colors .option'),
  colorPicker = document.querySelector('#color-picker'),
  clearCanvas = document.querySelector('.clear-canvas'),
  saveImage = document.querySelector('.save-img'),
  ctxs = canvas.getContext('2d')

const setCanvasBackground = () => {
  ctxs.fillStyle = '#fff'
  ctxs.fillRect(0, 0, canvas.width, canvas.height)
  ctxs.fillStyle = selectedColor
}
let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = 'brush',
  brushWidth = 5,
  selectedColor = '#000'

window.addEventListener('load', () => {
  canvas.height = canvas.offsetHeight
  canvas.width = canvas.offsetWidth
  setCanvasBackground()
})

let drawRect = (e) => {
  if (fillColor.checked) {
    ctxs.fillRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    )
  }
  ctxs.strokeRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  )
}

let drawCircle = (e) => {
  ctxs.beginPath()
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseX - e.offsetX, 2)
  )
  ctxs.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
  fillColor.checked ? ctxs.fill() : ctxs.stroke()
}

let drawTriangle = (e) => {
  ctxs.beginPath()
  ctxs.moveTo(prevMouseX, prevMouseY)
  ctxs.lineTo(e.offsetX, e.offsetY)
  ctxs.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
  ctxs.closePath()
  ctxs.stroke()
  fillColor.checked ? ctxs.fill() : ctxs.stroke()
}
const startDraw = (e) => {
  isDrawing = true
  prevMouseX = e.offsetX
  prevMouseY = e.offsetY
  ctxs.beginPath() //* Creating new path do draw
  ctxs.lineWidth = brushWidth
  ctxs.strokeStyle = selectedColor
  ctxs.fillStyle = selectedColor
  snapshot = ctxs.getImageData(0, 0, canvas.width, canvas.height)
}

const drawing = (e) => {
  if (isDrawing === false) return
  // if (!isDrawing) return
  ctxs.putImageData(snapshot, 0, 0)
  if (selectedTool === 'brush' || selectedTool === 'eraser') {
    ctxs.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedTool
    ctxs.lineTo(e.offsetX, e.offsetY) //* Creating line according to mouse pointer
    ctxs.stroke() //* Drawing filling line with color
  } else if (selectedTool === 'rectangle') {
    drawRect(e)
  } else if (selectedTool === 'circle') {
    drawCircle(e)
  } else if (selectedTool === 'triangle') {
    drawTriangle(e)
  }
}
toolsBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    //* Remove active class from last element => (mousedown)
    document.querySelector('.options .active').classList.remove('active')
    //* Add active class on clicked element => (mouseup)
    btn.classList.add('active')
    selectedTool = btn.id
    console.log(selectedTool)
  })
})

sizeSlider.addEventListener('change', () => {
  brushWidth = sizeSlider.value
})

colorBtn.forEach((color) => {
  color.addEventListener('click', () => {
    document.querySelector('.options .selected').classList.remove('selected')
    color.classList.add('selected')
    selectedColor = window
      .getComputedStyle(color)
      .getPropertyValue('background-color')
  })
})

colorPicker.addEventListener('change', () => {
  colorPicker.parentElement.style.background = colorPicker.value
  colorPicker.parentElement.click()
})

clearCanvas.addEventListener('click', () => {
  ctxs.clearRect(0, 0, canvas.width, canvas.height)
  setCanvasBackground()
})

saveImage.addEventListener('click', () => {
  const link = document.createElement('a')
  link.download = `${Date.now()}.jpg`
  link.href = canvas.toDataURL()
  link.click()
})

//* Start drawing on hover by mouse
canvas.addEventListener('mousemove', drawing)

//* Start drawing on click mouse
canvas.addEventListener('mousedown', startDraw)

//* Stop drawing
canvas.addEventListener('mouseup', () => {
  isDrawing = false
})
