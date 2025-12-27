import React from "react";
import "./MusicHero.css";

export default function MusicHero() {
  return (
    <section className="music-hero">
      <div className="overlay"></div>
      <img
        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop"
        alt="Afrobeat Culture"
        className="hero-image"
      />
      <div className="hero-content">
        <h1 className="hero-title">DOKTARI WEAR</h1>
        <p className="hero-subtitle">
          Where rhythm meets fabric — Afrobeat streetwear inspired by icons.
        </p>
        <button className="explore-btn">Explore Collection</button>
      </div>
    </section>
  );
}
