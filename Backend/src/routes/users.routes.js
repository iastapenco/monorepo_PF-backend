import { Router } from "express";
import crypto from "crypto";
import { sendRecoveryMail } from "../config/nodemailer.js";
import UserManager from "../dao/managers_mongo/userManagerMongo.js";
import multer from "multer";
import nodemailer from "nodemailer";
import { passportError, authorization } from "../utils/messagesError.js";

const userRouter = Router();
const recoveryLinks = {};
const userManager = new UserManager();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/documents");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

userRouter.post("/password-recovery", (req, res) => {
  const { email } = req.body;

  try {
    const token = crypto.randomBytes(20).toString("hex");

    recoveryLinks[token] = {
      email: email,
      timestamp: Date.now(),
    };

    const recoveryLink = `http://localhost:8080/api/users/reset-password/${token}`;

    sendRecoveryMail(email, recoveryLink);

    res.status(200).send("Correo de recuperación enviado");
  } catch (error) {
    res.status(500).send(`Error al enviar el mail ${error}`);
  }
});

userRouter.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { newPassword, newPassword2 } = req.body;

  try {
    const linkData = recoveryLinks[token];
    if (linkData && Date.now() - linkData.timestamp <= 3600000) {
      const { email } = linkData;

      if (newPassword == newPassword2) {
        delete recoveryLinks[token];

        res.status(200).send("Contraseña modificada correctamente");
      } else {
        res.status(400).send("Las contraseñas deben ser idénticas");
      }
    } else {
      res.status(400).send("Token inválido o expirado");
    }
  } catch (error) {
    res.status(500).send(`Error al modificar contraseña ${error}`);
  }
});

userRouter.get(
  "/userslist",
  passportError("jwt"),
  authorization("admin"),
  async (req, res) => {
    try {
      const users = await userManager.usersList();

      res.status(200).send({ response: "Ok", mensaje: users });
    } catch (error) {
      res.status(400).send({ response: "Error", mensaje: error });
    }
  }
);

userRouter.get("/", async (req, res) => {
  try {
    const users = await userManager.usersList();
    res.status(200).send({ response: "Ok", mensaje: users });
  } catch (error) {
    res.status(400).send({ response: "Error", mensaje: error });
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userManager.findUserById(id);
    if (user) res.status(200).send({ response: "Ok", mensaje: user });
    else res.status(404).send({ response: "Error", mensaje: "User not found" });
  } catch (error) {
    res.status(400).send({ response: "Error", mensaje: error });
  }
});

userRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, email, password, rol } = req.body;
  try {
    const user = await userManager.updateUserById(
      id,
      first_name,
      last_name,
      age,
      email,
      password,
      rol
    );
    if (user)
      res.status(200).send({ response: "Usuario actualizado", mensaje: user });
    else
      res
        .status(404)
        .send({ response: "Error", mensaje: "Usuario no encontrado" });
  } catch (error) {
    res.status(400).send({ response: "Error", mensaje: error });
  }
});

userRouter.delete(
  "/",
  passportError("jwt"),
  authorization("admin"),
  async (req, res) => {
    const now = Date.now();

    const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;

    const usersToDelete = await userManager.findUserByLastConnection(
      twoDaysAgo
    );
    try {
      if (usersToDelete.length > 0) {
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "profematetoledo2@gmail.com",
            pass: process.env.PASSWORD_EMAIL,
            authMethod: "LOGIN",
          },
        });

        for (const user of usersToDelete) {
          let mailOptions = {
            from: "profematetoledo2@gmail.com",
            to: user.email,
            subject: "Su cuenta fue eliminada",
            text: "Su cuenta fue eliminada por inactividad",
          };

          try {
            await transporter.sendMail(mailOptions);
            await userManager.deleteUserById(user._id);
          } catch (error) {
            console.error(
              `Error al eliminar el usuario con _id: ${user._id}`,
              error
            );
          }
        }
        res.status(200).send("Usuarios eliminados correctamente");
      } else {
        res.status(404).send("no hay usuarios para eliminar");
      }
    } catch (error) {
      res.status(400).send({ mensaje: error });
    }
  }
);

userRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const respuesta = await userManager.deleteUserById(id);
    if (respuesta)
      res.status(200).send({
        response: "Ok",
        mensaje: "Usuario eliminado",
        usuarios: respuesta,
      });
    else res.status(404).send({ response: "Error", mensaje: "User not found" });
  } catch (error) {
    res.status(400).send({ response: "Error", mensaje: error });
  }
});

userRouter.post(
  "/:uid/documents",
  async (req, res, next) => {
    const { uid } = req.params;
    try {
      const user = await userManager.findUserById(uid);
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).send({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  upload.single("document"),
  async (req, res) => {
    if (req.file) {
      req.user.documents.push({
        name_doc: `${req.user.first_name}  ${req.user.last_name}`,
        reference: `src/public/documents/${req.file.filename}`,
      });
      await req.user.save();
      console.log(req.user);
      console.log(req.file);
      res.status(200).send("Documento cargado");
    } else {
      res.status(400).send({ error: "Debe cargar un documento" });
    }
  }
);

export default userRouter;
