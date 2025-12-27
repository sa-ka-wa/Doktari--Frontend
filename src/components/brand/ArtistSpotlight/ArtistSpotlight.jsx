import React from "react";
import "./ArtistSpotlight.css";

const artists = [
  {
    name: "Fela Kuti",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=500&fit=crop",
    quote: "Music is the weapon of the future.",
    story:
      "The father of Afrobeat — fearless, political, and revolutionary. His energy inspires our boldest T-shirt statements.",
  },
  {
    name: "Burna Boy",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=500&fit=crop",
    quote: "I'm just here to inspire African youth to believe in themselves.",
    story:
      "Burna's fusion of modern sound and traditional rhythm inspires our new-age streetwear — unapologetically African.",
  },
  {
    name: "Wizkid",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=500&fit=crop",
    quote: "Africa to the world.",
    story:
      "Wizkid's calm yet powerful artistry embodies the minimalist yet expressive side of Afrobeat fashion.",
  },
];

const ArtistSpotlight = () => {
  return (
    <section className="artist-spotlight">
      <h2>Artist Spotlight</h2>
      <div className="artist-grid">
        {artists.map((artist, index) => (
          <div key={index} className="artist-card">
            <div className="artist-img-wrapper">
              <img src={artist.image} alt={artist.name} />
            </div>
            <div className="artist-info">
              <h3>{artist.name}</h3>
              <blockquote>"{artist.quote}"</blockquote>
              <p>{artist.story}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArtistSpotlight;
