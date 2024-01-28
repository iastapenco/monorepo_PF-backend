import React, { useEffect, useState } from "react";

const DeleteUsers = () => {
  const [status, setStatus] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwtCookie="))
      .split("=")[1];
    const deleteUsers = async () => {
      const response = await fetch(
        "https://appcoffee-deploy1.onrender.com/api/users/",
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus(response.status);
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    };

    deleteUsers();
  }, []);

  if (showMessage && status === 200) {
    return (
      <div>
        <h3>
          <strong>Usuarios Eliminados</strong>
        </h3>
      </div>
    );
  } else if (showMessage) {
    return (
      <div>
        <h3>
          <strong>No hay usuarios para eliminar</strong>
        </h3>
      </div>
    );
  }

  return null;
};

export default DeleteUsers;
