import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

const ttsProxyPlugin = (): Plugin => ({
  name: "tts-proxy-middleware",
  configureServer(server) {
    server.middlewares.use("/api/tts", async (req, res) => {
      try {
        const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
        const text = url.searchParams.get("text") || "";
        const lang = url.searchParams.get("lang") || "te";

        if (!text) {
          res.statusCode = 400;
          res.end("Missing text");
          return;
        }

        const ttsLang = lang === "pa" ? "pa" : lang;
        const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(ttsLang)}&q=${encodeURIComponent(text.slice(0, 200))}`;

        const response = await fetch(googleTtsUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Referer: "https://translate.google.com/",
          },
        });

        if (!response.ok) {
          res.statusCode = response.status;
          res.end("TTS Fetch Failed");
          return;
        }

        const arrayBuffer = await response.arrayBuffer();
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(Buffer.from(arrayBuffer));
      } catch (err) {
        console.error("TTS Middleware Error:", err);
        res.statusCode = 500;
        res.end("Internal TTS Error");
      }
    });
  },
});

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: {
      host: true, // Listens on 0.0.0.0 (all network interfaces)
      port: 8080,
      allowedHosts: true, // Allows any domain / tunnel from different Wi-Fi networks
    },
    plugins: [ttsProxyPlugin()],
  },
});
