var gmail = "https://mail.google.com/mail/?extsrc=mailto&url=%s";


//3 this runs next because it was called in step 2. This puts together the message and then creates a new tab to open gmail in
function sendMailto(tab_id, subject, body, selection){
  window.localStorage.mailUrl = gmail;
  let customUrl = window.localStorage.mailUrl
  let sendUrl = "mailto:?"
  if (subject.length > 0) sendUrl += "subject=" + encodeURIComponent(subject) + "&";
  if (body.length > 0) sendUrl += "body=" + encodeURIComponent(body);
  if (selection.length > 0) sendUrl += encodeURIComponent("\n\n") + encodeURIComponent(selection)
  //should open up gmail in separate tab
  sendUrl = customUrl.replace("%s", encodeURIComponent(sendUrl));
  chrome.tabs.create({url: sendUrl})
}

//2 then this runs because it has a listener on connect which comes from contentScript sending the message
chrome.runtime.onConnect.addListener(function(port){
  let tab = port.sender.tab;
  port.onMessage.addListener(function(info){
    if (info.selection.length > 1024) info.selection = info.selection.substring(0, 1024);
    sendMailto(tab.id, info.title, tab.url, info.selection);
  })
})


//1 when icon for chrome extension is clicked this runs first and goes into contentScript.js
chrome.browserAction.onClicked.addListener(function(tab){
  if (tab.url.indexOf('http:') != 0 && tab.url.indexOf('https:') != 0){
    sendMailto(tab.id, "", tab.url, "");
  } else {  
    chrome.tabs.executeScript(null, {file: "contentScript.js"})
  }
})
