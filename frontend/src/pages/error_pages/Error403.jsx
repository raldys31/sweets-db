import "./error403.css";
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

// Raldys
// Function that manages the rendering of the page that is shown when the user access a link but cannot access the content
// because of the role
// Returns the respective components for rendering the page
export default function Error403({toggleSideBar}) {

    useEffect(() => {
        toggleSideBar(); // Hides the sidebar when the page is triggered
    }, []);

    return (
        <div className="error">
            <div id="prohibited">
                <div className="prohibited-bg"></div>
                <div className="prohibited">
                    <div className="prohibited-403">
                        <h1>403</h1>
                    </div>
                    <h2>¡Oops! Necesitas una cuenta de administrador para acceder a esta página.</h2>
                    <Link to="/">
                        <Button className="btn-secondary btn-block" onClick={toggleSideBar}>Página Principal</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}