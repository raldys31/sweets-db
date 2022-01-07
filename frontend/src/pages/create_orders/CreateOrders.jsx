import "./create_orders.css";
import React, {useEffect, useState} from "react";
import MessageModal from "../../components/modals/MessageModal";

const API = process.env.REACT_APP_SWEETSDB_API;

// Jorge
// Function that manages the user interface for creating orders
// Returns the respective components for rendering the user interface
export default function CreateOrders() {

    // Order info
    const [customer_name, set_customer_name] = useState('')
    const [phone_number, set_phone_number] = useState('')
    const [date_taken, set_date_taken] = useState('');
    const [delivery_date, set_delivery_date] = useState('');
    const [delivery_time, set_delivery_time] = useState('');
    const [deposit, set_deposit] = useState('');

    // Item info
    const [sweet_quantity, set_sweet_quantity] = useState('');
    const [sweet_additional_instructions, set_sweet_additional_instructions] = useState('');
    const [sweet_id, set_sweet_id] = useState('');
    const [cake_quantity, set_cake_quantity] = useState('');
    const [color, set_color] = useState('');
    const [frosting, set_frosting] = useState('');
    const [cake_id, set_cake_id] = useState('');
    const [cake_additional_instructions, set_cake_additional_instructions] = useState('');

    // Variables for handling item type
    const [sweets, set_sweets] = useState([]);
    const [cakes, set_cakes] = useState([]);
    const [sweetItems, set_sweetItems] = useState([]);
    const [cakeItems, set_cakeItems] = useState([]);
    const [showSweets, set_showSweets] = useState('');
    const [showCakes, set_showCakes] = useState('')
    const [itemAdded, set_itemAdded] = useState(false);
    const [addedSweet, set_addedSweet] = useState(false);
    const [addedCake, set_addedCake] = useState(false);

    // Variables to handle errors with a modal
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [successfulPost, setSuccessfulPost] = useState(false);
    const [messageTitle, setMessageTitle] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    // Variables to handle the display
    const [addingSweet, setAddingSweet] = useState(false);
    const [addingCake, setAddingCake] = useState(false);
    const [orderReady, setOrderReady] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const handleOrderSubmit = () => {
        setOrderReady(true);
        setAddingSweet(false);
        setAddingCake(false);
        set_showSweets('');
        set_showCakes('');
        setHideItemType(true);
        setShowConfirmation(false);
    }
    const [hideItemType, setHideItemType] = useState(false);
    const handleShowList = async (sweets_value, cakes_value) => {
        set_showSweets(sweets_value);
        set_showCakes(cakes_value);
    }
    const handleAddingItem = async (sweets_value, cakes_value) => {
        setAddingSweet(sweets_value);
        setAddingCake(cakes_value);
    }

    function refreshPage() {
        window.location.reload();
    }

    // Function to handle the create order form
    const handleSubmitOrder = async (e) => {
        try {
            e.preventDefault();
            const res = await fetch(API + '/create_order', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customer_name,
                    phone_number,
                    date_taken,
                    delivery_date,
                    delivery_time,
                    deposit,
                    'user_id': localStorage.getItem('user_id')
                })
            })
            const data = await res.json();
            console.log(data);

            if (!res.ok) { // Handle request errors
                console.log("Error")
                setError(true);
                setMessageTitle("Error");
                setMessage('Ha ocurrido un error.');
                handleShow();
            }
            else { // Confirm the request with a modal if it is successful
                setSuccessfulPost(true);
                setMessage('¡La orden ha sido completada exitosamente!');
                handleShow();
                console.log("Orden completada")
                set_customer_name('');
                set_phone_number('');
                set_date_taken('');
                set_delivery_date('');
                set_delivery_time('');
                set_deposit('');
                set_addedCake(false);
                set_addedSweet(false);
                set_sweetItems('');
                set_cakeItems('');
                refreshPage();
            }
        } catch(err) { // Handle network errors
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }

    // Handle sweet items
    const handleItemSweets = async (e) => {
        try {
            e.preventDefault();
            set_sweet_id(sweet_id);
            console.log(sweet_id)
            const res = await fetch(API + '/create_sweet_item', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sweet_quantity,
                    sweet_additional_instructions,
                    sweet_id
                })
            })
            const data = await res.json();

            if (!res.ok) { // Handle request errors
                console.log("Error")
                setError(true);
                setMessageTitle("Error");
                setMessage('Ha ocurrido un error.');
                handleShow();
            }
            else { // Confirm the request with a modal if it is successful
                set_itemAdded(true);
                setShowConfirmation(true);
                setSuccessfulPost(true);
                setMessage('¡El dulce ha sido añadido exitosamente a la orden!');
                handleShow();
                console.log("Dulce añadido exitosamente a la orden.")
                console.log(data)
                await getSweetItems();
                setAddingSweet(false);
                set_sweet_quantity('');
                set_sweet_additional_instructions('');
                set_sweet_id('');
                set_addedSweet(true);
                await window.scrollTo(0, 0);
            }
        } catch(err) { // Handle network errors
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }

    // Handle cake items
    const handleItemCakes = async (e) => {
        try {
            e.preventDefault();
            set_cake_id(cake_id);
            console.log(cake_id);
            const res = await fetch(API + '/create_cake_item', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cake_quantity,
                    cake_additional_instructions,
                    color,
                    frosting,
                    cake_id
                })
            })
            const data = await res.json();

            if (!res.ok) { // Handle request errors
                console.log("Error")
                setError(true);
                setMessageTitle("Error");
                setMessage('Ha ocurrido un error.');
                handleShow();
            }
            else { // Confirm the request with a modal if it is successful
                set_itemAdded(true);
                setShowConfirmation(true);
                setSuccessfulPost(true);
                setMessage('¡El bizcocho ha sido añadido exitosamente a la orden!');
                handleShow();
                console.log("Bizcocho añadido exitosamente a la orden.")
                console.log(data)
                await getCakeItems();
                setAddingCake(false);
                set_cake_quantity('');
                set_cake_additional_instructions('');
                set_frosting('');
                set_color('');
                set_cake_id('');
                set_addedCake(true);
                await window.scrollTo(0, 0);
            }
        } catch(err) { // Handle network errors
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }

    // Function to delete a pending item from an order
    const deletePendingSweetItem = async (id) => {
        try {
            const res = await fetch(API + '/delete_sweet_pending_item/' + id, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) { // Handle request errors
                console.log("Error")
                setError(true);
                setMessageTitle("Error");
                setMessage('Ha ocurrido un error.');
                handleShow();
            }
            else { // Confirm the request with a modal if it is successful
                console.log('200- OK Request')
                setMessageTitle('Confirmación');
                setMessage('El pedido fue borrado de la orden.');
                handleShow();
                await getSweetItems(); // Update cakes list to show changes in real time
            }
        } catch(err) { // Handle network errors
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }

    const deletePendingCakeItem = async (id) => {
        try {
            const res = await fetch(API + '/delete_cake_pending_item/' + id, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) { // Handle request errors
                console.log("Error")
                setError(true);
                setMessageTitle("Error");
                setMessage('Ha ocurrido un error.');
                handleShow();
            }
            else { // Confirm the request with a modal if it is successful
                console.log('200- OK Request')
                setMessageTitle('Confirmación');
                setMessage('El pedido fue borrado de la orden.');
                handleShow();
                await getCakeItems(); // Update cakes list to show changes in real time
            }
        } catch(err) { // Handle network errors
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }

    // Function to store the sweets in a json using a get request
    const getSweets = async () => {
        try {
            const res = await fetch(API + "/get_all_sweets", {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            set_sweets(data);

        } catch(err) {
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }

    // Function to store the cakes in a json using a get request
    const getCakes = async () => {
        try {
            const res = await fetch(API + "/get_all_cakes", {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            set_cakes(data);

        } catch(err) {
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }

    // Function to store the sweets in a json using a get request
    const getSweetItems = async () => {
        try {
            const res = await fetch(API + "/get_list_sweet_by_order_id/" + '9999999', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            set_sweetItems(data);

            console.log(data);

        } catch(err) {
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }

    // Function to store the sweets in a json using a get request
    const getCakeItems = async () => {
        try {
            const res = await fetch(API + "/get_list_cake_by_order_id/" + '9999999', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            set_cakeItems(data);
            console.log(data);

            //getPendingCakeInfo(cakeItems[0].cake_id || '');
        } catch(err) {
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }

    // Function to get the sweet id and the info of the clicked sweet in the table
    const pickSweetInfo = async (id) => {
        try {
            await fetch(API + '/get_sweet_by_id/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            console.log("Sweet ID: " + id);

            // Pick up the id of the sweet
            set_sweet_id(String(id));
        } catch(err) {
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }

    // Function to get the cake id and the info of the clicked cake in the table
    const pickCakeInfo = async (id) => {
        try {
            await fetch(API + '/get_cake_by_id/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            console.log("Cake ID: " + id);

            // Pick up the id of the sweet
            set_cake_id(String(id));
        } catch(err) {
            let temp = true;
            if (temp) { // Handle error when the request url does not exist, the connection to the database fails or there is an internal server error.
                console.log(err)
                setError(true);
                setMessageTitle("Error");
                setMessage('¡No se ha podido comunicar con el servidor!');
                handleShow();
                await window.scrollTo(0,0);
            }
        }
    }


    // Functions to update the sweets, cakes, sweet items and cake items list when loading the page
    useEffect(() => {
        getSweets();
    }, []);

    useEffect(() => {
        getCakes();
    }, []);

    useEffect(() => {
        getSweetItems();
    }, []);

    useEffect(() => {
        getCakeItems();
    }, []);

    return (
        <div className="create_orders text-primary container-fluid">
            <div className="row d-flex justify-content-center">
                {/* Order Type Card */}
                {!hideItemType &&
                    <div className="card text-center text-primary border-primary border-3" style={{width: 30 + 'rem'}}>
                        <div className="card-header">
                            <h5 className="card-title">Tipo de Orden</h5>
                        </div>
                        <div className="card-body">
                            <p className="card-text">
                                Seleccione el tipo de orden que desea realizar.
                            </p>
                            <a href="#sweets">
                                <button
                                    className="btn btn-primary btn btn-block m-1"

                                    onClick={() => handleShowList(true, false) && handleAddingItem(false, false)}
                                >
                                    Dulces
                                </button>
                            </a>
                            <a href="#cakes">
                                <button
                                    className="btn btn-primary btn btn-block m-1"
                                    onClick={() => handleShowList(false, true) && handleAddingItem(false, false)}
                                >
                                    Bizcochos
                                </button>
                            </a>
                        </div>
                    </div>
                }
                {/* Show sweets added to the order */}
                {addedSweet &&
                    <div>
                        <div className="card-header text-center bg-white">
                            <h5 className="card-title">Pedidos de Dulces</h5>
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
                                                onClick={() => deletePendingSweetItem(sweet.sweet_id)}
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
                }
                {/* Show cakes added to the order */}
                {addedCake &&
                    <div>
                        <div className="card-header text-center bg-white">
                            <h5 className="card-title">Pedidos de Bizcochos</h5>
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
                                                onClick={() => deletePendingCakeItem(cake.cake_id)}
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
                }
                {/* Shows the sweets table */}
                <div id="sweets"></div>
                {showSweets &&
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
                                                <button className="btn btn-primary btn-sm btn-block m-1"
                                                        onClick={() => pickSweetInfo(sweet.sweet_id) && handleAddingItem(true, false)}
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
                }
                {/* Shows the cakes table*/}
                <div id="cakes"></div>
                {showCakes &&
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
                                                <button className="btn btn-primary btn-sm btn-block m-1"
                                                        onClick={() => pickCakeInfo(cake.cake_id) && handleAddingItem(false, true)}
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
                }
                <div id="adding"></div>
                {/* Adding form for sweets */}
                {addingSweet &&
                    <div className="row form-container d-flex justify-content-center">
                        <div className="col-md-6">
                            <form onSubmit={handleItemSweets} className="card card-body border border-3 border-primary">
                                <h3 className="card-title text-center">Añadir dulce a la orden</h3>
                                <div className="form-group pb-2">
                                    <label htmlFor="sweet_quantity">Cantidad</label>
                                    <input
                                        type="text"
                                        onChange={e => set_sweet_quantity(e.target.value)}
                                        value={sweet_quantity || ''}
                                        className="form-control"
                                        placeholder="Cantidad del Dulce"
                                        pattern="^[0-9]+"
                                        required={true}
                                        autoFocus
                                    />
                                    <span>La cantidad del dulce debe ser un número válido.</span>
                                </div>
                                <div className="form-group pb-2">
                                    <label htmlFor="sweet_additional_instructions">Instrucciones Adicionales</label>
                                    <textarea
                                        onChange={e => set_sweet_additional_instructions(e.target.value)}
                                        value={sweet_additional_instructions || ''}
                                        className="form-control"
                                        placeholder="Instrucciones Adicionales"
                                    />
                                </div>
                                <button className="btn btn-primary"
                                        onClick={() => getCakeItems() && getSweetItems()}
                                >
                                    Añadir
                                </button>
                            </form>
                        </div>
                    </div>
                }
                {/* Adding form for cakes */}
                {addingCake &&
                    <div className="row form-container d-flex justify-content-center">
                        <div className="col-md-6">
                            <form onSubmit={handleItemCakes} className="card card-body border border-3 border-primary">
                                <h3 className="card-title text-center">Añadir bizcocho a la orden</h3>
                                <div className="form-group pb-2">
                                    <label htmlFor="cake_quantity">Cantidad</label>
                                    <input
                                        type="text"
                                        onChange={e => set_cake_quantity(e.target.value)}
                                        value={cake_quantity || ''}
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
                                        onChange={e => set_color(e.target.value)}
                                        value={color || ''}
                                        className="form-control"
                                        placeholder="Color del Bizcocho"
                                        pattern="^[A-zÀ-ú ]{1,15}$"
                                        required={true}
                                    />
                                    <span>El color del bizcocho no debe contener números ni símbolos especiales y debe contener al menos 1-15 letras.</span>
                                </div>
                                <div className="form-group pb-2">
                                    <label htmlFor="frosting">Frosting</label>
                                    <input
                                        type="text"
                                        onChange={e => set_frosting(e.target.value)}
                                        value={frosting || ''}
                                        className="form-control"
                                        placeholder="Frosting del Bizcocho"
                                        pattern="^[A-zÀ-ú ]{1,15}$"
                                        required={true}
                                    />
                                    <span>El frosting del bizcocho no debe contener números ni símbolos especiales y debe contener al menos 1-15 letras.</span>
                                </div>
                                <div className="form-group pb-2">
                                    <label htmlFor="cake_additional_instructions">Instrucciones Adicionales</label>
                                    <textarea
                                        onChange={e => set_cake_additional_instructions(e.target.value)}
                                        value={cake_additional_instructions || ''}
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
                }
                {/* Order Ready To Go */}
                {orderReady &&
                    <div className="col-md-6">
                        <h2 className="card-title text-center">Crear Orden</h2>
                        <form onSubmit={handleSubmitOrder} className="card card-body border border-3 border-primary">
                            <div className="form-group pb-2">
                                <label htmlFor="customer_name">Nombre</label>
                                <input
                                    type="text"
                                    onChange={e => set_customer_name(e.target.value)}
                                    value={customer_name}
                                    className="form-control"
                                    placeholder="Nombre"
                                    pattern="^[A-zÀ-ú ]{1,50}$"
                                    required={true}
                                    autoFocus
                                />
                                <span>El nombre no debe contener números ni símbolos especiales y debe contener al menos 1-50 letras.</span>
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="phone_number">Número de Teléfono</label>
                                <input
                                    type="text"
                                    onChange={e => set_phone_number(e.target.value)}
                                    value={phone_number}
                                    className="form-control"
                                    placeholder="Número de Teléfono"
                                    pattern="^[0-9]{1,10}$"
                                    required={true}
                                />
                                <span>El número de teléfono debe estar en formato: 77871234567 (sin guiones '-').</span>
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="date_taken"> Fecha</label>
                                <input
                                    type="date"
                                    onChange={e => set_date_taken(e.target.value)}
                                    value={date_taken}
                                    className="form-control"
                                    placeholder="Fecha"
                                    required={true}
                                />
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="delivery_date">Fecha de Entrega</label>
                                <input
                                    type="date"
                                    onChange={e => set_delivery_date(e.target.value)}
                                    value={delivery_date}
                                    className="form-control"
                                    placeholder="Fecha de Entrega"
                                    required={true}
                                />
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="delivery_time">Hora de Entrega</label>
                                <input
                                    type="time"
                                    onChange={e => set_delivery_time(e.target.value)}
                                    value={delivery_time}
                                    className="form-control"
                                    placeholder="Hora de Entrega"
                                    required={true}
                                />
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="deposit">Depósito</label>
                                <input
                                    type="text"
                                    onChange={e => set_deposit(e.target.value)}
                                    value={deposit}
                                    className="form-control"
                                    placeholder="Depósito"
                                    pattern="^\d+(\.\d{1,2})?$"
                                    required={true}
                                />
                                <span>El depósito de la orden debe ser en formato: %N.%N%N.</span>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Añadir
                            </button>
                        </form>
                    </div>
                }
                {/* Show confirmation card */}
                {itemAdded && showConfirmation &&
                    <div className="text-center text-primary">
                        <div className="card border border-3 border-primary">
                            <div className="card-header">
                                <h5>Confirmación</h5>
                            </div>
                            <div className="card-body">
                                <p className="card-text">
                                    Si la orden está lista, presiona el siguiente botón para proceder con la
                                    información del cliente.
                                </p>
                                <button type="submit" className="btn btn-primary" onClick={handleOrderSubmit}>
                                    Confirmar Orden
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {/* Popups for Errors and Confirmations */}
            {successfulPost && <MessageModal show={showModal} onClose={handleClose} title={messageTitle} message={message} onHide={handleClose} />}
            {error && <MessageModal show={showModal} onClose={handleClose} title={messageTitle} message={message} onHide={handleClose} />}
        </div>
    );
}
