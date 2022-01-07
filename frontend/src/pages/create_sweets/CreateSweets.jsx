import "./create_sweets.css";
import React, {useEffect, useState} from "react";
import MessageModal from "../../components/modals/MessageModal";

const API = process.env.REACT_APP_SWEETSDB_API;

// Raldys
// Function that manages the user interface for creating a sweet for the menu
// Returns the respective components for rendering the user interface
export default function CreateSweets() {

    // Variables for getting user input
    const [s_name, set_s_name] = useState('');
    const [s_flavor, set_s_flavor] = useState('');
    const [s_price, set_s_price] = useState('');

    // Variables to handle errors with a modal
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [successfulPost, setSuccessfulPost] = useState(false);
    const [messageTitle, setMessageTitle] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    // Variable for storing the sweets in a list from the get request
    const [sweets, set_sweets] = useState(null);

    // Function to manage the form and the POST request for the sweets
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await fetch(API + '/add_new_sweet', { // POST request management
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    s_name,
                    s_flavor,
                    s_price
                })
            })

            if (!res.ok) { // If the post request is not successful display an error modal
                await res.json().then(function (json) { // Handle error when a sweet is already on the menu
                    if (json.status === 400) {
                        console.log("Error 400")
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
            else {
                console.log('200- OK Request')
                setSuccessfulPost(true);
                setMessage('¡El dulce ha sido añadido exitosamente!');
                handleShow();
                // Updates the list of sweets after creating a sweet
                await getSweets();
                await window.scrollTo(0,0);

                // Reset the form variables
                set_s_name('');
                set_s_flavor('');
                set_s_price('');
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

    // Function that manages the get request to get all the available sweets
    const getSweets = async () => {
        try {
            const res = await fetch(API + '/get_all_sweets', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            }) // GET request management
            const data = await res.json();
            set_sweets(data);
            console.log(data)
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

    // Function to update the sweets list after refreshing the page
    useEffect(() => {
        getSweets();
    }, [])

    return (
        // Form
        <div className="create_sweets text-primary container-fluid">
            <div className="row d-flex justify-content-center">
                <div className="col-md-6">
                    <h2 className="card-title text-center">Añadir Dulce</h2>
                    <form onSubmit={handleSubmit} className="card card-body border border-3 border-primary">
                        <div className="form-group pb-2">
                            <label htmlFor="s_name">Nombre</label>
                            <input
                                type="text"
                                onChange={e => set_s_name(e.target.value)}
                                value={s_name}
                                className="form-control"
                                placeholder="Nombre"
                                pattern="^[A-zÀ-ú ]{1,15}$"
                                required={true}
                                autoFocus
                            />
                            <span>El nombre del dulce no debe contener números ni símbolos especiales y debe contener al menos 1-15 letras.</span>
                        </div>
                        <div className="form-group pb-2">
                            <label htmlFor="s_flavor">Sabor</label>
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
                            <label htmlFor="s_price">Precio</label>
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
                            Añadir
                        </button>
                    </form>
                </div>
            </div>
            {/* Table of Sweets */}
            <div className="d-flex justify-content-center ">
                <h2>Listado de Dulces</h2>
            </div>
            {sweets &&
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
                        {sweets.map(sweet => (
                            <tr key={sweet.sweet_id}>
                                <td>{sweet.s_name}</td>
                                <td>{sweet.s_flavor}</td>
                                <td>${sweet.s_price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            }
            {/* Popups for Errors and Confirmations */}
            {successfulPost && <MessageModal show={showModal} onClose={handleClose} title={messageTitle} message={message} onHide={handleClose} />}
            {error && <MessageModal show={showModal} onClose={handleClose} title={messageTitle} message={message} onHide={handleClose} />}
        </div>
    );
}