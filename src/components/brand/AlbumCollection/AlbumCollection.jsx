import React from "react";
import "./AlbumCollection.css";

const albums = [
  {
    title: "Fela Soul",
    artist: "Fela Kuti",
    image:
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
    description:
      "Vintage rhythm meets rebellion – inspired by Fela Kuti's Afrobeat legacy.",
  },
  {
    title: "African Giant",
    artist: "Burna Boy",
    image:
      "https://images.unsplash.com/photo-1571974599782-87624638275f?w=300&h=300&fit=crop",
    description:
      "Loud. Proud. African. A bold design inspired by Burna's iconic energy.",
  },
  {
    title: "Essence",
    artist: "Wizkid",
    image:
      "https://images.unsplash.com/photo-1571330661649-5c0cf0b72bfd?w=300&h=300&fit=crop",
    description: "Smooth tones and streetwear rhythm — calm yet iconic.",
  },
];

const AlbumCollection = () => {
  return (
    <section className="album-collection">
      <h2>Album-Inspired Tees</h2>
      <div className="album-grid">
        {albums.map((album, index) => (
          <div key={index} className="album-card">
            <img src={album.image} alt={album.title} />
            <div className="album-info">
              <h3>{album.title}</h3>
              <p>{album.artist}</p>
              <p className="desc">{album.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlbumCollection;
