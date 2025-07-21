chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message in background:", request);

  if (request.command === "getCertificates") {
    console.log("Connecting to native host...");
    const port = chrome.runtime.connectNative("com.mycompany.csp_signer");

    port.onMessage.addListener((response) => {
      console.log("Received from native host:", response);
      sendResponse(response); // send response back to popup
      port.disconnect(); // disconnect after response
    });

    port.onDisconnect.addListener(() => {
      if (chrome.runtime.lastError) {
        console.error("Connection failed:", chrome.runtime.lastError.message);
        sendResponse({ error: chrome.runtime.lastError.message }); // send error response
      } else {
        console.log("Disconnected from native host");
      }
    });

    port.postMessage({ command: "getCertificates" });
    return true; // IMPORTANT: keep message channel open for async response
  }
});
