import "./create_users.css";
import React, { useEffect, useState } from "react";
import MessageModal from "../../components/modals/MessageModal";
import Button from "react-bootstrap/Button";
import { ListGroup, OverlayTrigger, Popover } from "react-bootstrap";

const API = process.env.REACT_APP_SWEETSDB_API;

// Gustavo
// Function that manages the user interface for creating a user
// Returns the respective components for rendering the create user interface
export default function CreateUsers() {
  //Variables to get input from user form
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");
  const [role, set_role] = useState("");

  // Variables to handle errors with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [successfulPost, setSuccessfulPost] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  // Variable to store the users in a list
  const [users, set_users] = useState([]);

  // Variable to set the state of the password
  const [passwordShown, setPasswordShown] = useState(true);

  // Password toggle handler
  const togglePassword = () => {
    // Reverts the passwordShown value
    setPasswordShown(!passwordShown);
  };

  // Function that manages the create user form
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch(API + "/create_users", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role,
        }),
      });

      if (!res.ok) {
        // If the post request is not successful display an error modal
        await res.json().then(function (json) {
          // Handle error when a user is already on the database
          if (json.status === 400) {
            console.log("Error 400");
            setError(true);
            setMessageTitle("Error");
            setMessage(json.message);
            handleShow();
          } else {
            // Handle any other error
            console.log("Otro Error");
            setError(true);
            setMessageTitle("Error");
            setMessage("Ha ocurrido un error.");
            handleShow();
          }
        });
      } else {
        console.log("200- OK Request");
        setSuccessfulPost(true);
        setMessageTitle("Confirmación");
        setMessage("¡El usuario ha sido creado exitosamente!");
        handleShow();
        // Updates the list of users after creating a user
        await getUsers();
        await window.scrollTo(0, 0);

        // Reset the form variables
        set_username("");
        set_password("");
        set_role("");
      }
    } catch (err) { // Handle network errors
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

  // Function that manages the get of all users
  const getUsers = async () => {
    try {
      const res = await fetch(API + "/get_all_users", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_users(data);
      console.log(data);
    } catch (err) { // Handle network errors
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

  // Function to manage pop that displays information for each role
  const popover = (
    <Popover id="popover-basic" className="text-justify">
      <Popover.Header as="h2" className="bg-primary text-white">
        Información de Roles
      </Popover.Header>
      <Popover.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h5>1. Administrador</h5>
            El administrador podrá acceder todas las funcionalidades de la
            página incluyendo el manejo de usuarios, el manejo del menú y el
            manejo de las órdenes.
          </ListGroup.Item>
          <ListGroup.Item>
            <h5>2. Empleado</h5>
            El empleado solo podrá acceder las funcionalidades de la página
            referentes al manejo de las órdenes.
          </ListGroup.Item>
        </ListGroup>
      </Popover.Body>
    </Popover>
  );

  // Function used so that the user get request runs everytime the page laods
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="create_users text-primary container-fluid">
      <div className="row form-container d-flex justify-content-center">
        <div className="col-md-5">
          <h2 className="card-title text-center">Añadir Usuario</h2>
          <form
            onSubmit={handleSubmit}
            className="card card-body border border-3 border-primary"
          >
            <div className="form-group pb-2">
              <label htmlFor="username">Nombre del Usuario</label>
              <input
                type="text"
                onChange={(e) => set_username(e.target.value)}
                value={username}
                className="form-control"
                placeholder="Nombre del Usuario"
                pattern="^[A-zÀ-ú0-9]{1,15}$"
                required={true}
                autoFocus
              />
              <span>
                El nombre de usuario no debe contener símbolos especiales y debe
                contener al menos 1-15 caracteres.
              </span>
            </div>
            <label htmlFor="password">Contraseña del usuario</label>
            <div className="input-group pb-2">
              <button
                className="btn btn-success"
                type="button"
                onClick={togglePassword}
              >
                Mostrar
              </button>
              <input
                type={passwordShown ? "password" : "text"}
                onChange={(e) => set_password(e.target.value)}
                value={password}
                className="form-control"
                placeholder="Contraseña del usuario"
                pattern="^[A-zÀ-úÀ-ÖØ-öø-ÿ0-9_@./#&+-?!$%^]{1,15}$"
                required={true}
              />
              <span>La contraseña debe contener al menos 1-15 caracteres.</span>
            </div>
            <label>Rol del usuario</label>
            <div className="form-group pb-2">
              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={popover}
              >
                <Button variant="success" className="w-100">
                  Ver Roles
                </Button>
              </OverlayTrigger>
            </div>
            <div className="form-group pb-2">
              <input
                type="text"
                onChange={(e) => set_role(e.target.value)}
                value={role}
                className="form-control"
                placeholder="Rol del Usuario"
                pattern="[1,2]"
                required={true}
              />
              <span>El rol del usuario debe ser 1 o 2.</span>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Añadir
            </button>
          </form>
        </div>
      </div>

      {/* Table of Users */}
      <div className="d-flex justify-content-center ">
        <h2>Listado de Usuarios</h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Popups for Errors and Confirmations */}
      {successfulPost && (
        <MessageModal
          show={showModal}
          onClose={handleClose}
          title={messageTitle}
          message={message}
          onHide={handleClose}
        />
      )}
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
