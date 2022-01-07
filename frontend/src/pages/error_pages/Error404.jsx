import "./error404.css";
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

// Raldys
// Function that manages the rendering of the page that is shown when the user access a link that does not exist
// Returns the respective components for rendering the page
export default function Error404({toggleSideBar}) {

    useEffect(() => {
        toggleSideBar(); // Hides the sidebar when the page is triggered
    }, []);

    return (
        <div className="error">
            <div id="notfound">
                <div className="notfound-bg"></div>
                <div className="notfound">
                    <div className="notfound-404">
                        <h1>404</h1>
                    </div>
                    <h2>¡Oops! La pagina solicitada no existe.</h2>
                    <Link to="/">
                        <Button className="btn-secondary btn-block" onClick={toggleSideBar}>Pagina Principal</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}