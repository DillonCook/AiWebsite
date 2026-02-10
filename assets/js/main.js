const leadConfig = {
  webhookUrl: "",
  emailFallback: "mailto:hello@dilloncook.com",
};

const forms = document.querySelectorAll("[data-lead-form]");

forms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    if (status) {
      status.textContent = "Sending...";
    }

    if (leadConfig.webhookUrl) {
      try {
        const response = await fetch(leadConfig.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("Webhook failed");
        }
        if (status) {
          status.textContent = "Submitted! We'll follow up shortly.";
        }
        form.reset();
        return;
      } catch (error) {
        if (status) {
          status.textContent = "Submission failed. Opening email...";
        }
      }
    }

    const subject = encodeURIComponent("New real estate lead");
    const body = encodeURIComponent(
      Object.entries(payload)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    );
    window.location.href = `${leadConfig.emailFallback}?subject=${subject}&body=${body}`;
  });
});
