import "./see_orders.css";
import React, { useState, useEffect } from "react";
import OrderList from "../card_images/Order.png";
import Manage from "../card_images/ManageOrder.png";
import Delivered from "../card_images/DeliveredOrder.png";
import Undelivered from "../card_images/UndeliveredOrder.png";
import CreateOrder from "../card_images/CreateOrder.png";
import NotOrder from "../card_images/Trash.jpeg";
import SearchBy from "../card_images/SearchBy.png";
import { FormControl, FormLabel } from "react-bootstrap";
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
// Function that shows the options of orders in the interface for accessing it
// Returns the respective components for rendering cards user interface
export const OrdersOptions = () => {
  return (
    <div className="wrapper">
      <div className="row">
        <div className="d-flex justify-content-center">
          <h2>
            <strong>---- Órdenes ----</strong>
          </h2>
        </div>
        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={OrderList}
            alt="OrderList"
            title="Lista de Órdenes"
            description="Podrás observar todas las Órdenes disponibles de la panadería"
            link="/see_orders"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={SearchBy}
            alt="SearchBy"
            title="Buscar Orden"
            description="Podrás acceder a una orden, ya sea por número de teléfono ó nombre del cliente"
            link="/search_orders"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={CreateOrder}
            alt="CreateOrder"
            title="Crear Órdenes"
            description="Podrás crear una Orden de dulces o bizcochos de la panadería"
            link="/create_orders"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={Manage}
            alt="Manage"
            title="Manejar Órdenes"
            description="Podrás eliminar ó editar Órdenes del sistema de la panadería"
            link="/manage_orders"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={Undelivered}
            alt="Undelivered"
            title="Órdenes Entregadas"
            description="Podrás habilitar Órdenes entregadas del sistema de la panadería "
            link="/undelivered_orders"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={Delivered}
            alt="Delivered"
            title="Confirmar Órdenes"
            description="Podrás Marcar como entregadas las Órdenes del sistema de la panadería"
            link="/delivered_orders"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={NotOrder}
            alt="NotOrder"
            title="Órdenes Desactivadas"
            description="Podrás habilitar Órdenes desactivadas del sistema de la panadería "
            link="/activate_orders"
            button="Entrar"
          />
        </div>
      </div>
    </div>
  );
};

