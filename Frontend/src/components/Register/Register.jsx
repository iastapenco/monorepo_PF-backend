import React from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const formRef = useRef(null);
  const loginNavigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formRef.current));

    const response = await fetch(
      "https://appcoffee-deploy1.onrender.com/api/sessions/register",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.status == 200) {
      loginNavigate("/login");
    } else {
      new Error("Error al registrar usuario");
    }
  };

  return (
    <div>
      <h2>Registro de usuario</h2>

      <form id="register_form" onSubmit={handleSubmit} ref={formRef}>
        <div class="mb-3">
          <label htmlFor="first_name" class="form-label">
            Nombre
          </label>
          <input
            type="string"
            class="form-control"
            id="first_name"
            name="first_name"
            placeholder="Nombre"
          />
        </div>
        <div class="mb-3">
          <label htmlFor="last_name" class="form-label">
            Nombre
          </label>
          <input
            type="string"
            class="form-control"
            id="last_name"
            name="last_name"
            placeholder="Apellido"
          />
        </div>
        <div class="mb-3">
          <label htmlFor="inputEmail" class="form-label">
            email:
          </label>
          <input
            type="email"
            class="form-control"
            id="inputEmail"
            name="email"
            aria-describedby="emailHelp"
            placeholder="example@example.com"
          />
        </div>
        <div class="mb-3">
          <label htmlFor="age" class="form-label">
            Nombre
          </label>
          <input
            type="number"
            class="form-control"
            id="age"
            name="age"
            placeholder="Edad"
          />
        </div>
        <div class="mb-3">
          <label htmlFor="inputPassword" class="form-label">
            Contraseña:
          </label>
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            name="password"
            placeholder="ingresa tu contraseña"
          />
        </div>

        <div class="d-flex flex-column">
          <button
            type="submit"
            class="btn btn-primary btn-lg align-self-center"
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
