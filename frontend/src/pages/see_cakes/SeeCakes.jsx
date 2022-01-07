import "./see_cakes.css";
import React, { useState, useEffect } from "react";
import CakeList from "../card_images/Cake.png";
import Manage from "../card_images/Manage.png";
import CreateCake from "../card_images/CreateCakes.png";
import NotCake from "../card_images/Trash.jpeg";
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
export const CakesOptions = () => {
  return (
    <div className="wrapper">
      <div className="row">
        <div className="d-flex justify-content-center">
          <h2>
            <strong>---- Bizcochos ----</strong>
          </h2>
        </div>
        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={CakeList}
            alt="CakeList"
            title="Lista de Bizcochos"
            description="Podrás observar todos los bizcochos disponibles de la panadería"
            link="/see_cakes"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={CreateCake}
            alt="CreateCake"
            title="Crear Bizcocho"
            description="Podrás añadir bizcochos al menú de la panadería"
            link="/create_cakes"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={Manage}
            alt="Manage"
            title="Manejar Bizcochos"
            description="Podrás eliminar ó editar bizcochos del menú de la panadería"
            link="/manage_cakes"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={NotCake}
            alt="NotCake"
            title="Bizcochos Deshabilitados"
            description="Podrás habilitar bizcochos desactivados del menú de la panadería "
            link="/activate_cakes"
            button="Entrar"
          />
        </div>
      </div>
    </div>
  );
};

// Jaime
// Function that shows the cakes list avilable in the interface
// Returns the respective components for rendering the user interface
export const SeeCakes = () => {
  // Variable for storing the cakes in a list from the get request
  const [cakes, set_cakes] = useState([]);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [successfulPut, setSuccessfulPut] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const getCakes = async () => {
    try {
      const res = await fetch(API + "/get_all_cakes", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_cakes(data);
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

  // Function to update the cakes list after refreshing the page
  useEffect(() => {
    getCakes();
  }, []);

  return (
    <div className="see_cakes text-primary container-fluid">
      <div className="d-flex justify-content-center">
        <h2>Lista de Bizcochos Disponibles</h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>Sabor</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Tamaño</th>
            </tr>
          </thead>
          <tbody>
            {cakes.map((cake) => (
              <tr key={cake.cake_id}>
                <td>{cake.c_flavor}</td>
                <td>{cake.c_type}</td>
                <td>{cake.c_price}</td>
                <td>{cake.c_size}</td>
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
export const ActivateCakes = () => {
  // Variable for storing the cakes in a list from the get request
  const [cakes, set_cakes] = useState([]);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [successfulPut, setSuccessfulPut] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const getCakes = async () => {
    try {
      const res = await fetch(API + "/get_disabled_cakes", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_cakes(data);
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

  // Function to update the cakes list after refreshing the page
  useEffect(() => {
    getCakes();
  }, []);

  // Function to activate cakes.
  const activateCake = async (id) => {
    try {
      const res = await fetch(API + "/activate_cake/" + id, {
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
          "¡El bizcocho ha sido habilitado exitosamente! Esto significa que estará disponible para ventas. Para deshabilitarlo nuevamente navega hacia manejo de bizcochos."
        );
        handleShow();
        await getCakes(); // Update cakes list to show changes in real time
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
    <div className="see_cakes text-primary container-fluid">
      <div className="d-flex justify-content-center">
        <h2>Lista de Bizcochos Deshabilitados</h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>Sabor</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Tamaño</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {cakes.map((cake) => (
              <tr key={cake.cake_id}>
                <td>{cake.c_flavor}</td>
                <td>{cake.c_type}</td>
                <td>{cake.c_price}</td>
                <td>{cake.c_size}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm btn-block"
                    onClick={() => activateCake(cake.cake_id)}
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
