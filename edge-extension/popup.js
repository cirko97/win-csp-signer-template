document.getElementById("load").onclick = () => {
  console.log("Sending getCertificates message");
  chrome.runtime.sendMessage({ command: "getCertificates" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Runtime error:", chrome.runtime.lastError.message);
      document.getElementById("result").textContent = "Error: " + chrome.runtime.lastError.message;
      return;
    }
    console.log("Response received in popup:", response);
    document.getElementById("result").textContent = JSON.stringify(response, null, 2);
  });
};
