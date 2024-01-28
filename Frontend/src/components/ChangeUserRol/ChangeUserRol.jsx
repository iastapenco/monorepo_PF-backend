import { useRef } from "react";

const ChangeUserRol = ({ dataUser }) => {
  const formRef = useRef(null);
  let { first_name, last_name, email, age, password, _id } = dataUser;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datForm = new FormData(formRef.current);
    const dataForm = Object.fromEntries(datForm);
    const rol = dataForm.rol;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwtCookie="))
      .split("=")[1];

    const dataToSend = {
      first_name,
      last_name,
      age,
      email,
      password,
      rol,
    };

    const response = await fetch(
      `https://appcoffee-deploy1.onrender.com/api/users/${_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      }
    );
    if (response.status == 200) window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <select
        name="rol"
        class="form-select"
        aria-label="Default select example"
      >
        <option selected>Seleccione un rol</option>
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
      <button type="submit" class="btn btn-primary mt-3">
        Enviar
      </button>
    </form>
  );
};

export default ChangeUserRol;
