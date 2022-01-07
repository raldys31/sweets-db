import "./login.css";
import React, {useEffect, useState} from "react";
import MessageModal from "../../components/modals/MessageModal";
import logo from "../images/SweetsDB.png"
import {useHistory} from "react-router-dom";

const API = process.env.REACT_APP_SWEETSDB_API;

export default function Login({toggleSideBar}) {

    // User info
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // Variables to handle errors with a modal
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [messageTitle, setMessageTitle] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const history = useHistory();

    const logged = localStorage.getItem('logged') === 'true';

    // Function to handle the login form
    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            const res = await fetch(API + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                })
            })
            if (!res.ok) { // If the post request is not successful display an error modal
                // Handle error when the user fails the credentials
                if (res.status === 401) {
                    console.log("Unauthorized 401")
                    setError(true);
                    setMessageTitle("Credenciales Incorrectos");
                    setMessage("Nombre de usuario o contraseña incorrectos.");
                    handleShow();
                }
                else { // Handle any other error
                    console.log("Otro Error")
                    setError(true);
                    setMessageTitle("Error");
                    setMessage('Ha ocurrido un error.');
                    handleShow();
                }
            }
            else {
                res.json().then(function (json) { // Store user info in local storage to handle authentication and roles
                    console.log('201 - Logged In')
                    history.push('/'); // Redirects the user to the landing page
                    // toggleSideBar();
                    console.log(json)
                    localStorage.setItem('user_id', json.user_id);
                    localStorage.setItem('role', json.role);
                    localStorage.setItem('logged', 'true');
                    localStorage.setItem('access_token', json.access_token);
                    localStorage.setItem('refresh_token', json.refresh_token);
                })
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

    useEffect(() => {
       if (logged) {
           history.push('/');
       }
    }, [logged, history]);

    useEffect(() => {
        toggleSideBar(); // Hides the sidebar when the page is triggered
    }, []);

    return (
        <div className="login-bg">
            <div className="login">
            <img className="image-logo" src={logo} alt="This is SweetsDB logo" />
                <form onSubmit={handleLogin} className="card card-body" style={{width: 25 + 'rem'}}>
                    <h3 className="card-title text-center">Login</h3>
                    <div className="form-group pb-2">
                        <label>Nombre de usuario</label>
                        <input
                            type="text"
                            onChange={e => setUsername(e.target.value)}
                            value={username}
                            className="form-control"
                            placeholder="Nombre de usuario"
                            required={true}
                            autoFocus
                        />
                    </div>
                    <div className="form-group pb-2">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            className="form-control"
                            placeholder="Contraseña"
                            required={true}
                        />
                    </div>
                    <button className="btn btn-primary">
                        Entrar
                    </button>
                </form>
                {error && <MessageModal show={showModal} onClose={handleClose} title={messageTitle} message={message} onHide={handleClose} />}
            </div>
        </div>
    );
}