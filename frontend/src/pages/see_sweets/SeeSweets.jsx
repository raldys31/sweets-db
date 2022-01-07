import "./see_sweets.css";
import React, { useState, useEffect } from "react";
import SweetList from "../card_images/Sweet.jpg";
import Manage from "../card_images/Manage.png";
import CreateSweet from "../card_images/CreateSweet.png";
import NotSweet from "../card_images/Trash.jpeg";
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

// Jaime
// Function that shows the options of sweets in the interface for accessing it
// Returns the respective components for rendering cards user interface
export const SweetsOptions = () => {
  return (
    <div className="wrapper">
      <div className="row">
        <div className="d-flex justify-content-center">
          <h2>
            <strong>---- Dulces ----</strong>
          </h2>
        </div>
        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={SweetList}
            alt="SweetList"
            title="Lista de Dulces"
            description="Podrás observar todos los dulces disponibles de la panadería"
            link="/see_sweets"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={CreateSweet}
            alt="CreateSweet"
            title="Crear Dulces"
            description="Podrás añadir dulces al menú de la panadería"
            link="/create_sweets"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={Manage}
            alt="Manage"
            title="Manejar Dulces"
            description="Podrás eliminar ó editar dulces del menú de la panadería"
            link="/manage_sweets"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={NotSweet}
            alt="NotSweet"
            title="Dulces Deshabilitados"
            description="Podrás habilitar dulces desactivados del menú de la panadería "
            link="/activate_sweets"
            button="Entrar"
          />
        </div>
      </div>
    </div>
  );
};

// Jaime
// Function that shows the sweets list avilable in the interface
// Returns the respective components for rendering the user interface
export const SeeSweets = () => {
  // Variable for storing the sweets in a list from the get request
  const [sweets, set_sweets] = useState([]);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [successfulPut, setSuccessfulPut] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const getSweets = async () => {
    try {
      const res = await fetch(API + "/get_all_sweets", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_sweets(data);
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
    getSweets();
  }, []);

  return (
    <div className="see_sweets text-primary container-fluid">
      <div className="d-flex justify-content-center">
        <h2>Lista de Dulces Disponibles</h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>Nombre</th>
              <th>Sabor</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet) => (
              <tr key={sweet.sweet_id}>
                <td>{sweet.s_name}</td>
                <td>{sweet.s_flavor}</td>
                <td>${sweet.s_price}</td>
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

// Jaime
// Function that shows the disabled sweets list for activate in the interface
// Returns the respective components for rendering the user interface
export const ActivateSweets = () => {
  // Variable para guardar los dulces en una lista desde el json
  const [sweets, set_sweets] = useState([]);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [successfulPut, setSuccessfulPut] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const getSweets = async () => {
    try {
      const res = await fetch(API + "/get_disabled_sweets", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_sweets(data);
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
    getSweets();
  }, []);

  // Function to activate sweets.
  const activateSweet = async (id) => {
    try {
      const res = await fetch(API + "/activate_sweet/" + id, {
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
          "¡El dulce ha sido habilitado exitosamente! Esto significa que estará disponible para ventas. Para deshabilitarlo nuevamente navega hacia manejo de dulces."
        );
        handleShow();
        await getSweets(); // Update sweets list to show changes in real time
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
    <div className="see_sweets text-primary container-fluid">
      <div className="d-flex justify-content-center">
        <h2>Lista de Dulces Deshabilitados</h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>Nombre</th>
              <th>Sabor</th>
              <th>Precio</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet) => (
              <tr key={sweet.sweet_id}>
                <td>{sweet.s_name}</td>
                <td>{sweet.s_flavor}</td>
                <td>${sweet.s_price}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm btn-block"
                    onClick={() => activateSweet(sweet.sweet_id)}
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
