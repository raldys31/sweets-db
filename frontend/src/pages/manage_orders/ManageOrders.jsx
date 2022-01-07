import "./manage_orders.css";
import React, { useEffect, useState } from "react";
import MessageModal from "../../components/modals/MessageModal";

const API = process.env.REACT_APP_SWEETSDB_API;

// Jorge
// Function that manages the user interface for managing orders
// Returns the respective components for rendering the user interface
export const ManageOrders = () => {

  // Variables for getting user input
  const [customer_name, set_customer_name] = useState("");
  const [phone_number, set_phone_number] = useState("");
  const [date_taken, set_date_taken] = useState("");
  const [delivery_date, set_delivery_date] = useState("");
  const [delivery_time, set_delivery_time] = useState("");
  const [deposit, set_deposit] = useState("");

  // Variables for items
  const [sweetItems, set_sweetItems] = useState([]);
  const [cakeItems, set_cakeItems] = useState([]);
  const [sweet_id_fk, set_sweet_id_fk] = useState("");
  const [cake_id_fk, set_cake_id_fk] = useState("");
  const [order_id_fk, set_order_id_fk] = useState("");

  // Item info
  const [sweet_quantity, set_sweet_quantity] = useState("");
  const [sweet_additional_instructions, set_sweet_additional_instructions] = useState("");
  const [sweet_id, set_sweet_id] = useState("");
  const [cake_quantity, set_cake_quantity] = useState("");
  const [color, set_color] = useState("");
  const [frosting, set_frosting] = useState("");
  const [cake_id, set_cake_id] = useState("");
  const [cake_additional_instructions, set_cake_additional_instructions] = useState("");

  // Variables to handle the display
  const [addingSweet, setAddingSweet] = useState(false);
  const [addingCake, setAddingCake] = useState(false);

  // VERIFICAR USO
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Variables to handle errors and confirmations with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [successfulPut, setSuccessfulPut] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  // OJO VERIFICAR USO
  const [itemAdded, set_itemAdded] = useState(false);
  const [addedSweet, set_addedSweet] = useState(false);
  const [addedCake, set_addedCake] = useState(false);
  const [successfulPost, setSuccessfulPost] = useState(false);

  // Variables to check if the user is editing an order and to capture the sweet id with a click
  const [editing, setEditing] = useState(false);
  const [order_id, set_order_id] = useState("");

  // Variable for storing the orders, cakes, sweets and items in a list from the get request
  const [orders, set_orders] = useState([]);
  const [cakes, set_cakes] = useState([]);
  const [sweets, set_sweets] = useState([]);
  const [sweet_item, set_sweet_item] = useState("");
  const [cake_item, set_cake_item] = useState("");

  // Function to manage the form and the PUT request for the cakes
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch(API + "/manage_order/" + order_id, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id,
          customer_name,
          phone_number,
          date_taken,
          delivery_date,
          delivery_time,
          deposit,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        console.log("Error");
        setError(true);
        setMessageTitle("Error");
        setMessage("Ha ocurrido un error.");
        handleShow();
      } else {
        setSuccessfulPost(true);
        setMessage("¡La orden ha sido actualizada exitosamente!");
        handleShow();
        console.log("Orden completada");
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

  // Function to get all the active available orders
  const getOrders = async () => {
    try {
      const res = await fetch(API + "/get_all_activated_orders", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const all_orders_data = await res.json();
      set_orders(all_orders_data);
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

  // Function to get all the available sweets
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

  // Function that manages the get request to get all the available cakes
  const getCakes = async () => {
    try {
      const res = await fetch(API + "/get_all_cakes", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
        },
      });
      const all_cakes_data = await res.json();
      set_cakes(all_cakes_data);
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

  // Functions to update the cakes, sweets and orders list after refreshing the page
  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    getSweets();
  }, []);

  useEffect(() => {
    getCakes();
  }, []);

  // Function to get the sweets of an order using order id
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

  // Function to get the cakes of an order using order id
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

  // Function to know what type of item has to be shown
  const handleAddingItem = async (sweets_value, cakes_value) => {
    setAddingSweet(sweets_value);
    setAddingCake(cakes_value);
  };

  // Function to get the cake id and the info of the clicked sweet in the table
  const editOrder = async (id) => {
    try {
      const res = await fetch(API + "/get_order_by_id/" + id, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("refresh_token"),
            "Content-Type": "application/json",
        },
      });
      const order_data = await res.json();
      console.log("ID: " + id);

      // Pick up the id and data of the selected cake to put it the form
      set_order_id(id);
      set_order_id_fk(id);
      set_customer_name(order_data[0].customer_name);
      set_phone_number(order_data[0].phone_number);
      set_date_taken(order_data[0].date_taken);
      set_delivery_date(order_data[0].delivery_date);
      set_delivery_time(order_data[0].delivery_time);
      set_deposit(order_data[0].deposit);
      await getSweetItems(id);
      await getCakeItems(id);
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

  // Function to handle the deletion of a sweet item in a pending order
  const deletePendingSweetItem = async (id, item_id) => {
    try {
      set_sweet_id_fk(id);
      set_sweet_item(item_id);
      console.log(item_id);
      console.log(sweet_item);
      console.log(sweet_id_fk);
      console.log(order_id_fk);
      console.log(
        JSON.stringify({
          order_id_fk,
          sweet_id_fk,
          sweet_item,
        })
      );
      const res = await fetch(API + "/delete_sweet_item/", {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("refresh_token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id_fk,
          sweet_id_fk,
          sweet_item,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) { // Confirm the request with a modal if it is successful
        console.log("Error");
        setError(true);
        setMessageTitle("Error");
        setMessage("Ha ocurrido un error.");
        handleShow();
      }
      else {
        console.log("200- OK Request");
        setMessageTitle("Confirmación");
        setMessage("El pedido fue borrado de la orden.");
        handleShow();
        await getSweetItems(order_id_fk); // Update cakes list to show changes in real time
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

  // Function to handle the deletion of a cake item in a pending order
  const deletePendingCakeItem = async (id, item_id) => {
    try {
      set_cake_id_fk(id);
      set_cake_item(item_id);
      console.log(id);
      console.log(order_id_fk);
      const res = await fetch(API + "/delete_cake_item/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("refresh_token"),
        },
        body: JSON.stringify({
          order_id_fk,
          cake_id_fk,
          cake_item,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) { // Confirm the request with a modal if it is successful
        console.log("200- OK Request");
        setMessageTitle("Confirmación");
        setMessage("El pedido fue borrado de la orden.");
        handleShow();
        await getCakeItems(order_id_fk); // Update cakes list to show changes in real time
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

  // Function the creation of a sweet item for an order
  const handleItemSweets = async (e) => {
    try {
      e.preventDefault();
      console.log(sweet_id);
      const res = await fetch(API + "/create_sweet_item", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("refresh_token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sweet_quantity,
          sweet_additional_instructions,
          sweet_id,
          order_id,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        console.log("Error");
        setError(true);
        setMessageTitle("Error");
        setMessage("Ha ocurrido un error.");
        handleShow();
      } else {
        set_itemAdded(true);
        setShowConfirmation(true);
        setSuccessfulPost(true);
        setMessage("¡El dulce ha sido añadido exitosamente a la orden!");
        handleShow();
        console.log("Dulce añadido exitosamente a la orden.");
        console.log(data);
        await getSweetItems(order_id_fk);
        setAddingSweet(false);
        set_sweet_quantity("");
        set_sweet_additional_instructions("");
        set_sweet_id("");
        set_addedSweet(true);
        await window.scrollTo(0, 0);
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

  // Function the creation of a cake item for an order
  const handleItemCakes = async (e) => {
    try {
      e.preventDefault();
      set_cake_id(cake_id);
      console.log(cake_id);
      const res = await fetch(API + "/create_cake_item", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("refresh_token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cake_quantity,
          cake_additional_instructions,
          color,
          frosting,
          cake_id,
          order_id,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        console.log("Error");
        setError(true);
        setMessageTitle("Error");
        setMessage("Ha ocurrido un error.");
        handleShow();
      } else {
        set_itemAdded(true);
        setShowConfirmation(true);
        setSuccessfulPost(true);
        setMessage("¡El bizcocho ha sido añadido exitosamente a la orden!");
        handleShow();
        console.log("Bizcocho añadido exitosamente a la orden.");
        console.log(data);
        await getCakeItems(order_id_fk);
        setAddingCake(false);
        set_cake_quantity("");
        set_cake_additional_instructions("");
        set_frosting("");
        set_color("");
        set_cake_id("");
        set_addedCake(true);
        await window.scrollTo(0, 0);
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

  // Function to disable an order
  const disableOrder = async (id) => {
    try {
      const res = await fetch(API + "/disable_order/" + id, {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("refresh_token"),
            "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) { // Confirm the request with a modal if it is successful
        console.log("200- OK Request");
        setSuccessfulPut(true);
        setMessageTitle("Confirmación");
        setMessage("La orden ha sido desactivada exitosamente.");
        handleShow();
        await getOrders(); // Update sweets list to show changes in real time
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
    <div className="manage_orders text-primary container-fluid">
      {/* Table of orders */}
      <div className="d-flex justify-content-center">
        <h2>Manejo de Órdenes</h2>
      </div>
      <div className="d-flex justify-content-center pb-2">
        <h5>Seleccione una orden para editarla o deshabilitarla</h5>
      </div>
      {cakes && (
        <div className="d-flex justify-content-center card card-body border border-5 border-primary">
          <table className="table table-striped text-primary table-container">
            <thead className="border border-light">
              <tr>
                <th>Número de Orden</th>
                <th>Nombre</th>
                <th>Número de Teléfono</th>
                <th>Fecha</th>
                <th>Fecha de Entrega</th>
                <th>Hora de Entrega</th>
                <th>Depósito</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.order_id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.date_taken}</td>
                  <td>{order.delivery_date}</td>
                  <td>{order.delivery_time}</td>
                  <td>{order.deposit}</td>

                  <td>
                    <a href="#form">
                      <button
                        className="btn btn-primary btn-sm btn-block m-1"
                        onClick={() =>
                          editOrder(order.order_id) && setEditing(true)
                        }
                      >
                        Editar
                      </button>
                    </a>
                    <span> </span>
                    <button
                      className="btn btn-danger btn-sm btn-block btn-delete m-1"
                      onClick={() => disableOrder(order.order_id)}
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/*Form*/}
      {editing && (
        <div className="row form-container d-flex justify-content-center">
          <div className="col-md-6">
            <h2 className="card-title text-center">Actualizar Orden</h2>
            <form
              id="form"
              onSubmit={handleSubmit}
              className="card card-body border border-3 border-primary"
            >
              <div className="form-group pb-2">
                <label htmlFor="customer_name">Nombre</label>
                <input
                  type="text"
                  onChange={(e) => set_customer_name(e.target.value)}
                  value={customer_name || ""}
                  className="form-control"
                  placeholder="Nombre"
                  pattern="^[A-zÀ-ú]{1,50}$"
                  required={true}
                  autoFocus
                />
                <span>
                  El nombre no debe contener números ni símbolos especiales y
                  debe contener al menos 1-50 letras.
                </span>
              </div>
              <div className="form-group pb-2">
                <label htmlFor="phone_number">Número de Teléfono</label>
                <input
                  type="text"
                  onChange={(e) => set_phone_number(e.target.value)}
                  value={phone_number || ""}
                  className="form-control"
                  placeholder="7871234567"
                  pattern="^[A-zÀ-ú0-9]{1,10}$"
                  required={true}
                />
                <span>
                  El número de teléfono debe estar en formato: 77871234567 (sin
                  guiones '-').
                </span>
              </div>
              <div className="form-group pb-2">
                <label htmlFor="date_taken">Fecha</label>
                <input
                  type="date"
                  onChange={(e) => set_date_taken(e.target.value)}
                  value={date_taken || ""}
                  className="form-control"
                  placeholder="1/1/2022"
                  pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
                  required={true}
                />
                <span>La fecha debe estar en formato mm/dd/yyyy.</span>
              </div>
              <div className="form-group pb-2">
                <label htmlFor="delivery_date">Fecha de Entrega</label>
                <input
                  type="date"
                  onChange={(e) => set_delivery_date(e.target.value)}
                  value={delivery_date || ""}
                  className="form-control"
                  placeholder="1/1/2022"
                  pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
                  required={true}
                />
                <span>La fecha debe estar en formato mm/dd/yyyy.</span>
              </div>
              <div className="form-group pb-2">
                <label htmlFor="delivery_time">Hora de Entrega</label>
                <input
                  type="time"
                  onChange={(e) => set_delivery_time(e.target.value)}
                  value={delivery_time || ""}
                  className="form-control"
                  placeholder="10:00 am"
                  pattern="((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))"
                  required={true}
                />
                <span>La hora de entrega debe ser en formato: %H:%M %p</span>
              </div>
              <div className="form-group pb-2">
                <label htmlFor="deposit">Depósito</label>
                <input
                  type="text"
                  onChange={(e) => set_deposit(e.target.value)}
                  value={deposit || ""}
                  className="form-control"
                  placeholder="Depósito"
                  pattern="^\d+(\.\d{1,2})?$"
                  required={true}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
            </form>
          </div>
          <div className="mt-2">
            <div className="card-header">
              <h5 className="card-title">Pedidos de Dulce</h5>
            </div>
            <div className="d-flex justify-content-center card card-body border border-5 border-primary">
              <table className="table table-striped text-primary table-container">
                <thead className="border border-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Sabor</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Instrucciones Adicionales</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {sweetItems.map((sweet, index) => (
                    <tr key={index}>
                      <td>{sweet.s_name}</td>
                      <td>{sweet.s_flavor}</td>
                      <td>{sweet.s_price}</td>
                      <td>{sweet.sweet_quantity}</td>
                      <td>{sweet.sweet_additional_instructions}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm btn-block btn-delete m-1"
                          onClick={() =>
                            deletePendingSweetItem(
                              sweet.sweet_id,
                              sweet.item_sweet_id
                            )
                          }
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-2">
            <div className="card-header">
              <h5 className="card-title">Pedidos de Bizcocho</h5>
            </div>
            <div className="d-flex justify-content-center card card-body border border-5 border-primary">
              <table className="table table-striped text-primary table-container">
                <thead className="border border-light">
                  <tr>
                    <th>Tipo</th>
                    <th>Tamaño</th>
                    <th>Sabor</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Color</th>
                    <th>Frosting</th>
                    <th>Instrucciones Adicionales</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cakeItems.map((cake, index) => (
                    <tr key={index}>
                      <td>{cake.c_type}</td>
                      <td>{cake.c_size}</td>
                      <td>{cake.c_flavor}</td>
                      <td>{cake.c_price}</td>
                      <td>{cake.cake_quantity}</td>
                      <td>{cake.color}</td>
                      <td>{cake.frosting}</td>
                      <td>{cake.cake_additional_instructions}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm btn-block btn-delete m-1"
                          onClick={() =>
                            deletePendingCakeItem(
                              cake.cake_id,
                              cake.item_cake_id
                            )
                          }
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-2">
            <div className="card-header text-center bg-white">
              <h5 className="card-title">Dulces Disponibles</h5>
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
                  {sweets.map((sweet, index) => (
                    <tr key={index}>
                      <td>{sweet.s_name}</td>
                      <td>{sweet.s_flavor}</td>
                      <td>{sweet.s_price}</td>
                      <td>
                        <a href="#adding">
                          <button
                            className="btn btn-primary btn-sm btn-block m-1"
                            onClick={() =>
                              handleAddingItem(true, false) &&
                              set_sweet_id(sweet.sweet_id)
                            }
                          >
                            Añadir a la orden
                          </button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-2">
            <div className="card-header text-center bg-white">
              <h5 className="card-title">Bizcochos Disponibles</h5>
            </div>
            <div className="d-flex justify-content-center card card-body border border-5 border-primary">
              <table className="table table-striped text-primary table-container">
                <thead className="border border-light">
                  <tr>
                    <th>Tipo</th>
                    <th>Tamaño</th>
                    <th>Sabor</th>
                    <th>Precio</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cakes.map((cake, index) => (
                    <tr key={index}>
                      <td>{cake.c_type}</td>
                      <td>{cake.c_size}</td>
                      <td>{cake.c_flavor}</td>
                      <td>{cake.c_price}</td>
                      <td>
                        <a href="#adding">
                          <button
                            className="btn btn-primary btn-sm btn-block m-1"
                            onClick={() =>
                              handleAddingItem(false, true) &&
                              set_cake_id(cake.cake_id)
                            }
                          >
                            Añadir a la orden
                          </button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {addingSweet && (
        <div className="row form-container d-flex justify-content-center">
          <div className="col-md-6">
            <form
              onSubmit={handleItemSweets}
              className="card card-body border border-3 border-primary"
            >
              <h3 className="card-title text-center">
                Añadir dulce a la orden
              </h3>
              <div className="form-group pb-2">
                <label htmlFor="sweet_quantity">Cantidad</label>
                <input
                  type="text"
                  onChange={(e) => set_sweet_quantity(e.target.value)}
                  value={sweet_quantity || ""}
                  className="form-control"
                  placeholder="Cantidad del Dulce"
                  pattern="^[0-9]+"
                  required={true}
                  autoFocus
                />
                <span>La cantidad del dulce debe ser un número válido.</span>
              </div>
              <div className="form-group pb-2">
                <label htmlFor="sweet_additional_instructions">
                  Instrucciones Adicionales
                </label>
                <textarea
                  onChange={(e) =>
                    set_sweet_additional_instructions(e.target.value)
                  }
                  value={sweet_additional_instructions || ""}
                  className="form-control"
                  placeholder="Instrucciones Adicionales"
                />
              </div>
              <button className="btn btn-primary">Añadir</button>
            </form>
          </div>
        </div>
      )}
      {/* Adding form for cakes */}
      {addingCake && (
        <div className="row form-container d-flex justify-content-center">
          <div className="col-md-6">
            <form
              onSubmit={handleItemCakes}
              className="card card-body border border-3 border-primary"
            >
              <h3 className="card-title text-center">
                Añadir bizcocho a la orden
              </h3>
              <div className="form-group pb-2">
                <label htmlFor="cake_quantity">Cantidad</label>
                <input
                  type="text"
                  onChange={(e) => set_cake_quantity(e.target.value)}
                  value={cake_quantity || ""}
                  className="form-control"
                  placeholder="Cantidad del Bizcocho"
                  pattern="^[0-9]+"
                  required={true}
                  autoFocus
                />
                <span>La cantidad de bizcochos debe ser un número válido.</span>
              </div>
              <div className="form-group pb-2">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  onChange={(e) => set_color(e.target.value)}
                  value={color || ""}
                  className="form-control"
                  placeholder="Color del Bizcocho"
                  pattern="^[A-zÀ-ú]{1,15}$"
                  required={true}
                />
                <span>
                  El color del bizcocho no debe contener números ni símbolos
                  especiales y debe contener al menos 1-15 letras.
                </span>
              </div>
              <div className="form-group pb-2">
                <label htmlFor="frosting">Frosting</label>
                <input
                  type="text"
                  onChange={(e) => set_frosting(e.target.value)}
                  value={frosting || ""}
                  className="form-control"
                  placeholder="Frosting del Bizcocho"
                  pattern="^[A-zÀ-ú]{1,15}$"
                  required={true}
                />
                <span>
                  El frosting del bizcocho no debe contener números ni símbolos
                  especiales y debe contener al menos 1-15 letras.
                </span>
              </div>
              <div className="form-group pb-2">
                <label htmlFor="cake_additional_instructions">
                  Instrucciones Adicionales
                </label>
                <textarea
                  onChange={(e) =>
                    set_cake_additional_instructions(e.target.value)
                  }
                  value={cake_additional_instructions || ""}
                  className="form-control"
                  placeholder="Instrucciones Adicionales"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Añadir
              </button>
            </form>
          </div>
        </div>
      )}

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
