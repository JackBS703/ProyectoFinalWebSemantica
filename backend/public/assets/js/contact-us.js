// Contador de caracteres para el textarea
const messageTextarea = document.getElementById("message");
const charCounter = document.getElementById("charCounter");

messageTextarea.addEventListener("input", function () {
  const currentLength = this.value.length;
  const maxLength = 512;

  charCounter.textContent = `${currentLength}/${maxLength}`;

  if (currentLength > maxLength * 0.9) {
    charCounter.classList.add("warning");
  } else {
    charCounter.classList.remove("warning");
  }
});

// Validación del formulario
document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/contact-us/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("Respuesta del servidor:", res);

      if (!res.ok) {
        const errorData = await res.json();
        toastr.error(errorData.error, "Ocurrio un error");
        return;
      }
      toastr.success("Mensaje enviado correctamente", "Éxito");
      this.reset();
      charCounter.textContent = "0/512"; // Reiniciar contador de caracteres
      charCounter.classList.remove("warning"); // Quitar clase de advertencia
      document.querySelector(".form-control").classList.remove("focused"); // Quitar estado enfocado
      document.querySelector(".form-control").blur(); // Quitar foco del input
      document
        .querySelector(".form-control")
        .parentNode.parentNode.classList.remove("focused"); // Quitar clase de enfoque del contenedor
      return;
    } catch (e) {
      console.error("Error al procesar el formulario:", e);
    }
  });

// Efectos adicionales para mejorar la UX
const inputs = document.querySelectorAll(".form-control");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentNode.parentNode.classList.add("focused");
  });

  input.addEventListener("blur", function () {
    this.parentNode.parentNode.classList.remove("focused");
  });
});
