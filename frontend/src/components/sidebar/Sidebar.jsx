import "./sidebar.css";
import {
  LineStyle,
  VisibilityOutlined,
  HelpOutline,
  PermIdentity,
  DynamicFeed,
  WorkOutline,
  Report,
  PersonAddOutlined,
  Settings,
  PersonOutlineOutlined,
  ExitToApp,
  AlternateEmail
} from "@material-ui/icons";

import { Link, useHistory } from "react-router-dom";
import MessageModal from "../../components/modals/MessageModal";
import React, { useState } from "react";

const API = process.env.REACT_APP_SWEETSDB_API;

// Raldys
// Function that manages the elements from the sidebar
// Returns the respective components for rendering the sidebar
export default function Sidebar() {

  // Variables to handle errors with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const history = useHistory();

  // Function that manages the logout
  const logout = async () => {
    try {
      const res = await fetch(API + "/logout2", { // Logout route
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        localStorage.clear(); // Reset local storage
        console.log("Sesion Terminada");
        history.push("/login"); // Redirects the user to the login page
      }
    } catch (err) {
      let temp = true;
      if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
        console.log(err);
        setError(true);
        setMessageTitle("Error");
        setMessage("¡No se ha podido comunicar con el servidor!");
        handleShow();
        await window.scrollTo(0, 0);
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li className="sidebarListItem active">
                <LineStyle className="sidebarIcon" />
                Pagina Principal
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Usuarios</h3>
          <ul className="sidebarList">
            <Link to="/user_options" className="link">
              <li className="sidebarListItem">
                <PersonOutlineOutlined className="sidebarIcon" />
                Opciones de Usuarios
              </li>
            </Link>
            <Link to="/create_users" className="link">
              <li className="sidebarListItem">
                <PersonAddOutlined className="sidebarIcon" />
                Crear Usuarios
              </li>
            </Link>
            <Link to="/manage_users" className="link">
              <li className="sidebarListItem">
                <Settings className="sidebarIcon" />
                Manejar Usuarios
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Órdenes</h3>
          <ul className="sidebarList">
            <Link to="/order_options" className="link">
              <li className="sidebarListItem">
                <VisibilityOutlined className="sidebarIcon" />
                Opciones de Órdenes
              </li>
            </Link>
            <Link to="/create_orders" className="link">
              <li className="sidebarListItem">
                <WorkOutline className="sidebarIcon" />
                Crear Órdenes
              </li>
            </Link>
            <Link to="/manage_orders" className="link">
              <li className="sidebarListItem">
                <DynamicFeed className="sidebarIcon" />
                Manejar Órdenes
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Menú de Dulces</h3>
          <ul className="sidebarList">
            <Link to="/sweet_options" className="link">
              <li className="sidebarListItem">
                <VisibilityOutlined className="sidebarIcon" />
                Opciones de Dulces
              </li>
            </Link>
            <Link to="/create_sweets" className="link">
              <li className="sidebarListItem">
                <WorkOutline className="sidebarIcon" />
                Crear Dulces
              </li>
            </Link>
            <Link to="/manage_sweets" className="link">
              <li className="sidebarListItem">
                <DynamicFeed className="sidebarIcon" />
                Manejar Dulces
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Menú de Bizcochos</h3>
          <ul className="sidebarList">
            <Link to="/cake_options" className="link">
              <li className="sidebarListItem">
                <VisibilityOutlined className="sidebarIcon" />
                Opciones de Bizcochos
              </li>
            </Link>
            <Link to="/create_cakes" className="link">
              <li className="sidebarListItem">
                <WorkOutline className="sidebarIcon" />
                Crear Bizcochos
              </li>
            </Link>
            <Link to="/manage_cakes" className="link">
              <li className="sidebarListItem">
                <DynamicFeed className="sidebarIcon" />
                Manejar Bizcochos
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Ayuda</h3>
          <ul className="sidebarList">
            <Link to="/tutorial" className="link">
              <li className="sidebarListItem">
                <HelpOutline className="sidebarIcon" />
                Tutorial
              </li>
            </Link>
            <Link to="/contact" className="link">
              <li className="sidebarListItem">
                <AlternateEmail className="sidebarIcon" />
                Contacto
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Sesión</h3>
          <ul className="sidebarList">
            <Link onClick={logout} to="/" className="link">
              <li className="sidebarListItem">
                <ExitToApp className="sidebarIcon" />
                Cerrar Sesión
              </li>
            </Link>
          </ul>
        </div>
      </div>
      {/* Popups for Errors and Confirmations */}
      {error && (
        <MessageModal
          show={showModal}
          onClose={handleClose}
          title={messageTitle}
          message={message}
          onHide={handleClose}
        />
      )}
    </div>
  );
}
