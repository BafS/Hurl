function getContentFromUrl() {
    var b64Url = window.location.hash
        .replace('#edit:', '#')
        .substr(1)
        .replace(/_/g, '/')
    var binaryString = atob(b64Url)
    if (binaryString) {
        return pako.inflate(binaryString, { to: 'string' })
    }
    return '';
}

function hashChanged() {
    var content = document.querySelectorAll('.content')[0]

    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true
    });

    content.innerHTML = marked(getContentFromUrl())
}

if (window.location.hash) {
    hashChanged()
}

window.onhashchange = hashChanged

if (!window.location.hash || window.location.hash.substr(0, 6) === '#edit:') {
    var editorPanelEl = document.querySelectorAll('.editor-panel')[0];
    var submitEl = document.querySelectorAll('#submit')[0];
    var editorEl = document.querySelectorAll('#editor')[0];
    var resultUrlEl = document.querySelectorAll('#url-result')[0];

    editorPanelEl.style.display = 'block'

    if (window.location.hash.substr(0, 6) === '#edit:') {
        editorEl.value = getContentFromUrl()
    }

    submitEl.addEventListener('click', function (e) {
        var binaryString = pako.deflate(editorEl.value, { to: 'string' })

        var b64 = window.btoa(binaryString)

        var fullUrl = window.location.origin + '#' + b64.replace(/\//g, '_')

        window.location.href = fullUrl
        window.location.reload()
    })
}