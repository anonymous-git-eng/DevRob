document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const successAlert = document.getElementById("successAlert");
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault(); // Stop page reload
      successAlert.classList.add("d-none");

      // Check Bootstrap client-side validation
      if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add("was-validated");
        return;
      }

      form.classList.add("was-validated");

      // Change button state during processing
      submitBtn.disabled = true;
      submitBtn.innerText = "Sending via Gmail...";

      // Map template variables to form input values
      const templateParams = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      };

      // Send through EmailJS using your IDs
      emailjs
        .send("service_qy5ut6o", "template_i0z7xjj", templateParams)
        .then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);

            // Show success UI alert
            successAlert.classList.remove("d-none");
            form.reset();
            form.classList.remove("was-validated");
          },
          function (error) {
            console.error("FAILED...", error);
            alert(
              "Failed to send message. Please check your EmailJS configuration.",
            );
          },
        )
        .finally(() => {
          // Restore button state
          submitBtn.disabled = false;
          submitBtn.innerText = "Send Message";
        });
    },
    false,
  );
});
