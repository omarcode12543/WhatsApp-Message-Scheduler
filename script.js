const phone = document.getElementById("phone");
const message = document.getElementById("message");
const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const btn = document.getElementById("btn");
const output = document.getElementById("output");

function setStatus(text) {
  output.textContent = text;
}

btn.addEventListener("click", async () => {
  btn.disabled = true;
  setStatus("Sending to Python server...");

  const payload = {
    phone: phone.value,
    message: message.value,
    hour: hour.value,
    minute: minute.value,
  };

  try {
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Safely parse response (avoid JSON crash)
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server did not return JSON. Raw response:\n" + text);
    }

    if (!res.ok || !data.ok) {
      setStatus("Error: " + (data.error || "Unknown error"));
    } else {
      setStatus(
        "Success: " + data.status +
        "\n\nNext:\n- Watch your browser (WhatsApp Web will open)\n- Make sure you are logged in\n- Keep PC awake until it sends"
      );
    }
  } catch (e) {
    setStatus("Network/Server error: " + e.message);
  } finally {
    btn.disabled = false;
  }
});
