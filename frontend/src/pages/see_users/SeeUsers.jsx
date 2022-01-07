import "./see_users.css";
import React, { useState, useEffect } from "react";
import UserList from "../card_images/User.png";
import ManageUser from "../card_images/ManageUser.png";
import CreateUser from "../card_images/CreateUser.png";
import DeactivatedUsers from "../card_images/ActivateUser.png";
import MessageModal from "../../components/modals/MessageModal";

const API = process.env.REACT_APP_SWEETSDB_API;

// Jaime
// Function that manages the rendering of a card
// Returns a card with its respective properties
function Card(props) {
  return (
    <div className="card">
      <div className="card_body">
        <img src={props.img} className="card_image" />
        <h2 className="card_title">{props.title}</h2>
        <p className="card_description">{props.description}</p>
      </div>
      <a className="card_link" href={props.link}>
        <button type="submit" className="card_btn btn-lg btn-primary">
          {props.button}
        </button>
      </a>
    </div>
  );
}

// Gustavo
// Function that shows the options of users in the interface for accessing it
// Returns the respective components for rendering cards user interface
export const UserOptions = () => {
  return (
    <div className="wrapper">
      <div className="row">
        <div className="d-flex justify-content-center">
          <h2>
            <strong>---- Usuarios ----</strong>
          </h2>
        </div>
        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={UserList}
            alt="UserList"
            title="Lista de Usuarios"
            description="Podrás observar todos los usuarios activos"
            link="/see_users"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={CreateUser}
            alt="CreateUser"
            title="Crear Usuarios"
            description="Podras crear usuarios al sistema"
            link="/create_users"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={ManageUser}
            alt="ManageUser"
            title="Manejar Usuarios"
            description="Podrás eliminar o editar usuarios del sistema"
            link="/manage_users"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={DeactivatedUsers}
            alt="DeactivatedUsers"
            title="Usuarios Deshabilitados"
            description="Podrás habilitar usuarios desactivados del menú de la panadería "
            link="/activate_users"
            button="Entrar"
          />
        </div>
      </div>
    </div>
  );
};

// Gustavo
// Function that shows the activated users list in the interface
// Returns the respective components for rendering the user interface
export const SeeUsers = () => {
  // Variable to store the users in a list
  const [users, set_users] = useState([]);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  //Function that manages the get of all users
  const getUsers = async () => {
    try {
      const res = await fetch(API + "/get_all_users", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_users(data);
      console.log(data);
    } catch (err) {
      let temp = true;
      if (temp) {
        // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
        console.log(err);
        setError(true);
        setMessageTitle("Error");
        setMessage("¡No se ha podido comunicar con el servidor!");
        handleShow();
        await window.scrollTo(0, 0);
      }
    }
  };

  // Function so that the user get request runs everytime the page laods
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="see_users text-primary container-fluid">
      <div className="d-flex justify-content-center">
        <h2>Lista de Usuarios</h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Popup for Error */}
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
};

// Gustavo
// Function that shows the deactivated users list for activate in the interface
// Returns the respective components for rendering the user interface
export const ActivateUsers = () => {
  const API = process.env.REACT_APP_SWEETSDB_API;

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [successfulPut, setSuccessfulPut] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  // Variable to store the users in a list
  const [users, set_users] = useState([]);

  const getUsers = async () => {
    try {
      const res = await fetch(API + "/get_disabled_users", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_users(data);
      console.log(data);
    } catch (err) {
      let temp = true;
      if (temp) {
        // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
        console.log(err);
        setError(true);
        setMessageTitle("Error");
        setMessage("¡No se ha podido comunicar con el servidor!");
        handleShow();
        await window.scrollTo(0, 0);
      }
    }
  };

  // Function to update the sweets list after refreshing the page
  useEffect(() => {
    getUsers();
  }, []);

  // Function to activate users.
  const activateUser = async (id) => {
    try {
      const res = await fetch(API + "/activate_user/" + id, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        // Confirm the request with a modal if it is successful
        console.log("200- OK Request");
        setSuccessfulPut(true);
        setMessageTitle("Confirmación");
        setMessage(
          "¡El usuario ha sido habilitado exitosamente! Esto significa que estará disponible para acceder. Para deshabilitarlo nuevamente navega hacia manejo de usuarios."
        );
        handleShow();
        await getUsers(); // Update Users list to show changes in real time
      }
    } catch (err) {
      let temp = true;
      if (temp) {
        // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
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
    <div className="see_users text-primary container-fluid">
      <div className="d-flex justify-content-center">
        <h2>Lista de Usuarios Deshabilitados</h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>Nombre</th>
              <th>Contraseña</th>
              <th>Rol</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm btn-block"
                    onClick={() => activateUser(user.user_id)}
                  >
                    Habilitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Popups for Errors and Confirmations */}
      {successfulPut && (
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
};
