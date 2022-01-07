import "./manage_cakes.css";
import React, {useEffect, useState} from "react";
import MessageModal from "../../components/modals/MessageModal";

const API = process.env.REACT_APP_SWEETSDB_API;

// Raldys
// Function that manages the user interface for managing a cake for the menu
// Returns the respective components for rendering the user interface
export default function ManageCakes() {

    // Variables for getting user input
    const [c_type, set_c_type] = useState('');
    const [c_size, set_c_size] = useState('');
    const [c_flavor, set_c_flavor] = useState('');
    const [c_price, set_c_price] = useState('');

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

    // Variable for storing the cakes in a list from the get request
    const [cakes, set_cakes] = useState(null);

    // Function to manage the form and the PUT request for the cakes
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await fetch(API + '/manage_cake/' + id, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    c_type,
                    c_size,
                    c_flavor,
                    c_price
                })
            })

            if (!res.ok) { // If the put request is not successful display an error modal
                await window.scrollTo(0,0);
                await res.json().then(function (json) { // Handle error when a cake is already on the menu
                    if (json.status === 400) {
                        console.log("El bizcocho ya existe en el menu")
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
                setMessage('¡El bizcocho ha sido actualizado exitosamente!');
                handleShow();

                // Updates the list of sweets after editing a sweet
                JSON.stringify(await getCakes());
                await window.scrollTo(0,0);

                // Reset the form variables
                setId('');
                set_c_type('');
                set_c_size('');
                set_c_flavor('');
                set_c_price('');
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

    // Function that manages the get request to get all the available cakes
    const getCakes = async () => {
        try {
            const res = await fetch(API + '/get_all_cakes', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            set_cakes(data);
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

    // Function to update the cakes list after refreshing the page
    useEffect(() => {
        getCakes();
    }, [])

    // Function to get the cake id and the info of the clicked sweet in the table
    const editCake = async (id) => {
        try {
            const res = await fetch(API + '/get_cake_by_id/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            console.log("ID: " + id);

            // Pick up the id and data of the selected cake to put it the form
            setId(id);
            set_c_type(data.c_type);
            set_c_size(data.c_size);
            set_c_flavor(data.c_flavor)
            set_c_price(String(data.c_price));

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

    // Function that manages the disabling of a cake
    const disableCake = async (id) => {
        try {
            const res = await fetch(API + '/disable_cake/' + id, {
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
                setMessage('¡El bizcocho ha sido deshabilitado exitosamente! Esto significa que no estará disponible para ventas. Para habilitarlo nuevamente navega hacia opciones de dulces.');
                handleShow();
                await getCakes(); // Update cakes list to show changes in real time
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
        <div className="manage_cakes text-primary container-fluid">
            { /* Table of cakes */ }
            <div className="d-flex justify-content-center">
                <h2>Manejo de Bizcochos</h2>
            </div>
            <div className="d-flex justify-content-center pb-2">
                <h5>Seleccione un bizcocho para editarlo o deshabilitarlo</h5>
            </div>
            {cakes &&
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
                        {cakes.map(cake => (
                            <tr key={cake.cake_id}>
                                <td>{cake.c_type}</td>
                                <td>{cake.c_size}</td>
                                <td>{cake.c_flavor}</td>
                                <td>{cake.c_price}</td>
                                <td>
                                    <a href="#form">
                                        <button className="btn btn-primary btn-sm btn-block m-1"
                                                onClick={() => editCake(cake.cake_id) && setEditing(true)}
                                        >
                                            Editar
                                        </button>
                                    </a>
                                    <span> </span>
                                    <button
                                        className="btn btn-danger btn-sm btn-block btn-delete m-1"
                                        onClick={() => disableCake(cake.cake_id)}
                                    >
                                        Deshabilitar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            }
            {/*Form*/}
            {editing &&
                <div className="row form-container d-flex justify-content-center">
                    <div className="col-md-6">
                        <h2 className="card-title text-center">Actualizar Bizcocho</h2>
                        <form id="form" onSubmit={handleSubmit} className="card card-body border border-3 border-primary">
                            <div className="form-group pb-2">
                                <label htmlFor="c_type">Tipo del bizcocho</label>
                                <input
                                    type="text"
                                    onChange={e => set_c_type(e.target.value)}
                                    value={c_type}
                                    className="form-control"
                                    placeholder="Tipo del Bizcocho"
                                    pattern="^[A-zÀ-ú ]{1,15}$"
                                    required={true}
                                    autoFocus
                                />
                                <span>El tipo del bizcocho no debe contener números ni símbolos especiales y debe contener al menos 1-15 letras.</span>
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="c_size">Tamaño del bizcocho</label>
                                <input
                                    type="text"
                                    onChange={e => set_c_size(e.target.value)}
                                    value={c_size}
                                    className="form-control"
                                    placeholder="Tamaño del Bizcocho"
                                    pattern="^[A-zÀ-ú0-9 ]{1,15}$"
                                    required={true}
                                />
                                <span>El tamaño del bizcocho no debe contener símbolos especiales y debe contener al menos 1-15 letras.</span>
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="c_flavor">Sabor de Bizcocho</label>
                                <input
                                    type="text"
                                    onChange={e => set_c_flavor(e.target.value)}
                                    value={c_flavor}
                                    className="form-control"
                                    placeholder="Sabor del Bizcocho"
                                    pattern="^[A-zÀ-ú ]{1,15}$"
                                    required={true}
                                />
                                <span>El sabor del dulce no debe contener números ni símbolos especiales y debe contener al menos 1-15 letras.</span>
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="c_price">Precio del Bizcocho</label>
                                <input
                                    type="text"
                                    onChange={e => set_c_price(e.target.value)}
                                    value={c_price}
                                    className="form-control"
                                    placeholder="Precio del Bizcocho"
                                    pattern="^\d+(\.\d{1,2})?$"
                                    required={true}
                                />
                                <span>El precio del bizcocho debe ser un precio válido.</span>
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