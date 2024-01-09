import { useEffect, useCallback } from "react";
import * as XLSX from "xlsx";

const ReadSource = ({ fileUrl, handleDataRead }) => {
  console.log("ReadSource");
  console.log("fileUrl : " + fileUrl);

  const readExcelFile = useCallback(
    (url) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";

      xhr.onload = (e) => {
        const arraybuffer = xhr.response;
        const data = new Uint8Array(arraybuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir le contenu de la feuille en tableau JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: 0,
          defval: "", // Remplacer les valeurs null par une chaîne vide par défaut
        });

        console.log("******** JSON **********");
        console.log(jsonData);
        // Récupérer la valeur de la colonne d'index 7 (TVA) dans une variable d'état
        const tvaColumnValue = jsonData.map((row) =>
          row["TauxTVA"] !== undefined ? row["TauxTVA"] : ""
        );
        console.log("tvaColumnValue");
        console.log(tvaColumnValue);

        //Alimenter le tableau donneesSource avec les données du fichier Excel
        let donneesSource = jsonData.map((row) =>
          Object.values(row).map((value) => (value !== undefined ? value : ""))
        );
        // Ajouter tvaColumnValue aux données
        donneesSource.forEach((row, index) => {
          row.push(tvaColumnValue[index]);
        });
        console.log("donneesSource AVANT");
        console.log(donneesSource);
        const formattedData = donneesSource.map((row) =>
          Object.entries(row).map(([key, cell], columnIndex) => {
            if (columnIndex === 0 && isDateCell(cell, columnIndex)) {
              return convertToFormattedDate(cell, columnIndex);
            } else if (columnIndex === 2 || columnIndex === 8) {
              return cell.toString(); // Traiter les colonnes d'index 2 et 8 comme du texte
            } else {
              return cell; // Pour les autres colonnes, copier telle quelle
            }
          })
        );
        // Appeler la fonction fournie pour transmettre les données à un autre composant
        console.log("formattedData APRES");
        console.log(formattedData);

        handleDataRead(formattedData);
      };

      xhr.send();
    },
    [handleDataRead]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log("ReadSource - useEffect called");
    console.log("fileUrl : " + fileUrl);
    if (fileUrl) {
      readExcelFile(fileUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl]);

  const isDateCell = (value, columnIndex) => {
    // Vérifier si la valeur est un nombre (format de numéro de série pour les dates)
    if (columnIndex === 0 && typeof value === "number") {
      // Utiliser une méthode de JavaScript pour vérifier si la valeur est une date valide
      const dateObject = new Date((value - 1) * 24 * 60 * 60 * 1000);
      return !isNaN(dateObject.getTime());
    }
    return false;
  };

  const convertToFormattedDate = (value, columnIndex) => {
    // Convertir le numéro de série en date format JJ/MM/YYYY
    if (columnIndex === 0) {
      const dateObject = new Date((value - 25569) * 86400 * 1000); // 25569 est l'offset pour le 1er janvier 1970
      const day = dateObject.getDate();
      const month = dateObject.getMonth() + 1;
      const year = dateObject.getFullYear();
      return `${day}/${month}/${year}`;
    }
  };
  // Ce composant n'affiche rien à l'écran
  return null;
};

export default ReadSource;
