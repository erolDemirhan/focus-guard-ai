import { isOffTopic } from './utils/aiCheck.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PAGE_CONTENT") {
    const pageText = message.text;
    const currentUrl = message.url;
    console.log("📨 İçerik alındı:", pageText.slice(0, 100));
    console.log("🌐 URL:", currentUrl);

    chrome.storage.local.get(["focusTopics"], async (result) => {
      const focusTopics = result.focusTopics || "";
      console.log("📚 Kullanıcının odak konuları:", focusTopics);

      const isIrrelevant = await isOffTopic(pageText, focusTopics);

      if (isIrrelevant) {
        console.log("⚠️ Odak dışı içerik tespit edildi. Kapatma uyarısı gönderiliyor.");
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "CLOSE_TAB_ALERT"
        });
      } else {
        console.log("✅ İçerik odakla ilgili, müdahale edilmedi.");
      }
    });
  }

  if (message.type === "CLOSE_THIS_TAB") {
    chrome.tabs.remove(sender.tab.id);
  }
});
