import React, { useState } from "react";
import ReadSource from "./ReadSource";
import Papa from "papaparse";

const UploadSource = () => {
  const [sourceName, setSourceName] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  // Stocke le fichier sélectionné url et name
  const handleFileChange = (event) => {
    console.log("handleFileChange");
    const file = event.target.files[0];
    console.log("file.name");
    console.log(file.name);
    setSourceName(file.name);

    setFileUrl(URL.createObjectURL(file));
    console.log("fileUrl");
    console.log(fileUrl);
  };

  // Fonction pour traiter les données lues du fichier Csv
  const handleDataRead = (xlsxData) => {
    console.log("handleDataRead");
    console.log("xlxsData");
    console.log(xlsxData);
    let secondTable = [];

    let row1 = [];
    let row2 = [];
    let row3 = [];
    // xlsxData :
    // xlsxData[i][0]: date
    // xlsxData[i][1]: OD
    // xlsxData[i][2]: Compte
    // xlsxData[i][3]: Ref
    // xlsxData[i][4]: Libellé
    // xlsxData[i][5]: Montant Débit
    // xlsxData[i][6]: Montant Crédit
    // xlsxData[i][7]: à 0, bug contourné pour TVA
    // xlsxData[i][8]: Contrepartie
    // xlsxData[i][9]: Taux TVA

    for (let i = 0; i < xlsxData.length; i++) {
      console.log("Débit xlsxData[i][5]");
      console.log(xlsxData[i][5]);
      console.log("Crédit xlsxData[i][6]");
      console.log(xlsxData[i][6]);
      // Si Montant débit renseigné
      if (
        xlsxData[i][5] !== "" &&
        xlsxData[i][5] !== undefined &&
        xlsxData[i][5] !== null &&
        !isNaN(xlsxData[i][5]) &&
        xlsxData[i][5] !== 0
      ) {
        if (xlsxData[i][9] === 0) {
          // si la TVA lue dans lignesTable est égale à 0
          //    on écrit ligne 1 : date, "OD", Compte, Ref, Libellé, Montant Débit, ""

          row1 = [
            xlsxData[i][0],
            xlsxData[i][1],
            xlsxData[i][2],
            xlsxData[i][3],
            xlsxData[i][4],
            xlsxData[i][5],
            "",
          ];
          //    on écrit ligne 2 : date, "OD", Contrepartie, Ref, Libellé, "", Montant Débit
          row2 = [
            xlsxData[i][0],
            xlsxData[i][1],
            xlsxData[i][8],
            xlsxData[i][3],
            xlsxData[i][4],
            "",
            xlsxData[i][5],
          ];
          console.log("nvelles lignes débit sans TVA");
          console.log("row1");
          console.log(row1);
          secondTable.push(row1);
          console.log("row2");
          console.log(row2);
          secondTable.push(row2);
        } else {
          ////////////////
          // si la TVA lue dans lignesTable est > 0
          //    on écrit ligne 1 : date, "OD", Compte, Ref, Libellé, Montant Débit, ""
          row1 = [
            xlsxData[i][0],
            xlsxData[i][1],
            xlsxData[i][2],
            xlsxData[i][3],
            xlsxData[i][4],
            xlsxData[i][5],
            "",
          ];
          //    on écrit ligne 2 : date, "OD", 445660, Ref, Libellé, Montant Débit * Taux TVA/100 arrondi à 2 décimales, ""
          console.log("xlsxData[i][5]");
          console.log(xlsxData[i][5]);
          console.log("xlsxData[i][9])");
          console.log(xlsxData[i][9]);
          const intermediateValue =
            (parseFloat(xlsxData[i][5]) * parseFloat(xlsxData[i][9])) / 100;
          console.log("intermediateValue:", intermediateValue);
          row2 = [
            xlsxData[i][0],
            xlsxData[i][1],
            "445660",
            xlsxData[i][3],
            xlsxData[i][4],
            parseFloat(intermediateValue.toFixed(2)),
            "",
          ];
          //    on écrit ligne 3 : date, "OD", Contrepartie, Ref, Libellé, "", Montant Débit (1 +  Taux TVA/100 arrondi à 2 décimales)
          row3 = [
            xlsxData[i][0],
            xlsxData[i][1],
            xlsxData[i][8],
            xlsxData[i][3],
            xlsxData[i][4],
            "",

            parseFloat(
              (
                parseFloat(xlsxData[i][5]) +
                (parseFloat(xlsxData[i][5]) * parseFloat(xlsxData[i][9])) / 100
              ).toFixed(2)
            ),
          ];

          console.log("nvelles lignes débit avec TVA");
          console.log("row1");
          console.log(row1);
          secondTable.push(row1);
          console.log("row2");
          console.log(row2);
          secondTable.push(row2);
          console.log("row3");
          console.log(row3);
          secondTable.push(row3);
        }
      }
      // Si Montant Crédit renseigné
      else if (
        xlsxData[i][6] !== "" &&
        xlsxData[i][6] !== undefined &&
        xlsxData[i][6] !== null &&
        !isNaN(xlsxData[i][6]) &&
        xlsxData[i][6] !== 0
      ) {
        if (xlsxData[i][9] === 0) {
          // si la TVA lue dans lignesTable est égale à 0
          //    on écrit ligne 1 : date, "OD", Compte, Ref, Libellé, "", Montant Crédit

          row1 = [
            xlsxData[i][0],
            xlsxData[i][1],
            xlsxData[i][2],
            xlsxData[i][3],
            xlsxData[i][4],
            "",
            xlsxData[i][6],
          ];
          //    on écrit ligne 2 : date, "OD", Contrepartie, Ref, Libellé, Montant Crédit, ""
          row2 = [
            xlsxData[i][0],
            xlsxData[i][1],
            xlsxData[i][8],
            xlsxData[i][3],
            xlsxData[i][4],
            xlsxData[i][6],
            "",
          ];
          console.log("nvelles lignes crédit sans TVA");
          console.log("row1");
          console.log(row1);
          secondTable.push(row1);
          console.log("row2");
          console.log(row2);
          secondTable.push(row2);
        } else {
          ////////////////
          // si la TVA lue dans lignesTable est > 0
          //    on écrit ligne 1 : date, "OD", Compte, Ref, Libellé, "", Montant Crédit
          row1 = [
            xlsxData[i][0],
            xlsxData[i][1],
            xlsxData[i][2],
            xlsxData[i][3],
            xlsxData[i][4],
            "",
            xlsxData[i][6],
          ];
          //    on écrit ligne 2 : date, "OD", 445660, Ref, Libellé, "", Montant Crédit * Taux TVA/100 arrondi à 2 décimales
          console.log("xlsxData[i][6]");
          console.log(xlsxData[i][6]);
          console.log("xlsxData[i][9])");
          console.log(xlsxData[i][9]);
          const intermediateValue =
            (parseFloat(xlsxData[i][6]) * parseFloat(xlsxData[i][9])) / 100;
          console.log("intermediateValue:", intermediateValue);
          row2 = [
            xlsxData[i][0],
            xlsxData[i][1],
            "445660",
            xlsxData[i][3],
            xlsxData[i][4],
            "",
            parseFloat(intermediateValue.toFixed(2)),
          ];
          //    on écrit ligne 3 : date, "OD", Contrepartie, Ref, Libellé, Montant Crédit (1 +  Taux TVA/100 arrondi à 2 décimales), ""
          row3 = [
            xlsxData[i][0],
            xlsxData[i][1],
            xlsxData[i][8],
            xlsxData[i][3],
            xlsxData[i][4],
            parseFloat(
              (
                parseFloat(xlsxData[i][6]) +
                (parseFloat(xlsxData[i][6]) * parseFloat(xlsxData[i][9])) / 100
              ).toFixed(2)
            ),
            "",
          ];

          console.log("nvelles lignes crédit avec TVA");
          console.log("row1");
          console.log(row1);
          secondTable.push(row1);
          console.log("row2");
          console.log(row2);
          secondTable.push(row2);
          console.log("row3");
          console.log(row3);
          secondTable.push(row3);
        }
      }
    }

    console.log("secondTable");
    console.log(secondTable);

    // Générer le fichier CSV
    generateCsv(secondTable);

    return {
      secondTable,
    };
  };

  const generateCsv = (data) => {
    console.log("Génération du fichier csv");
    const csv = Papa.unparse(data);
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const csvURL = window.URL.createObjectURL(csvData);

    const fileName = `PrepComptaTVA${sourceName}.csv`;

    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.setAttribute("download", fileName);
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };

  return (
    <div className="upload-content">
      <div className="upload-head">
        <div className="upload-title">
          <h3>*****************************</h3>
          <h3>FICHIER SOURCE A TRAITER :</h3>
          <h3>*****************************</h3>
        </div>

        <div className="source-name">
          <h3>*****************************</h3>
          <h3>
            {sourceName ? (
              <div>{sourceName}</div>
            ) : (
              <div className="upload-file">
                <input type="file" accept=".xlsx" onChange={handleFileChange} />
              </div>
            )}
          </h3>
        </div>
      </div>
      <div className="liste-content">
        {sourceName && (
          <ReadSource fileUrl={fileUrl} handleDataRead={handleDataRead} />
        )}
      </div>
    </div>
  );
};

export default UploadSource;
