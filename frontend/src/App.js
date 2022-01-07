import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import {HomeOptions} from "./pages/home/Home";
import {ManageOrders} from "./pages/manage_orders/ManageOrders";
import {SeeSweets, SweetsOptions, ActivateSweets} from "./pages/see_sweets/SeeSweets";
import {SeeCakes, CakesOptions, ActivateCakes} from "./pages/see_cakes/SeeCakes";
import {SeeOrders, OrdersOptions, ActivateOrders, UndeliverOrders, DeliverOrders, SearchOrders} from "./pages/see_orders/SeeOrders";
import CreateSweets from "./pages/create_sweets/CreateSweets";
import ManageSweets from "./pages/manage_sweets/ManageSweets";
import CreateCakes from "./pages/create_cakes/CreateCakes";
import ManageCakes from "./pages/manage_cakes/ManageCakes";
import CreateOrders from "./pages/create_orders/CreateOrders";
import CreateUsers from "./pages/create_users/CreateUsers";
import {SeeUsers, UserOptions, ActivateUsers} from "./pages/see_users/SeeUsers";
import ManageUsers from "./pages/manage_users/ManageUsers";
import Login from "./pages/login/Login";
import {Tutorial} from "./pages/tutorial/Tutorial";
import {Contact} from "./pages/contact/Contact";
import Error403 from "./pages/error_pages/Error403";
import Error404 from "./pages/error_pages/Error404";
import "./App.css";
import "bootswatch/dist/flatly/bootstrap.min.css";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import React, {useState} from "react";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";

// Raldys
// Handles the routing of the app
function App() {

    // Variables to handle when to show the sidebar and topbar
    const [showSidebarAndTopbar, setShowSidebarAndTopbar] = useState(true);
    const handleToggleSidebar = () => {
        setShowSidebarAndTopbar(!showSidebarAndTopbar);
    }

    // Variables to verify if there is a user logged and if its role is administrator
    const logged = localStorage.getItem('logged') === 'true';
    const role = localStorage.getItem('role') === '1';

    // Function to redirect the user to the login page if there is no account logged
    const PrivateRoute = ({ component: Component, ...rest }) =>
        (
            <Route {...rest} render={props =>
                (
                    logged ? <Component {...props} /> : <Redirect to={{pathname: '/login'}}/>
                )}/>
        );

    // Function to protect the routes that require administrator privileges
    const RoleProtectedRoute = ({ component: Component, ...rest }) =>
        (
            <Route {...rest} render={props =>
                (
                    role ? <Component {...props} /> : <Redirect to={{pathname: '/error403'}}/>
                )}/>
        );

    return (
        <Router>
            <ScrollToTop>
                <Topbar />
                <div className="main">
                    {showSidebarAndTopbar && <Sidebar />}
                    <Switch>
                        <PrivateRoute exact path="/" component={HomeOptions} />
                        <Route path="/login" render={(props) => <Login toggleSideBar={handleToggleSidebar} {...props} />}/>
                        {logged ?
                            <Route path="/see_sweets" component={SeeSweets}/> :
                            <Redirect to="/login" />
                        }
                        {logged ?
                            <Route path="/sweet_options" component={SweetsOptions}/> :
                            <Redirect to="/login" />
                        }
                        {logged ?
                            <RoleProtectedRoute path="/activate_sweets" component={ActivateSweets}/> :
                            <Redirect to="/login" />
                        }
                        {logged ?
                            <Route path="/see_cakes" component={SeeCakes}/> :
                            <Redirect to="/login" />
                        }
                        {logged ?
                            <Route path="/cake_options" component={CakesOptions}/> :
                            <Redirect to="/login" />
                        }
                        {logged ?
                            <RoleProtectedRoute path="/activate_cakes" component={ActivateCakes}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <RoleProtectedRoute path="/create_sweets" component={CreateSweets}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <RoleProtectedRoute path="/manage_sweets" component={ManageSweets}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <RoleProtectedRoute path="/create_cakes" component={CreateCakes}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <RoleProtectedRoute path="/manage_cakes" component={ManageCakes}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <Route path="/see_orders" component={SeeOrders}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <Route path="/order_options" component={OrdersOptions}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <Route path="/activate_orders" component={ActivateOrders}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <Route path="/manage_orders" component={ManageOrders}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <Route path="/create_orders" component={CreateOrders}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <Route path="/delivered_orders" component={DeliverOrders}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <Route path="/undelivered_orders" component={UndeliverOrders}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <Route path="/search_orders" component={SearchOrders}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <RoleProtectedRoute path="/user_options" component={UserOptions}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <RoleProtectedRoute path="/create_users" component={CreateUsers}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <RoleProtectedRoute path="/see_users" component={SeeUsers}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <RoleProtectedRoute path="/manage_users" component={ManageUsers}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <RoleProtectedRoute path="/activate_users" component={ActivateUsers}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <Route path="/error403" render={(props) => <Error403 toggleSideBar={handleToggleSidebar} {...props}/>}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <PrivateRoute exact path="/tutorial" component={Tutorial}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <PrivateRoute exact path="/contact" component={Contact}/> :
                            <Redirect to="/login"/>
                        }
                        {logged ?
                            <Route render={(props) => <Error404 toggleSideBar={handleToggleSidebar} {...props}/>}/> :
                            <Redirect to="/login"/>
                        }
                    </Switch>
                </div>
            </ScrollToTop>
        </Router>
    );
}

export default App;