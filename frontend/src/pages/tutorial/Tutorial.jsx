import "./tutorial.css";
import TutorialEmbed from "../../components/tutorialEmbed/TutorialEmbed";


// Jaime
// Function that allows the user see the tutorials of the page
// Returns the respective components for rendering the user interface
export const Tutorial = () => {
  return (
    <div className="wrapper">
      <div className="row">
        <div className="d-flex justify-content-center">
          <h2>
            <strong>---- Tutorial de Usuarios ----</strong>
          </h2>
        </div>
        <div className="col-6 col-md-4 align-items-stretch">
          <TutorialEmbed embedId="s8EZcbid8xo" />
        </div>
        <div className="d-flex justify-content-center">
          <h2>
            <strong>---- Tutorial de Órdenes ----</strong>
          </h2>
        </div>
        <div className="col-6 col-md-4 align-items-stretch">
          <TutorialEmbed embedId="77jBukfhxPQ" />
        </div>
        <div className="d-flex justify-content-center">
          <h2>
            <strong>---- Tutorial del Menú ----</strong>
          </h2>
        </div>
        <div className="col-6 col-md-4 align-items-stretch">
          <TutorialEmbed embedId="ry8IQUmYpuk" />
        </div>
      </div>
    </div>
  );
};
