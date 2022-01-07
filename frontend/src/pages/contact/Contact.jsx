import "./contact.css";
import emailjs from "emailjs-com";
import React, {useState} from "react";
import MessageModal from "../../components/modals/MessageModal";


// Jaime
// Function that allows the user contact the team RGJJ Solutions
// Returns the respective components for rendering the user interface
export const Contact = () => {
  
  // Variables to handle errors with a modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [messageTitle, setMessageTitle] = useState("");
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);

  function sendEmail(e) {
    e.preventDefault();

    //emailjs credentials id
    emailjs
      .sendForm(
        "rgjj_gmail",
        "rgjj_solutions",
        e.target,
        "user_DS8xu6Yr6Q0rFoKoiaPWX"
      )
      .then(
       
        (result) => {
          setMessageTitle("Confirmación")
          setMessage("El Mensaje ha sido enviado correctamente. El equipo RGJJ Solutions se estará comunicando pronto.")
          setModal(true)
          handleShow()
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  }

  return (
    <div className="contact">
      <div className="container">
        <form onSubmit={sendEmail}>
          <div className="row pt-5 mx-auto">
            <div className="d-flex justify-content-center">
              <h2>
                <strong>---- Formulario de dudas ----</strong>
              </h2>
            </div>
            <div className="col-8 form-group mx-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                name="name"
              />
            </div>
            <div className="col-8 form-group pt-2 mx-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Problema"
                name="subject"
              />
            </div>
            <div className="col-8 form-group pt-2 mx-auto">
              <textarea
                className="form-control"
                id=""
                cols="30"
                rows="8"
                placeholder="Mensaje"
                name="message"
              ></textarea>
            </div>
            <div className="col-8 pt-3 mx-auto">
              <input
                type="submit"
                className="btn btn-primary w-100"
                value="Enviar"
                onSubmit={() => console.log('hola')}
              ></input>
            </div>
          </div>
        </form>
      </div>
      {/* Popup for Confirmation */}
      {modal && <MessageModal show={showModal} onClose={handleClose} title={messageTitle} message={message} onHide={handleClose} />}
    </div>
  );
};
