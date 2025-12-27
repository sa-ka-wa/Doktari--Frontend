import React from "react";
import "./CulturalStory.css";

const stories = [
  {
    title: "The Beat of the Drums",
    image:
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=300&fit=crop",
    description:
      "Every stitch carries rhythm — the heartbeat of African drums that unite people across borders and tribes. Our T-shirts echo that timeless beat.",
  },
  {
    title: "Masks of Identity",
    image:
      "https://images.unsplash.com/photo-1580136579317-57c3d61cce84?w=400&h=300&fit=crop",
    description:
      "Traditional masks inspire our patterns — representing strength, wisdom, and the power of self-expression that defines Afrobeat fashion.",
  },
  {
    title: "Colors of Celebration",
    image:
      "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=400&h=300&fit=crop",
    description:
      "Our designs blend earth tones and vibrant hues — celebrating festivals, freedom, and the creative chaos that fuels Afrobeat culture.",
  },
];

const CulturalStory = () => {
  return (
    <section className="cultural-story">
      <h2>Our Cultural Story</h2>
      <div className="story-grid">
        {stories.map((story, index) => (
          <div key={index} className="story-card">
            <img src={story.image} alt={story.title} className="story-img" />
            <div className="story-text">
              <h3>{story.title}</h3>
              <p>{story.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CulturalStory;
