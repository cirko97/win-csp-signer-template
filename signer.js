const edge = require("edge-js");
const fs = require("fs");

console.error("Native host started");

const getCertificates = edge.func({
  source: fs.readFileSync("cert-utils.csx", "utf8"),
  references: ["System.dll"]
});

let buffer = Buffer.alloc(0);

function sendMessage(msgObj) {
  const msgStr = JSON.stringify(msgObj);
  const msgBuffer = Buffer.from(msgStr, "utf8");
  const lenBuffer = Buffer.alloc(4);
  lenBuffer.writeUInt32LE(msgBuffer.length, 0);
  process.stdout.write(lenBuffer);
  process.stdout.write(msgBuffer);
  console.error("Sent message:", msgStr);
}

process.stdin.on("readable", () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    buffer = Buffer.concat([buffer, chunk]);

    while (buffer.length >= 4) {
      const msgLength = buffer.readUInt32LE(0);

      if (buffer.length < msgLength + 4) {
        // Wait for more data
        break;
      }

      const msgBuffer = buffer.slice(4, 4 + msgLength);
      const msgStr = msgBuffer.toString("utf8");

      try {
        const message = JSON.parse(msgStr);
        console.error("Received message:", message);

        if (message.command === "getCertificates") {
          getCertificates(null, (error, result) => {
            if (error) {
              console.error("Error fetching certs:", error);
              sendMessage({ error: error.toString() });
            } else {
              sendMessage(result);
            }
          });
        } else {
          sendMessage({ error: "Unknown command" });
        }
      } catch (err) {
        console.error("Error parsing message:", err);
        sendMessage({ error: "Invalid JSON message" });
      }

      buffer = buffer.slice(4 + msgLength);
    }
  }
});
