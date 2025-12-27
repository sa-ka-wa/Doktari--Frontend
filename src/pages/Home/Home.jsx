import React, { useEffect, useState } from "react";
import "./Home.css";
import { Header } from "../../components/common/layout"; // shared import
// Correct import paths - adjust based on your actual folder structure
import MusicHero from "../../components/brand/MusicHero/MusicHero";
import ArtistSpotlight from "../../components/brand/ArtistSpotlight/ArtistSpotlight";
import AlbumCollection from "../../components/brand/AlbumCollection/AlbumCollection";
import CulturalStory from "../../components/brand/CulturalStory/CulturalStory";

const Home = () => {
  const [brand, setBrand] = useState("Doktari");
  useEffect(() => {
    // 1️⃣ Detect current subdomain
    const hostname = window.location.hostname;
    const subdomain = hostname.split(".")[0]; // e.g. 'doktari' from 'doktari.lvh.me'

    console.log("Detected subdomain:", subdomain);

    // 2️⃣ Send to backend if detected
    if (subdomain && subdomain !== "www" && subdomain !== "localhost") {
      fetch("http://localhost:5000/api/brands/update-subdomain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subdomain }),
      })
        .then((res) => res.json())
        .then((data) => console.log("Subdomain saved:", data))
        .catch((err) => console.error("Error saving subdomain:", err));
    }
  }, []);

  return (
    <div className="home">
      {/* Shared Header */}
      <Header brand="Doktari" />

      {/* Hero Section */}
      <MusicHero />

      {/* Artist Spotlight */}
      <section className="section">
        <h2 className="section-title">Artist Spotlight</h2>
        <ArtistSpotlight />
      </section>

      {/* Album Collection */}
      <section className="section">
        <h2 className="section-title">Limited Edition Collections</h2>
        <AlbumCollection />
      </section>

      {/* Cultural Story */}
      <section className="section">
        <h2 className="section-title">The DOKTARI Story</h2>
        <CulturalStory />
      </section>
    </div>
  );
};

export default Home;
