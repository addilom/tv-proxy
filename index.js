const express = require("express");
const axios = require("axios");
const app = express();

app.get("/kanal", async (req, res) => {
  const { id } = req.query;
  let targetUrl = "";

  if (id === "cnnturk") targetUrl = "https://www.cnnturk.com/canli-yayin";
  else if (id === "kanald") targetUrl = "https://www.kanald.com.tr/canli-yayin";
  else if (id === "showtv") targetUrl = "https://www.showtv.com.tr/canli-yayin";
  else if (id === "startv") targetUrl = "https://www.startv.com.tr/canli-yayin";

  try {
    const response = await axios.get(targetUrl, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': targetUrl,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 8000 
    });
    
    const html = response.data;
    // Link yakalama mantığını genişletiyoruz
    const regex = /(https?:\/\/[^"']+\.m3u8[^"']*)/;
    const match = html.match(regex);

    if (match && match[0]) {
      let finalUrl = match[0].replace(/\\/g, ''); 
      res.redirect(finalUrl);
    } else {
      res.status(404).send(`${id} kanalı için m3u8 linki sayfa içinde bulunamadı.`);
    }
  } catch (e) {
    if (e.response && e.response.status === 403) {
      res.status(403).send("Kanal sitesi erişimi reddetti (403 Forbidden). Farklı bir yöntem denenmeli.");
    } else {
      res.status(500).send("Hata: " + e.message);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy çalışıyor..."));
