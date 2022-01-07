import "./home.css";
import OrderList from "../card_images/Order.png";
import ManageOrder from "../card_images/ManageOrder.png";
import Delivered from "../card_images/DeliveredOrder.png";
import Undelivered from "../card_images/UndeliveredOrder.png";
import CreateOrder from "../card_images/CreateOrder.png";
import NotOrder from "../card_images/Trash.jpeg";
import SweetList from "../card_images/Sweet.jpg";
import ManageSweet from "../card_images/Manage.png";
import CreateSweet from "../card_images/CreateSweet.png";
import NotSweet from "../card_images/Trash.jpeg";
import CakeList from "../card_images/Cake.png";
import ManageCake from "../card_images/Manage.png";
import CreateCake from "../card_images/CreateCakes.png";
import NotCake from "../card_images/Trash.jpeg";
import SearchBy from "../card_images/SearchBy.png";
import bakery from "../images/miArcoiris.jpg"

// Jaime
// Function that manages the rendering of a card
// Returns a card with its respective properties
function Card(props) {
  return (
    <div className="card">
      <div className="card_body">
        <img src={props.img} className="card_image" />
        <h2 className="card_title">{props.title}</h2>
        <p className="card_description">{props.description}</p>
      </div>
      <a className="card_link" href={props.link}>
        <button type="submit" className="card_btn btn-lg btn-primary">
          {props.button}
        </button>
      </a>
    </div>
  );
}

// Jaime
// Function that manages the landing page content
// Returns various cards including the different content of the webpage related to the orders and the menu
export const HomeOptions = () => {
  return (
    <div className="wrapper">
      <div className="row">
        <img className="image-bakery" src={bakery} alt="This is Bakery logo"/>
        <div className="d-flex justify-content-center">
          <h2>
            <strong>---- Órdenes ----</strong>
          </h2>
        </div>
        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={OrderList}
            alt="OrderList"
            title="Lista de Órdenes"
            description="Podrás observar todas las Órdenes disponibles de la panadería"
            link="/see_orders"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={SearchBy}
            alt="SearchBy"
            title="Buscar Orden"
            description="Podrás acceder a una orden, ya sea por número de teléfono ó nombre del cliente"
            link="/search_orders"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={CreateOrder}
            alt="CreateOrder"
            title="Crear Órdenes"
            description="Podrás crear una Orden de dulces o bizcochos de la panadería"
            link="/create_orders"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={ManageOrder}
            alt="ManageOrder"
            title="Manejar Órdenes"
            description="Podrás eliminar ó editar Órdenes del sistema de la panadería"
            link="/manage_orders"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={Undelivered}
            alt="Undelivered"
            title="Órdenes Entregadas"
            description="Podrás habilitar Órdenes entregadas del sistema de la panadería "
            link="/undelivered_orders"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={Delivered}
            alt="Delivered"
            title="Confirmar Órdenes"
            description="Podrás Marcar como entregadas las Órdenes del sistema de la panadería"
            link="/delivered_orders"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={NotOrder}
            alt="NotOrder"
            title="Órdenes Desactivadas"
            description="Podrás habilitar Órdenes desactivadas del sistema de la panadería "
            link="/activate_orders"
            button="Entrar"
          />
        </div>

        <div className="d-flex justify-content-center">
          <h2>
            <strong>---- Dulces ----</strong>
          </h2>
        </div>
        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={SweetList}
            alt="SweetList"
            title="Lista de Dulces"
            description="Podrás observar todos los dulces disponibles de la panadería"
            link="/see_sweets"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={CreateSweet}
            alt="CreateSweet"
            title="Crear Dulces"
            description="Podrás añadir dulces al menú de la panadería"
            link="/create_sweets"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={ManageSweet}
            alt="ManageSweet"
            title="Manejar Dulces"
            description="Podrás eliminar ó editar dulces del menú de la panadería"
            link="/manage_sweets"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={NotSweet}
            alt="NotSweet"
            title="Dulces Deshabilitados"
            description="Podrás habilitar dulces desactivados del menú de la panadería "
            link="/activate_sweets"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="d-flex justify-content-center">
          <h2>
            <strong>---- Bizcochos ----</strong>
          </h2>
        </div>
        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={CakeList}
            alt="CakeList"
            title="Lista de Bizcochos"
            description="Podrás observar todos los bizcochos disponibles de la panadería"
            link="/see_cakes"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={CreateCake}
            alt="CreateCake"
            title="Crear Bizcocho"
            description="Podrás añadir bizcochos al menú de la panadería"
            link="/create_cakes"
            button="Entrar"
          />
        </div>

        <div className="w-100 d-none d-md-block"></div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={ManageCake}
            alt="ManageCake"
            title="Manejar Bizcochos"
            description="Podrás eliminar ó editar bizcochos del menú de la panadería"
            link="/manage_cakes"
            button="Entrar"
          />
        </div>

        <div className="col-6 col-md-4 align-items-stretch">
          <Card
            img={NotCake}
            alt="NotCake"
            title="Bizcochos Deshabilitados"
            description="Podrás habilitar bizcochos desactivados del menú de la panadería "
            link="/activate_cakes"
            button="Entrar"
          />
        </div>
      </div>
    </div>
  );
};
