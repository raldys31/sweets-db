import {useEffect} from "react";
import {withRouter} from "react-router-dom";

// Raldys
// Function to make pages scroll to the top when reloading
const ScrollToTop = ({ children, location: { pathname } }) => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }, [pathname]);

    return children || null;
};

export default withRouter(ScrollToTop);