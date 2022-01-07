import "./create_cakes.css";
import React, {useEffect, useState} from "react";
import MessageModal from "../../components/modals/MessageModal";

const API = process.env.REACT_APP_SWEETSDB_API;

// Raldys
// Function that manages the user interface for creating a cake for the menu
// Returns the respective components for rendering the user interface
export default function CreateCakes() {

    // Variables for getting user input
    const [c_type, set_c_type] = useState('');
    const [c_size, set_c_size] = useState('');
    const [c_flavor, set_c_flavor] = useState('');
    const [c_price, set_c_price] = useState('');

    // Variables to handle errors with a modal
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [successfulPost, setSuccessfulPost] = useState(false);
    const [messageTitle, setMessageTitle] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    // Variable for storing the cakes in a list from the get request
    const [cakes, set_cakes] = useState(null);

    // Function to manage the form and the POST request for the cakes
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await fetch(API + '/add_new_cake', { // POST request management
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    c_type,
                    c_size,
                    c_flavor,
                    c_price
                })
            })

            if (!res.ok) { // If the post request is not successful display an error modal
                await res.json().then(function (json) { // Handle error when a cake is already on the menu
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
                setMessage('¡El bizcocho ha sido añadido exitosamente!');
                handleShow();
                // Updates the list of cakes after creating a sweet
                await getCakes();
                await window.scrollTo(0,0);

                // Reset the form variables
                set_c_type('');
                set_c_size('');
                set_c_flavor('');
                set_c_price('');
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

    // Function that manages the get request to get all the available cakes
    const getCakes = async () => {
        try {
            const res = await fetch(API + '/get_all_cakes',{
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            }) // GET request management
            const data = await res.json();
            set_cakes(data);
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

    // Function to update the cakes list after refreshing the page
    useEffect(() => {
        getCakes();
    }, [])

    return (
        // Form
        <div className="create_cakes text-primary container-fluid">
            <div className="row d-flex justify-content-center">
                <div className="col-md-6">
                    <h2 className="card-title text-center">Añadir Bizcocho</h2>
                    <form onSubmit={handleSubmit} className="card card-body border border-3 border-primary">
                        <div className="form-group pb-2">
                            <label htmlFor="c_type">Tipo</label>
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
                            <label htmlFor="c_size">Tamaño</label>
                            <input
                                type="text"
                                onChange={e => set_c_size(e.target.value)}
                                value={c_size}
                                className="form-control"
                                placeholder="Tamaño del Bizcocho"
                                pattern="^[A-zÀ-ú0-9 ]{1,15}$"
                                required={true}
                                autoFocus
                            />
                            <span>El tamaño del bizcocho no debe contener símbolos especiales y debe contener al menos 1-15 letras.</span>
                        </div>
                        <div className="form-group pb-2">
                            <label htmlFor="c_flavor">Sabor</label>
                            <input
                                type="text"
                                onChange={e => set_c_flavor(e.target.value)}
                                value={c_flavor}
                                className="form-control"
                                placeholder="Sabor del Bizcocho"
                                pattern="^[A-zÀ-ú0-9 ]{1,15}$"
                                required={true}
                            />
                            <span>El sabor del bizcocho no debe contener símbolos especiales y debe contener al menos 1-15 letras.</span>
                        </div>
                        <div className="form-group pb-2">
                            <label htmlFor="s_price">Precio</label>
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
                            Añadir
                        </button>
                    </form>
                </div>
            </div>
            {/* Table of Cakes */}
            <div className="d-flex justify-content-center ">
                <h2>Listado de Bizcochos</h2>
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
                        </tr>
                        </thead>
                        <tbody>
                        {cakes.map(cake => (
                            <tr key={cake.cake_id}>
                                <td>{cake.c_type}</td>
                                <td>{cake.c_size}</td>
                                <td>{cake.c_flavor}</td>
                                <td>${cake.c_price}</td>
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