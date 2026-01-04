const express = require("express");
const axios = require("axios");
const app = express();

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

app.get("/kanal", async (req, res) => {
  const { id } = req.query;
  let targetUrl = "";

  if (id === "cnnturk") targetUrl = "https://www.cnnturk.com/canli-yayin";
  else if (id === "kanald") targetUrl = "https://www.kanald.com.tr/canli-yayin";
  else if (id === "showtv") targetUrl = "https://www.showtv.com.tr/canli-yayin";
  else if (id === "startv") targetUrl = "https://www.startv.com.tr/canli-yayin";

  try {
    const response = await axios.get(targetUrl, { 
      headers: { "User-Agent": userAgent },
      timeout: 5000 
    });
    
    // Daha geniş kapsamlı bir arama yapıyoruz
    const html = response.data;
    const regex = /(https?:\/\/[^"']+\.m3u8[^"']*)/;
    const match = html.match(regex);

    if (match && match[0]) {
      // Bulunan linkin içinde gereksiz karakterleri temizle
      let finalUrl = match[0].replace(/\\/g, ''); 
      res.redirect(finalUrl);
    } else {
      res.status(404).send(`${id} için yayın linki bulunamadı. Kaynak kodunu kontrol edin.`);
    }
  } catch (e) {
    res.status(500).send("Hata: " + e.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy aktif!"));
