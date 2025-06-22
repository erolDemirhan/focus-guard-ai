document.getElementById('saveBtn').addEventListener('click', () => {
  const topics = document.getElementById('focusTopics').value;
  chrome.storage.local.set({ focusTopics: topics }, () => {
    document.getElementById('status').innerText = "✅ Kaydedildi!";
    setTimeout(() => {
      document.getElementById('status').innerText = "";
    }, 2000);
  });
});
