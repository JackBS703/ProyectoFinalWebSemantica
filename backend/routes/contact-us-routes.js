const express = require("express");
const ContactUsModel = require("../models/ContactMessages");

const router = express.Router();

class ContactUsError extends Error {
  constructor(message) {
    super(message);
    this.name = "ContactUsError";
    this.statusCode = 400; // Código de estado HTTP por defecto
  }
}

class ContactUsAgent {
  static validateInput(input) {
    if (input === undefined || input === null) {
      throw new ContactUsError("El mensaje no puede ser nulo o indefinido.");
    }

    if (typeof input !== "object") {
      throw new ContactUsError("El mensaje debe ser un objeto.");
    }

    if (Array.isArray(input)) {
      throw new ContactUsError("El mensaje no puede ser un array.");
    }

    if (Object.keys(input).length === 0) {
      throw new ContactUsError("El mensaje no puede estar vacío.");
    }

    const { fullname, email, message, phoneNumber } = input;

    if (!fullname || !email || !message) {
      const undefinedFields = [];
      if (!fullname) undefinedFields.push("Nombre completo");
      if (!email) undefinedFields.push("Correo electrónico");
      if (!message) undefinedFields.push("Mensaje");
      throw new ContactUsError(
        "Los siguientes campos son obligatorios: " + undefinedFields.join(", ")
      );
    }

    if (message.length > 512) {
      throw new ContactUsError(
        "El mensaje no puede exceder los 512 caracteres."
      );
    }

    if (phoneNumber && !/^\d+$/.test(phoneNumber)) {
      throw new ContactUsError(
        "El número de teléfono debe contener solo dígitos."
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ContactUsError("El correo electrónico no es válido.");
    }

    return {
      fullname,
      email,
      message,
      phoneNumber: phoneNumber || null,
    };
  }

  static async saveMessage(input) {
    const messageData = {
      fullname: input.fullname,
      email: input.email,
      message: input.message,
      phoneNumber: input.phoneNumber || null,
    };

    return await ContactUsModel.create(messageData);
  }
}

router.post("/send-message", async (req, res) => {
  try {
    const validatedInput = ContactUsAgent.validateInput(req.body);
    await ContactUsAgent.saveMessage(validatedInput);

    res
      .status(200)
      .json({ success: true, message: "Mensaje enviado correctamente" });
  } catch (error) {
    if (error instanceof ContactUsError) {
      return res
        .status(error.statusCode)
        .json({ success: false, error: error.message });
    }
    console.error("Error al enviar el mensaje:", error);
    return res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
});

module.exports = router;
