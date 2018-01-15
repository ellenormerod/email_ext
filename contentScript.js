let moreInfo = {
  "title": document.title,
  "selection": window.getSelection().toString()
}

chrome.runtime.connect().postMessage(moreInfo)