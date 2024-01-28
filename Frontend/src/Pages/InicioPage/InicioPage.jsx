import { useState, useEffect } from "react";
import Products from "../../components/Products/Products";
import ListItemContainer from "../../components/ListItemContainer/ListItemContainer";
import Spinner from "../../components/Spinner/Spinner";
import LoginAndRegister from "../../components/LoginAndRegister/LoginAndRegister";
import AdminView from "../../components/AdminView/AdminView";
import "./inicio.css";

function InicioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("dataUser"));

  if (!user) {
    return (
      <>
        <LoginAndRegister />
        <Products />
      </>
    );
  }
  return (
    <>
      {user && user.rol && user.rol !== "admin" ? (
        <>
          <LoginAndRegister />
          <ListItemContainer />
          <Products />
        </>
      ) : (
        <>
          <LoginAndRegister />
          <ListItemContainer />
          <AdminView />
        </>
      )}
    </>
  );
}

export default InicioPage;
