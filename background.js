
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