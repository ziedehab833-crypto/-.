const express = require("express");
const http = require("http");
const { ExpressPeerServer } = require("peer");

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT || 10000);

app.get("/", (_req, res) => {
  res.type("text").send("Autobus Complete PeerJS signaling server is running.");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "autobus-peerjs" });
});

// PeerJS signaling endpoint: https://YOUR-DOMAIN/peerjs
const peerServer = ExpressPeerServer(server, {
  path: "/",
  proxied: true,
  allow_discovery: false,
  alive_timeout: 60000,
  expire_timeout: 5000
});

app.use("/peerjs", peerServer);

peerServer.on("connection", client => {
  console.log("Peer connected:", client.getId());
});
peerServer.on("disconnect", client => {
  console.log("Peer disconnected:", client.getId());
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Autobus PeerJS server listening on ${PORT}`);
});
