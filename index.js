const express = require("express");
const axios = require("axios");
const app = express();

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

app.get("/kanal", async (req, res) => {
  const id = req.query.id;
  let targetUrl = "";
  let regex = /https:\/\/[^"]+playlist\.m3u8[^"]+/;

  if (id === "cnnturk") targetUrl = "https://www.cnnturk.com/canli-yayin";
  else if (id === "kanald") { targetUrl = "https://www.kanald.com.tr/canli-yayin"; regex = /https:\/\/[^"]+kanald_1080p\.m3u8[^"]+/; }
  else if (id === "showtv") { targetUrl = "https://www.showtv.com.tr/canli-yayin"; regex = /https:\/\/[^"]+showtv_1080p\.m3u8[^"]+/; }
  else if (id === "startv") { targetUrl = "https://www.startv.com.tr/canli-yayin"; regex = /https:\/\/[^"]+startv_720p\.m3u8[^"]+/; }

  try {
    const response = await axios.get(targetUrl, { headers: { "User-Agent": userAgent } });
    const match = response.data.match(regex);
    if (match) res.redirect(match[0]);
    else res.status(404).send("Yayın linki bulunamadı");
  } catch (e) {
    res.status(500).send("Sunucu hatası");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy hazır!"));
