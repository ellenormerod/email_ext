function mailUrl(){
  if (window.localStorage == null) return "";
  if (window.localStorage.mailUrl == null) return "";
  console.log('mailUrl', window.localStorage);
  return window.localStorage.mailUrl
}

function sendMailto(tab_id, subject, body, selection){
  let defaultHandler = mailUrl().length == 0;
  console.log('what am i sending', tab_id, subject, body, selection)
  let sendUrl = "mailto:?"
  if (subject.length > 0) sendUrl += "subject=" + encodeURIComponent(subject) + "&";
  if (body.length > 0) sendUrl += "body=" + encodeURIComponent(body);
  if (selection.length > 0) sendUrl += encodeURIComponent("\n\n") + encodeURIComponent(selection)
  if (!defaultHandler){
    //should open up gmail in separate tab
    let customUrl = mailUrl();
    sendUrl = customUrl.replace("%x", encodeURIComponent(sendUrl));
    chrome.tabs.create({url: sendUrl})
    console.log('no default handler')
  } else {
    //don't think i want because opens up in same tab
    chrome.tabs.update(tab_id, {url: sendUrl});
  }
  console.log('final product', sendUrl)
}

chrome.runtime.onConnect.addListener(function(port){
  let tab = port.sender.tab;
  port.onMessage.addListener(function(info){
    console.log('info', info)
    if (info.selection.length > 1024){
      info.selection = info.selection.substring(0, 1024);
      sendMailto(tab.id, info.title, tab.url, info.selection)
    }
  })
})

chrome.browserAction.onClicked.addListener(function(tab){
  if (tab.url.indexOf('http:') != 0 && tab.url.indexOf('https:') != 0){
    sendMailto(tab.id, "", tab.url, "");
  } else {  
    chrome.tabs.executeScript(null, {file: "contentScript.js"})
  }
})

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
let getCurrentTabUrl = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    let activeTab = tabs[0];
    let url = activeTab.url;
    callback(url)
  })
}

let linkToSend
document.addEventListener("DOMContentLoaded", () => {
  getCurrentTabUrl((url) => {
    linkToSend = url;
  })
})

document.getElementById("submit_btn").addEventListener("click", clickFunction)

function clickFunction(){
  emailjs.send("gmail", "chrome_email_ext", {"email":document.getElementById("email_input").value,"to_name":document.getElementById("name_input").value,"message":document.getElementById("message_input").value,"link":linkToSend})
  // window.open(`mailto:${document.getElementById("email_input").value}?subject=Link&body=${linkToSend}`)
}