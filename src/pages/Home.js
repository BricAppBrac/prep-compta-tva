import React, { useEffect } from "react";
import UploadSource from "../components/UploadSource";

const Home = () => {
  useEffect(() => {
    // Défilement vers le haut de la page au chargement
    window.scrollTo(0, 0);
  }, []);

  const handleHome = () => {
    console.log("handleHome");
    window.location.reload();
  };

  let content = (
    <div className="home">
      <div className="home-title">
        <h1>INTEGRATION XLS COMPTA</h1>
        <button onClick={handleHome}>
          <i className="fa-solid fa-house"></i>
        </button>
      </div>
      <h2>******************************************</h2>
      <div className="home-content">
        <div className="select-fichier-source">
          <UploadSource />
        </div>
      </div>
      <div className="home-generate-doc"></div>
    </div>
  );

  return content;
};

export default Home;
