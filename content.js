// Sayfa içeriğini al
const pageText = document.body.innerText || "";

// Arka plana mesaj gönder
chrome.runtime.sendMessage({
  type: "PAGE_CONTENT",
  text: pageText,
  url: window.location.href
});

// Arka plandan gelen uyarıyı dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CLOSE_TAB_ALERT") {
    console.log("⚠️ Uyarı: Odak dışı içerik algılandı. Sekme 3 saniye içinde kapanacak.");
    alert("Odak dışı bir içeriktesiniz. Bu sekme 3 saniye içinde kapanacak.");

    setTimeout(() => {
      chrome.runtime.sendMessage({ type: "CLOSE_THIS_TAB" });
    }, 3000);
  }
});
