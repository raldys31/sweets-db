import "./manage_users.css";
import React, {useState, useEffect} from "react";
import MessageModal from "../../components/modals/MessageModal";
import {ListGroup, OverlayTrigger, Popover} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const API = process.env.REACT_APP_SWEETSDB_API;

// Gustavo
// Function that manages the user interface for managing the users
// Returns the respective components for rendering the manage user interface
export default function ManageUsers() {

    // Variables to get input from user form
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const [role, set_role] = useState('');

    // Variables to handle errors and confirmations with a modal
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [successfulPut, setSuccessfulPut] = useState(false);
    const [messageTitle, setMessageTitle] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    // Variables to check if the user is editing and to capture the user id with a click
    const [editing, setEditing] = useState(false);
    const [id, setId] = useState('');

    // Variable to store the users in a list
    const [users, set_users] = useState([]);

    // Function that manages the manage user form
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await fetch(API + '/manage_user/' + id, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    role
                })
            })

            if (!res.ok) { // If the put request is not successful display an error modal
                await window.scrollTo(0,0);
                await res.json().then(function (json) { // Handle error when a user is already on the menu
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
                setMessage('¡El usuario ha sido actualizado exitosamente!');
                handleShow();

                // Updates the list of users after editing a users
                JSON.stringify(await getUsers());
                await window.scrollTo(0,0);

                // Resets the form and id after a request is successful
                setId('');
                set_username('');
                set_password('');
                set_role('');
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

    // Function that manages the get of all users
    const getUsers = async () => {
        try {
            const res = await fetch(API + '/get_all_second_users', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            set_users(data);
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

    // Function used so that the user get request runs everytime the page laods
    useEffect(() => {
        getUsers();
    }, [])

    // Function to edit users
    const editUser = async (id) => {
        try {
            const res = await fetch(API + '/get_user_by_id/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('refresh_token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            console.log("ID: " + id);

            setId(id)
            set_username(data.username)
            set_password('')
            set_role(data.role)
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

    // Function to manage the disabling of users.
    const disableUser = async (id) => {
        try {
            const res = await fetch(API + '/disable_user/' + id, {
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
                setMessage('¡El usuario ha sido deshabilitado exitosamente! Esto significa que no estará disponible para iniciar sesión. Para habilitarlo nuevamente navega hacia opciones de usuarios.');
                handleShow();
                await getUsers();
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

    // Function to manage pop that displays information for each role
    const popover = (
        <Popover id="popover-basic" className="text-justify">
            <Popover.Header as="h2" className="bg-primary text-white">Información de Roles</Popover.Header>
            <Popover.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h5>1. Administrador</h5>
                        El administrador podrá acceder todas las funcionalidades de la página incluyendo el manejo de
                        usuarios, el manejo del menú y el manejo de las órdenes.
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h5>2. Empleado</h5>
                        El empleado solo podrá acceder las funcionalidades de la página referentes al manejo de
                        las órdenes.
                    </ListGroup.Item>
                </ListGroup>
            </Popover.Body>
        </Popover>
    );

    return (
        <div className="manage_users text-primary container-fluid">
            { /*Table of users*/ }
            <div className="d-flex justify-content-center">
                <h2>Manejo de Usuarios</h2>
            </div>
            <div className="d-flex justify-content-center mb-2">
                <h5>Seleccione un usuario para editarlo o deshabilitarlo</h5>
            </div>
            <div className="d-flex justify-content-center card card-body border border-5 border-primary">
                <table className="table table-striped text-primary table-container">
                    <thead className="border border-light">
                    <tr>
                        <th>Usuario</th>
                        <th>Contraseña</th>
                        <th>Rol</th>
                        <th>ID</th>
                        <th>Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.username}</td>
                            <td>{user.password}</td>
                            <td>{user.role}</td>
                            <td>{user.user_id}</td>
                            <td>
                                <a href="#form">
                                    <button className="btn btn-primary btn-sm btn-block"
                                            onClick={() => editUser(user.user_id) && setEditing(true)}
                                    >
                                        Editar
                                    </button>
                                </a>
                                <span> </span>
                                <button
                                    className="btn btn-danger btn-sm btn-block btn-delete m-1"
                                    onClick={() => disableUser(user.user_id)}
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
            { editing &&
                <div className="row form-container d-flex justify-content-center">
                    <div className="col-md-6">
                        <h2 className="card-title text-center">Actualizar Usuario</h2>
                        <form id="form" onSubmit={handleSubmit} className="card card-body border border-3 border-primary">
                            <div className="form-group pb-2">
                                <label htmlFor="username">Nombre del Usuario</label>
                                <input
                                    type="text"
                                    onChange={e => set_username(e.target.value)}
                                    value={username}
                                    className="form-control"
                                    placeholder="Nombre del Usuario"
                                    pattern="^[A-zÀ-ú0-9]{1,15}$"
                                    required={true}
                                    autoFocus
                                />
                                <span>El nombre de usuario no debe contener símbolos especiales y debe contener al menos 1-15 caracteres.</span>
                            </div>
                            <div className="form-group pb-2">
                                <label htmlFor="password">Contraseña del Usuario</label>
                                <input
                                    type="text"
                                    onChange={e => set_password(e.target.value)}
                                    value={password}
                                    className="form-control"
                                    placeholder="Contraseña del usuario"
                                    pattern="^[A-zÀ-úÀ-ÖØ-öø-ÿ0-9_@./#&+-?!$%^]{1,15}$"
                                    required={true}
                                />
                                <span>La contraseña debe contener al menos 1-15 caracteres.</span>
                            </div>
                            <label>Rol del usuario</label>
                            <div className="form-group pb-2">
                                <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                                    <Button variant="success" className="w-100">Ver Roles</Button>
                                </OverlayTrigger>
                            </div>
                            <div className="form-group pb-2">
                                <input
                                    type="text"
                                    onChange={e => set_role(e.target.value)}
                                    value={role}
                                    className="form-control"
                                    placeholder="Rol del Usuario"
                                    pattern="[1,2]"
                                    required={true}
                                />
                                <span>El rol del usuario debe ser 1 o 2.</span>
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