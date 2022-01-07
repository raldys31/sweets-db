import "./manage_sweets.css";
import React, {useEffect, useState} from "react";
import MessageModal from "../../components/modals/MessageModal";

const API = process.env.REACT_APP_SWEETSDB_API;

// Raldys
// Function that manages the user interface for managing a sweet for the menu
// Returns the respective components for rendering the user interface
export default function ManageSweets() {

    // Variables for getting user input
    const [s_name, set_s_name] = useState('');
    const [s_flavor, set_s_flavor] = useState('');
    const [s_price, set_s_price] = useState('');

    // Variables to handle errors and confirmations with a modal
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [successfulPut, setSuccessfulPut] = useState(false);
    const [messageTitle, setMessageTitle] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    // Variables to check if the user is editing an order and to capture the sweet id with a click
    const [editing, setEditing] = useState(false);
    const [id, setId] = useState('');

    // Variable for storing the sweets in a list from the get request
    const [sweets, set_sweets] = useState([]);

    // Function to manage the form and the PUT request for the sweets
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await fetch(API + '/manage_sweet/' + id, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    s_name,
                    s_flavor,
                    s_price
                })
            })

            if (!res.ok) { // If the put request is not successful display an error modal
                await window.scrollTo(0,0);
                await res.json().then(function (json) { // Handle error when a sweet is already on the menu
                    if (json.status === 400) {
                        console.log("El dulce ya existe en el menu")
                        setError(true);
                        setMessageTitle("Error");
                        setMessage(json.message);
                        handleShow();
                    }
                    else { // Handle any other error
                        console.log("Otro Error")
                        setError(true);
                        setMessageTitle("Error");
                        setMessage('Ha ocurrido un error.');
                        handleShow();
                    }
                })
            }
            else { // Show confirmation and reset variables
                console.log('200- OK Request')
                setEditing(false);
                setSuccessfulPut(true);
                setMessage('¡El dulce ha sido actualizado exitosamente!');
                handleShow();

                // Updates the list of sweets after editing a sweet
                JSON.stringify(await getSweets());
                await window.scrollTo(0,0);

                // Reset the form variables
                setId('');
                set_s_name('');
                set_s_flavor('');
                set_s_price('');
            }
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

    // Function that manages the get request to get all the available sweets
    const getSweets = async () => {
        try {
            const res = await fetch(API + '/get_all_sweets', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            set_sweets(data);
            console.log(data)
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

    // Function to update the sweets list after refreshing the page
    useEffect(() => {
        getSweets();
    }, [])

    // Function to get the sweet id and the info of the clicked sweet in the table
    const editSweet = async (id) => {
        try {
            const res = await fetch(API + '/get_sweet_by_id/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            console.log("ID: " + id);

            // Pick up the id and data of the selected sweet to put it the form
            setId(id)
            set_s_name(data.s_name)
            set_s_flavor(data.s_flavor)
            set_s_price(String(data.s_price));

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

    // Function that manages the disabling of a sweet
    const disableSweet = async (id) => {
        try {
            const res = await fetch(API + '/disable_sweet/' + id, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            console.log(data);
            if (res.ok) { // Confirm the request with a modal if it is successful
                console.log('200- OK Request')
                setSuccessfulPut(true);
                setMessageTitle('Confirmación');
                setMessage('¡El dulce ha sido deshabilitado exitosamente! Esto significa que no estará disponible para ventas. Para habilitarlo nuevamente navega hacia opciones de dulces.');
                handleShow();
                await getSweets(); // Update sweets list to show changes in real time
            }
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

    return (
        <div className="manage_sweets text-primary container-fluid">
            { /*Table of sweets*/ }
            <div className="d-flex justify-content-center">
                <h2>Manejo de Dulces</h2>
            </div>
            <div className="d-flex justify-content-center pb-2">
                <h5>Seleccione un dulce para editarlo o deshabilitarlo</h5>
            </div>
            <div className="d-flex justify-content-center card card-body border border-5 border-primary">
                <table className="table table-striped text-primary table-container">
                    <thead className="border border-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Sabor</th>
                        <th>Precio</th>
                        <th>Accion</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sweets.map(sweet => (
                        <tr key={sweet.sweet_id}>
                            <td>{sweet.s_name}</td>
                            <td>{sweet.s_flavor}</td>
                            <td>{sweet.s_price}</td>
                            <td>
                                <a href="#form">
                                    <button className="btn btn-primary btn-sm btn-block m-1"
                                            onClick={() => editSweet(sweet.sweet_id) && setEditing(true)}
                                    >
                                        Editar
                                    </button>
                                </a>
                                <span> </span>
                                <button
                                    className="btn btn-danger btn-sm btn-block btn-delete m-1"
                                    onClick={() => disableSweet(sweet.sweet_id)}
                                >
                                    Deshabilitar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/*Form*/}
            {editing &&
                <div className="row form-container d-flex justify-content-center">
                    <div className="col-md-6">
                        <h2 className="card-title text-center">Actualizar Dulce</h2>
                        <form id="form" onSubmit={handleSubmit}
                              className="card card-body border border-3 border-primary">
                            <div className="form-group pb-2">
                                <label htmlFor="s_name">Nombre del Dulce</label>
                                <input
                                    type="text"
                                    onChange={e => set_s_name(e.target.value)}
                                    value={s_name}
                                    className="form-control"
                                    placeholder="Nombre del Dulce"
                                    pattern="^[A-zÀ-ú ]{1,15}$"
                                    required={true}
                                    autoFocus
                                />
                                <span>El nombre del dulce no debe contener números ni símbolos especiales y debe contener al menos 1-15 letras.</span>
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="s_flavor">Sabor de Dulce</label>
                                <input
                                    type="text"
                                    onChange={e => set_s_flavor(e.target.value)}
                                    value={s_flavor}
                                    className="form-control"
                                    placeholder="Sabor del Dulce"
                                    pattern="^[A-zÀ-ú ]{1,15}$"
                                    required={true}
                                />
                                <span>El sabor del dulce no debe contener números ni símbolos especiales y debe contener al menos 1-15 letras.</span>
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="s_price">Precio del Dulce</label>
                                <input
                                    type="text"
                                    onChange={e => set_s_price(e.target.value)}
                                    value={s_price}
                                    className="form-control"
                                    placeholder="Precio del Dulce"
                                    pattern="^\d+(\.\d{1,2})?$"
                                    required={true}
                                />
                                <span>El precio del dulce debe ser un precio válido.</span>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Actualizar
                            </button>
                        </form>
                    </div>
                </div>
            }
            {/* Popups for Errors and Confirmations */}
            {successfulPut && <MessageModal show={showModal} onClose={handleClose} title={messageTitle} message={message} onHide={handleClose} />}
            {error && <MessageModal show={showModal} onClose={handleClose} title={messageTitle} message={message} onHide={handleClose} />}
        </div>
    );
}