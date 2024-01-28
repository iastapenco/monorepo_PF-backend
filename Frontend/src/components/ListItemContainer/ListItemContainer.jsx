import React from "react";
import "./list_item_container.css";

const ListItemContainer = () => {
  const user = JSON.parse(localStorage.getItem("dataUser"));

  if (user) {
    if (user.rol === "admin") {
      return (
        <>
          <h2 className="saludos">
            {`Bienvenido administrador ${user.first_name} ${user.last_name}`}
          </h2>
        </>
      );
    } else {
      return (
        <>
          <h2 className="saludos">
            {`Bienvenido ${user.first_name} ${user.last_name} a nuestro coffee shop online!`}
          </h2>
        </>
      );
    }
  } else null;
};

export default ListItemContainer;
