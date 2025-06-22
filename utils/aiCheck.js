const API_KEY = "api_key_goes_here";

function normalize(text) {
  return text
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("â", "a")
    .trim();
}

export async function isOffTopic(pageText, focusTopics) {
  try {
    const prompt = `
Kullanıcının odaklanmak istediği konular: ${focusTopics}

Aşağıdaki içerik, bu konularla ilgili mi? 
Sadece ve sadece büyük harflerle ilgiliyse "EVET" ya da ilgili değilse "HAYIR" şeklinde yanıt ver.

---
${pageText.slice(0, 1000)} 
`;

    console.log("🔍 Gönderilen prompt:", prompt);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Sen bir içerik filtreleyicisin." },
          { role: "user", content: prompt }
        ],
        temperature: 0.0
      })
    });

    const data = await response.json();

    if (data?.error?.code === "insufficient_quota") {
      console.error("❌ OpenAI QUOTA BİTTİ:", data.error.message);
      return false;
    }

    let reply = data?.choices?.[0]?.message?.content;
    if (!reply || typeof reply !== "string") {
      console.error("🚨 GPT'den anlamlı yanıt alınamadı. Gelen veri:", data);
      return false;
    }

    reply = normalize(reply);
    console.log("🤖 AI'dan gelen normalize edilmiş yanıt:", reply);

    const result = reply.includes("hayir"); // hem "hayır" hem "hayir" kapsanır
    console.log("🎯 Odak dışı mı?:", result);
    return result;

  } catch (error) {
    console.error("AI kontrolü başarısız:", error);
    return false;
  }
}
