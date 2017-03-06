function getUrlB64Content () {
  return window.location.hash
    .replace('#edit:', '#')
    .substr(1)
    .replace(/_/g, '/')
}

function getUrlContent () {
  var binaryString = atob(getUrlB64Content())
  if (binaryString) {
    return pako.inflate(binaryString, {to: 'string'})
  }
  return ''
}

function loadEditor () {
  var submitEl = document.querySelectorAll('#submit')[0]

  editorPanelEl.style.display = 'block'

  if (window.location.hash.substr(0, 6) === '#edit:') {
    simplemde.value(getUrlContent())
  }

  submitEl.addEventListener('click', function () {
    var binaryString = pako.deflate(simplemde.value(), {to: 'string'})

    var b64 = window.btoa(binaryString)

    var fullUrl = window.location.href.split('#')[0] + '#' + b64.replace(/\//g, '_')

    window.location = fullUrl
  })
}

function hideEditor () {
  editorPanelEl.style.display = 'none'
}

function loadContent () {
  contentPanelEl.style.display = 'block'
  var content = document.querySelectorAll('.content')[0]

  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true
  })

  content.innerHTML = marked(getUrlContent())

  var editEl = document.querySelectorAll('.edit-link')[0]
  editEl.addEventListener('click', function (e) {
    e.preventDefault()
    var fullUrl = window.location.href.split('#')[0] + '#edit:' + getUrlB64Content().replace(/\//g, '_')

    window.location = fullUrl
  })
}

function hideContent () {
  contentPanelEl.style.display = 'none'
}

function hashChanged () {
  if (window.location.hash.length < 2 || window.location.hash.substr(0, 6) === '#edit:') {
    hideContent()
    loadEditor()
  } else {
    loadContent()
    hideEditor()
  }
}

var simplemde = new SimpleMDE({ 
    element: document.getElementById('editor'),
    autofocus: true,
    spellChecker: false,
    hideIcons: ['guide'],
    showIcons: ['code']
})

var editorPanelEl = document.querySelectorAll('.editor-panel')[0]
var contentPanelEl = document.querySelectorAll('.content-panel')[0]

if (window.location.hash) {
  hashChanged()
} else {
  hideContent()
  loadEditor()
}

window.onhashchange = hashChanged