// Jaime
// Function that shows the orders list with items of each order (avilable to print it) in the interface
// Returns the respective components for rendering the user interface
export const SeeOrders = () => {
  // Variable to store orders, sweets, cakes in a list from the get request
  const [orders, set_orders] = useState([]);
  const [sweetItem, set_sweetItems] = useState([]);
  const [cakeItem, set_cakeItems] = useState([]);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  //Variable to show complete order if is true
  const [isToggled, setIsToggled] = useState(false);

  // Variable to store orders in a list from the get request
  const [orders_list, set_orders_list] = useState([]);

  // Function to store the orders in a json using a get request
  const getOrders = async () => {
    try {
      const res = await fetch(API + "/get_all_activated_orders", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_orders(data);
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

  // Function to store the sweets by order id in a json using a get request
  const getSweetItems = async (id) => {
    try {
      const res = await fetch(API + "/get_list_sweet_by_order_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_sweetItems(data);
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

  // Function to store the cakes by order id in a json using a get request
  const getCakeItems = async (id) => {
    try {
      const res = await fetch(API + "/get_list_cake_by_order_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_cakeItems(data);
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

  // Function to store the order by id in a json using a get request
  const getOrdersList = async (id) => {
    try {
      const res = await fetch(API + "/get_order_by_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_orders_list(data);
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

  // Function to update the orders list after refreshing the page
  useEffect(() => {
    getOrders();
  }, []);

  // Function to show items by order id
  function OrderListItem() {
    return (
      <div className="card-order shadow mb-4">
        <div className="card-body p-5">
          <h4 className="mb-4">
            <strong>Orden Completa</strong>
          </h4>
          {orders_list.map((order, index) => (
            <ul className="list-group list-group-flush" key={index}>
              <h5>
                <strong>Número de cajero: </strong>
                {order.user_id_fk}
              </h5>
              <h5>
                <strong>Orden: </strong>
                {order.order_id}
              </h5>
              <h6>
                <strong>Nombre del Cliente: </strong>
                {order.customer_name}
              </h6>
              <h6>
                <strong>Número de Teléfono del Cliente: </strong>
                {order.phone_number}
              </h6>
              <h6>
                <strong>Abonado: </strong>${order.deposit}
              </h6>
              <h6>
                <strong>Debe: </strong>${order.remainder}
              </h6>
              <h6>
                <strong>Total a Pagar: </strong>${order.total}
              </h6>
            </ul>
          ))}
          {sweetItem.map((sweet, index) => (
            <ul key={index}>
              <h5>
                <strong>Dulce</strong>
              </h5>
              <li>
                Nombre del Dulce: <strong>{sweet.s_name}</strong>
              </li>
              <li>
                Sabor del Dulce: <strong>{sweet.s_flavor}</strong>
              </li>
              <li>
                Cantidad del Dulce: <strong>{sweet.sweet_quantity}</strong>
              </li>
              <li>
                Instrucciones Adicionales:{" "}
                <strong>{sweet.sweet_additional_instructions}</strong>
              </li>
            </ul>
          ))}
          {cakeItem.map((cake, index) => (
            <ul key={index}>
              <h5>
                <strong>Bizcocho</strong>
              </h5>
              <li>
                Tipo de Bizcocho: <strong>{cake.c_type}</strong>
              </li>
              <li>
                Sabor de Bizcocho: <strong>{cake.c_flavor}</strong>
              </li>
              <li>
                Tamaño de Bizcocho: <strong>{cake.c_size}</strong>
              </li>
              <li>
                Cantidad de Bizcochos: <strong>{cake.cake_quantity}</strong>
              </li>
              <li>
                Color del Bizcocho: <strong>{cake.color}</strong>
              </li>
              <li>
                Frosting del Bizcocho: <strong>{cake.frosting}</strong>
              </li>
              <li>
                Instrucciones Adicionales:{" "}
                <strong>{cake.cake_additional_instructions}</strong>
              </li>
            </ul>
          ))}
          <button
            id="bt-print"
            className="btn btn-danger btn-sm btn-block m-1"
            onClick={() => setIsToggled(false)}
          >
            Cerrar
          </button>
          <span> </span>
          <button
            id="bt-print"
            className="btn btn-dark btn-sm btn-block m-1"
            onClick={() => window.print()}
          >
            Imprimir
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="see_orders text-primary container-fluid">
      <div className="d-flex justify-content-center">
        {/* Tabla de lista de Órdenes */}
        <h2 id="autocomplete" className="title">
          Lista de Órdenes Disponibles
        </h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>Número de Orden</th>
              <th>Nombre del Cliente</th>
              <th>Número de Télefono</th>
              <th>ID de Usuario</th>
              <th>Fecha Tomada</th>
              <th>Fecha de Entrega</th>
              <th>Hora de Entrega</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.customer_name}</td>
                <td>{order.phone_number}</td>
                <td>{order.user_id_fk}</td>
                <td>{order.date_taken}</td>
                <td>{order.delivery_date}</td>
                <td>{order.delivery_time}</td>
                <td>
                  <a href="#CompleteOrder">
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      onClick={() =>
                        getOrdersList(order.order_id) &&
                        getCakeItems(order.order_id) &&
                        getSweetItems(order.order_id) &&
                        setIsToggled(true, false)
                      }
                    >
                      Seleccionar & Ver
                    </button>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id="CompleteOrder">
          {orders_list && isToggled && sweetItem && cakeItem && (
            <OrderListItem />
          )}
        </div>
      </div>
      {/* Popup for Errors */}
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
// Function that shows the disabled order list for activate in the interface
// Returns the respective components for rendering the user interface
export const ActivateOrders = () => {
  // Variable to store orders in a list from the get request
  const [orders, set_orders] = useState([]);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [successfulPut, setSuccessfulPut] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  // Function to store the orders in a json using a get request
  const getOrders = async () => {
    try {
      const res = await fetch(API + "/get_all_deactivated_orders", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_orders(data);
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

  // Function to activate orders
  const activateOrder = async (id) => {
    try {
      const res = await fetch(API + "/activate_order/" + id, {
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
          "¡La orden ha sido habilitada exitosamente! Esto significa que estará visible en lista de Órdenes activadas. Para deshabilitarla nuevamente navega hacia manejo de Órdenes."
        );
        handleShow();
        await getOrders(); // Update orders list to show changes in real time
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

  // Function to update the orders list after refreshing the page
  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="see_orders text-primary container-fluid">
      <div className="d-flex justify-content-center">
        {/* Tabla de Órdenes Deshabilidas */}
        <h2 id="autocomplete" className="title">
          Lista de Órdenes Deshabilitadas
        </h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>Número de Orden</th>
              <th>Nombre del Cliente</th>
              <th>Número de Télefono</th>
              <th>ID de Usuario</th>
              <th>Fecha Tomada</th>
              <th>Fecha de Entrega</th>
              <th>Tiempo de Entrega</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.customer_name}</td>
                <td>{order.phone_number}</td>
                <td>{order.user_id_fk}</td>
                <td>{order.date_taken}</td>
                <td>{order.delivery_date}</td>
                <td>{order.delivery_time}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm btn-block"
                    onClick={() => activateOrder(order.order_id)}
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

// Jaime
// Function that shows the delivered orders list with items of each order (avilable to print it) for set undelivered in the interface
// Returns the respective components for rendering the user interface
export const UndeliverOrders = () => {
  // Variable to store orders, sweets, cakes in a list from the get request
  const [orders, set_orders] = useState([]);
  const [sweetItem, set_sweetItems] = useState([]);
  const [cakeItem, set_cakeItems] = useState([]);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [successfulPut, setSuccessfulPut] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  //Variable to show complete order if is true
  const [isToggled, setIsToggled] = useState(false);

  // Variable to store orders in a list from the get request
  const [orders_list, set_orders_list] = useState([]);

  // Function to store the orders in a json using a get request
  const getOrders = async () => {
    try {
      const res = await fetch(API + "/get_all_activated_orders", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_orders(data);
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

  // Function to store the sweets by order id in a json using a get request
  const getSweetItems = async (id) => {
    try {
      const res = await fetch(API + "/get_list_sweet_by_order_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_sweetItems(data);
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

  // Function to store the cakes by order id in a json using a get request
  const getCakeItems = async (id) => {
    try {
      const res = await fetch(API + "/get_list_cake_by_order_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_cakeItems(data);
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

  // Function to set the order undelivered
  const undeliverOrder = async (id) => {
    try {
      const res = await fetch(API + "/pending_order/" + id, {
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
          "¡La orden ha sido marcada como no entregada exitosamente! Esto significa que estará visible en lista de Órdenes activadas. Para marcar entregada nuevamente navega hacia opciones de Órdenes."
        );
        handleShow();
        await getOrders(); // Update orders list to show changes in real time
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

  // Function to store the order by id in a json using a get request
  const getOrdersList = async (id) => {
    try {
      const res = await fetch(API + "/get_order_by_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_orders_list(data);
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

  // Function to update the orders list after refreshing the page
  useEffect(() => {
    getOrders();
  }, []);

  // Function to show items by order id
  function OrderListItem() {
    return (
      <div className="card-order shadow mb-4">
        <div className="card-body p-5">
          <h4 className="mb-4">
            <strong>Orden Completa</strong>
          </h4>
          {orders_list.map((order, index) => (
            <ul className="list-group list-group-flush" key={index}>
              <h5>
                <strong>Número de cajero: </strong>
                {order.user_id_fk}
              </h5>
              <h5>
                <strong>Orden: </strong>
                {order.order_id}
              </h5>
              <h6>
                <strong>Nombre del Cliente: </strong>
                {order.customer_name}
              </h6>
              <h6>
                <strong>Número de Teléfono del Cliente: </strong>
                {order.phone_number}
              </h6>
              <h6>
                <strong>Abonado: </strong>${order.deposit}
              </h6>
              <h6>
                <strong>Debe: </strong>${order.remainder}
              </h6>
              <h6>
                <strong>Total a Pagar: </strong>${order.total}
              </h6>
            </ul>
          ))}
          {sweetItem.map((sweet, index) => (
            <ul key={index}>
              <h5>
                <strong>Dulce</strong>
              </h5>
              <li>
                Nombre del Dulce: <strong>{sweet.s_name}</strong>
              </li>
              <li>
                Sabor del Dulce: <strong>{sweet.s_flavor}</strong>
              </li>
              <li>
                Cantidad del Dulce: <strong>{sweet.sweet_quantity}</strong>
              </li>
              <li>
                Instrucciones Adicionales:{" "}
                <strong>{sweet.sweet_additional_instructions}</strong>
              </li>
            </ul>
          ))}
          {cakeItem.map((cake, index) => (
            <ul key={index}>
              <h5>
                <strong>Bizcocho</strong>
              </h5>
              <li>
                Tipo de Bizcocho: <strong>{cake.c_type}</strong>
              </li>
              <li>
                Sabor de Bizcocho: <strong>{cake.c_flavor}</strong>
              </li>
              <li>
                Tamaño de Bizcocho: <strong>{cake.c_size}</strong>
              </li>
              <li>
                Cantidad de Bizcochos: <strong>{cake.cake_quantity}</strong>
              </li>
              <li>
                Color del Bizcocho: <strong>{cake.color}</strong>
              </li>
              <li>
                Frosting del Bizcocho: <strong>{cake.frosting}</strong>
              </li>
              <li>
                Instrucciones Adicionales:{" "}
                <strong>{cake.cake_additional_instructions}</strong>
              </li>
            </ul>
          ))}
          <button
            id="bt-print"
            className="btn btn-danger btn-sm btn-block m-1"
            onClick={() => setIsToggled(false)}
          >
            Cerrar
          </button>
          <span> </span>
          <button
            id="bt-print"
            className="btn btn-dark btn-sm btn-block m-1"
            onClick={() => window.print()}
          >
            Imprimir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="see_orders text-primary container-fluid">
      <div className="d-flex justify-content-center">
        {/* Tabla de Órdenes Entregadas */}
        <h2 id="autocomplete" className="title">
          Lista de Órdenes Entregadas
        </h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>Número de Orden</th>
              <th>Nombre del Cliente</th>
              <th>Número de Télefono</th>
              <th>ID de Usuario</th>
              <th>Fecha Tomada</th>
              <th>Fecha de Entrega</th>
              <th>Tiempo de Entrega</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.customer_name}</td>
                <td>{order.phone_number}</td>
                <td>{order.user_id_fk}</td>
                <td>{order.date_taken}</td>
                <td>{order.delivery_date}</td>
                <td>{order.delivery_time}</td>
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm btn-block"
                    onClick={() => undeliverOrder(order.order_id)}
                  >
                    Marcar Pendiente
                  </button>{" "}
                  <a href="#CompleteOrder">
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      onClick={() =>
                        getOrdersList(order.order_id) &&
                        getCakeItems(order.order_id) &&
                        getSweetItems(order.order_id) &&
                        setIsToggled(true, false)
                      }
                    >
                      Ver
                    </button>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id="CompleteOrder">
          {orders_list && isToggled && sweetItem && cakeItem && (
            <OrderListItem />
          )}
        </div>
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
// Function that shows the undelivered orders list with items of each order (avilable to print it) for set delivered in the interface
// Returns the respective components for rendering the user interface
export const DeliverOrders = () => {
  // Variable to store orders, sweets, cakes in a list from the get request
  const [orders, set_orders] = useState([]);
  const [sweetItem, set_sweetItems] = useState([]);
  const [cakeItem, set_cakeItems] = useState([]);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [successfulPut, setSuccessfulPut] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  //Variable to show complete order if is true
  const [isToggled, setIsToggled] = useState(false);

  // Variable to store orders in a list from the get request
  const [orders_list, set_orders_list] = useState([]);

  // Function to store the orders in a json using a get request
  const getOrders = async () => {
    try {
      const res = await fetch(API + "/get_all_activated_orders", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_orders(data);
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

  // Function to store the sweets by order id in a json using a get request
  const getSweetItems = async (id) => {
    try {
      const res = await fetch(API + "/get_list_sweet_by_order_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_sweetItems(data);
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

  // Function to store the cakes by order id in a json using a get request
  const getCakeItems = async (id) => {
    try {
      const res = await fetch(API + "/get_list_cake_by_order_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_cakeItems(data);
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

  // Function to set the order delivered
  const deliverOrder = async (id) => {
    try {
      const res = await fetch(API + "/delivered_order/" + id, {
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
          "¡La orden ha sido marcada como entregada exitosamente! Esto significa que estará visible en lista de Órdenes activadas. Para marcar no entregada nuevamente navega hacia opciones de Órdenes."
        );
        handleShow();
        await getOrders(); // Update orders list to show changes in real time
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

  // Function to store the order by id in a json using a get request
  const getOrdersList = async (id) => {
    try {
      const res = await fetch(API + "/get_order_by_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_orders_list(data);
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

  // Function to update the orders list after refreshing the page
  useEffect(() => {
    getOrders();
  }, []);

  // Function to show items by order id
  function OrderListItem() {
    return (
      <div className="card-order shadow mb-4">
        <div className="card-body p-5">
          <h4 className="mb-4">
            <strong>Orden Completa</strong>
          </h4>
          {orders_list.map((order, index) => (
            <ul className="list-group list-group-flush" key={index}>
              <h5>
                <strong>Número de cajero: </strong>
                {order.user_id_fk}
              </h5>
              <h5>
                <strong>Orden: </strong>
                {order.order_id}
              </h5>
              <h6>
                <strong>Nombre del Cliente: </strong>
                {order.customer_name}
              </h6>
              <h6>
                <strong>Número de Teléfono del Cliente: </strong>
                {order.phone_number}
              </h6>
              <h6>
                <strong>Abonado: </strong>${order.deposit}
              </h6>
              <h6>
                <strong>Debe: </strong>${order.remainder}
              </h6>
              <h6>
                <strong>Total a Pagar: </strong>${order.total}
              </h6>
            </ul>
          ))}
          {sweetItem.map((sweet, index) => (
            <ul key={index}>
              <h5>
                <strong>Dulce</strong>
              </h5>
              <li>
                Nombre del Dulce: <strong>{sweet.s_name}</strong>
              </li>
              <li>
                Sabor del Dulce: <strong>{sweet.s_flavor}</strong>
              </li>
              <li>
                Cantidad del Dulce: <strong>{sweet.sweet_quantity}</strong>
              </li>
              <li>
                Instrucciones Adicionales:{" "}
                <strong>{sweet.sweet_additional_instructions}</strong>
              </li>
            </ul>
          ))}
          {cakeItem.map((cake, index) => (
            <ul key={index}>
              <h5>
                <strong>Bizcocho</strong>
              </h5>
              <li>
                Tipo de Bizcocho: <strong>{cake.c_type}</strong>
              </li>
              <li>
                Sabor de Bizcocho: <strong>{cake.c_flavor}</strong>
              </li>
              <li>
                Tamaño de Bizcocho: <strong>{cake.c_size}</strong>
              </li>
              <li>
                Cantidad de Bizcochos: <strong>{cake.cake_quantity}</strong>
              </li>
              <li>
                Color del Bizcocho: <strong>{cake.color}</strong>
              </li>
              <li>
                Frosting del Bizcocho: <strong>{cake.frosting}</strong>
              </li>
              <li>
                Instrucciones Adicionales:{" "}
                <strong>{cake.cake_additional_instructions}</strong>
              </li>
            </ul>
          ))}
          <button
            id="bt-print"
            className="btn btn-danger btn-sm btn-block m-1"
            onClick={() => setIsToggled(false)}
          >
            Cerrar
          </button>
          <span> </span>
          <button
            id="bt-print"
            className="btn btn-dark btn-sm btn-block m-1"
            onClick={() => window.print()}
          >
            Imprimir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="see_orders text-primary container-fluid">
      <div className="d-flex justify-content-center">
        {/* Tabla de Órdenes Pendientes */}
        <h2 id="autocomplete" className="title">
          Lista de Órdenes Pendientes
        </h2>
      </div>
      <div className="d-flex justify-content-center card card-body border border-5 border-primary">
        <table className="table table-striped text-primary table-container">
          <thead className="border border-light">
            <tr>
              <th>Número de Orden</th>
              <th>Nombre del Cliente</th>
              <th>Número de Télefono</th>
              <th>ID de Usuario</th>
              <th>Fecha Tomada</th>
              <th>Fecha de Entrega</th>
              <th>Tiempo de Entrega</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.customer_name}</td>
                <td>{order.phone_number}</td>
                <td>{order.user_id_fk}</td>
                <td>{order.date_taken}</td>
                <td>{order.delivery_date}</td>
                <td>{order.delivery_time}</td>
                <td>
                  <button
                    className="btn btn-outline-success btn-sm btn-block"
                    onClick={() => deliverOrder(order.order_id)}
                  >
                    Entregar
                  </button>{" "}
                  <a href="#CompleteOrder">
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      onClick={() =>
                        getOrdersList(order.order_id) &&
                        getCakeItems(order.order_id) &&
                        getSweetItems(order.order_id) &&
                        setIsToggled(true, false)
                      }
                    >
                      Ver
                    </button>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div id="CompleteOrder">
          {orders_list && isToggled && sweetItem && cakeItem && (
            <OrderListItem />
          )}
        </div>
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
// Function to search order with items of the order (avilable to print it) by name or phone number in the interface
// Returns the respective components for rendering the user interface
export const SearchOrders = () => {
  // Variable to store orders, sweets, cakes in a list from the get request
  const [orders, set_orders] = useState([]);
  const [sweetItem, set_sweetItems] = useState([]);
  const [cakeItem, set_cakeItems] = useState([]);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  //Variable to show complete order if is true
  const [isToggled, setIsToggled] = useState(false);

  //Variable to store letter by letter or number by number to match name or phone number to an order info
  const [matchedOrders, setMatchedOrders] = useState(null);

  // Variable to store orders in a list from the get request
  const [orders_list, set_orders_list] = useState([]);

  // Function to store the orders in a json using a get request
  const getOrders = async () => {
    try {
      const res = await fetch(API + "/get_all_activated_orders", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_orders(data);
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

  // Function to store the sweets by order id in a json using a get request
  const getSweetItems = async (id) => {
    try {
      const res = await fetch(API + "/get_list_sweet_by_order_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_sweetItems(data);
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

  // Function to store the cakes by order id in a json using a get request
  const getCakeItems = async (id) => {
    try {
      const res = await fetch(API + "/get_list_cake_by_order_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_cakeItems(data);
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

  // Function to handle the autocomplete when searching orders by customer name or phone number
  const searchOrders = (text) => {
    let matches = orders.filter((order) => {
      const regex = new RegExp(`${text}`, "gi");
      return (
        order.customer_name.match(regex) || order.phone_number.match(regex)
      );
    });
    setMatchedOrders(matches);
  };

  // Function to store the order by id in a json using a get request
  const getOrdersList = async (id) => {
    try {
      const res = await fetch(API + "/get_order_by_id/" + id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      set_orders_list(data);
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

  // Function to update the orders list after refreshing the page
  useEffect(() => {
    getOrders();
  }, []);

  // Function to show items by order id
  function OrderListItem() {
    return (
      <div className="card-order shadow mb-4">
        <div className="card-body p-5">
          <h4 className="mb-4">
            <strong>Orden Completa</strong>
          </h4>
          {orders_list.map((order, index) => (
            <ul className="list-group list-group-flush" key={index}>
              <h5>
                <strong>Número de cajero: </strong>
                {order.user_id_fk}
              </h5>
              <h5>
                <strong>Orden: </strong>
                {order.order_id}
              </h5>
              <h6>
                <strong>Nombre del Cliente: </strong>
                {order.customer_name}
              </h6>
              <h6>
                <strong>Número de Teléfono del Cliente: </strong>
                {order.phone_number}
              </h6>
              <h6>
                <strong>Abonado: </strong>${order.deposit}
              </h6>
              <h6>
                <strong>Debe: </strong>${order.remainder}
              </h6>
              <h6>
                <strong>Total a Pagar: </strong>${order.total}
              </h6>
            </ul>
          ))}
          {sweetItem.map((sweet, index) => (
            <ul key={index}>
              <h5>
                <strong>Dulce</strong>
              </h5>
              <li>
                Nombre del Dulce: <strong>{sweet.s_name}</strong>
              </li>
              <li>
                Sabor del Dulce: <strong>{sweet.s_flavor}</strong>
              </li>
              <li>
                Cantidad del Dulce: <strong>{sweet.sweet_quantity}</strong>
              </li>
              <li>
                Instrucciones Adicionales:{" "}
                <strong>{sweet.sweet_additional_instructions}</strong>
              </li>
            </ul>
          ))}
          {cakeItem.map((cake, index) => (
            <ul key={index}>
              <h5>
                <strong>Bizcocho</strong>
              </h5>
              <li>
                Tipo de Bizcocho: <strong>{cake.c_type}</strong>
              </li>
              <li>
                Sabor de Bizcocho: <strong>{cake.c_flavor}</strong>
              </li>
              <li>
                Tamaño de Bizcocho: <strong>{cake.c_size}</strong>
              </li>
              <li>
                Cantidad de Bizcochos: <strong>{cake.cake_quantity}</strong>
              </li>
              <li>
                Color del Bizcocho: <strong>{cake.color}</strong>
              </li>
              <li>
                Frosting del Bizcocho: <strong>{cake.frosting}</strong>
              </li>
              <li>
                Instrucciones Adicionales:{" "}
                <strong>{cake.cake_additional_instructions}</strong>
              </li>
            </ul>
          ))}
          <button
            id="bt-print"
            className="btn btn-danger btn-sm btn-block m-1"
            onClick={() => setIsToggled(false)}
          >
            Cerrar
          </button>
          <span> </span>
          <button
            id="bt-print"
            className="btn btn-dark btn-sm btn-block m-1"
            onClick={() => window.print()}
          >
            Imprimir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="see_orders text-primary container-fluid">
      {/* Autocomplete Table */}
      <div className="d-flex justify-content-center mt-3">
        <h2 id="autocomplete" className="title">
          Buscar orden por nombre o número de teléfono del cliente.
        </h2>
      </div>
      <div className="autocomplete text-center mb-3">
        <FormControl
          id="autocomplete"
          className="border border-primary"
          type="text"
          placeholder="Escribe el nombre o número de teléfono del cliente"
          onChange={(e) => searchOrders(e.target.value)}
        />
      </div>
      {matchedOrders && (
        <div className="d-flex justify-content-center card card-body border border-5 border-primary">
          <table className="table table-striped text-primary table-container">
            <thead id="autocomplete" className="border border-light">
              <tr>
                <th>Número de Orden</th>
                <th>Nombre del Cliente</th>
                <th>Número de Télefono</th>
                <th>ID de Usuario</th>
                <th>Fecha Tomada</th>
                <th>Fecha de Entrega</th>
                <th>Hora de Entrega</th>
                <th>Tiempo de Entrega</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {matchedOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.user_id_fk}</td>
                  <td>{order.date_taken}</td>
                  <td>{order.delivery_date}</td>
                  <td>{order.delivery_time}</td>
                  <td>${order.total}</td>
                  <td>
                    {" "}
                    <a href="#CompleteOrder">
                      <button
                        className="btn btn-primary btn-sm btn-block"
                        onClick={() =>
                          getOrdersList(order.order_id) &&
                          getCakeItems(order.order_id) &&
                          getSweetItems(order.order_id) &&
                          setIsToggled(true, false)
                        }
                      >
                        Seleccionar & Ver
                      </button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div id="CompleteOrder">
            {orders_list && isToggled && sweetItem && cakeItem && (
              <OrderListItem />
            )}
          </div>
        </div>
      )}
      {/* Popup for Errors */}
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
