import { useState } from "react";
import UsersList from "../UsersList/UsersList";
import DeleteUsers from "../DeleteUsers/DeleteUsers";
import "./admin_view.css";

const AdminView = () => {
  const user = JSON.parse(localStorage.getItem("dataUser"));
  const [showUsersList, setShowUsersList] = useState(false);
  const [showDeleteUsers, setShowDeleteUsers] = useState(false);

  const toggleUsersList = () => {
    setShowUsersList(!showUsersList);
  };

  const toggleDeleteUsers = () => {
    setShowDeleteUsers(!showDeleteUsers);
  };

  if (user && user.rol === "admin") {
    return (
      <>
        <button className="btn btn-primary m-3" onClick={toggleUsersList}>
          {showUsersList ? "Ocultar usuarios" : "ver usuarios"}
        </button>
        {showUsersList && <UsersList />}
        <button className="btn btn-danger m-3" onClick={toggleDeleteUsers}>
          Borrar usuarios con más de 2 días de la última conexión
        </button>
        {showDeleteUsers && <DeleteUsers />}
      </>
    );
  }

  return (
    <>
      <h2>Usted no tiene los permisos necesarios para acceder</h2>
    </>
  );
};

export default AdminView;
