document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      alert(`Thanks for reaching out, ${name}! Your message has been sent.`);
      console.log("Form Submitted Successfully:", { name, email, message });

      contactForm.reset();
    });
  }
});
