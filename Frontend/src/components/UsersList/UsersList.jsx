import { useState, useEffect } from "react";
import ChangeUserRol from "../ChangeUserRol/ChangeUserRol";

const UsersList = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwtCookie="))
      .split("=")[1];

    fetch("https://appcoffee-deploy1.onrender.com/api/users/userslist", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className="container">
      {users &&
        users.mensaje &&
        Array.isArray(users.mensaje) &&
        users.mensaje.map((user) => {
          return (
            <ul key={user._id} className="list-group">
              <li className="list-group-item">
                Usuario: {user.first_name} {user.last_name}
              </li>
              <li className="list-group-item">Email: {user.email}</li>
              <li className="list-group-item">Rol: {user.rol}</li>
              <ChangeUserRol dataUser={user} />
            </ul>
          );
        })}
    </div>
  );
};

export default UsersList;
