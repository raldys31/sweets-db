import React from "react";
import PropTypes from "prop-types";

// Jaime
// Function that manages the rendering of a youtube videos tutorials
// Returns a card with its respective properties
const TutorialEmbed = ({ embedId }) => (
  <div className="video-responsive">
    <iframe
      width="853"
      height="480"
      src={`https://www.youtube-nocookie.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
      
    />
  </div>
);

TutorialEmbed.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default TutorialEmbed;