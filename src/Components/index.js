import React, { useState } from "react";
import XLSX from "xlsx";
import axios from "axios";
import "./style.scss";

function ExcelToJson() {
  const [file, setFile] = useState({});
  const [status, setStatus] = useState("");

  function handleChange(e) {
    const files = e.target.files[0];
    setFile(files);
  }

  function handleFile() {
    // const { file } = this.state;
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;

      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true
      });

      /* Get first worksheet */
      //This const only read the first excelSheet
      const wsname = wb.SheetNames[0];

      //This const reads the excelData
      const ws = wb.Sheets[wsname];

      /* Converting the data into array object */
      const data = XLSX.utils.sheet_to_json(ws);
      console.log(data);

      data.map(async unique => {
        const response = await axios
          .post("http://localhost:3000/api/point", {
            x: unique["X"],
            y: unique["Y"],
            text: unique["NORMALIZED ADDRESS"],
            brand: unique["MERCHANT"].toLowerCase(),
            marker: unique["MARKER"]
          })
          .then(response => {
            setStatus("success");
          })
          .catch(error => {
            if (error.response) {
              setStatus(`Error ${error.request.status}. ¡Volvé a intentarlo!`);
            } else if (error.request) {
              setStatus(`Error ${error.request.status}. ¡Volvé a intentarlo!`);
            } else {
              setStatus("Error. ¡Volvé a intentarlo!");
            }
          });
      });
    };

    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }

  const Types = ["xlsx", "xls"]
    .map(function (x) {
      return "." + x;
    })
    .join(",");

  const { name } = file;

  return (
    <div className="converter">
      <p>Carga de archivo</p>
      <input type="file" id="file" accept={Types} onChange={handleChange} />
      <label htmlFor="file">Upload File</label>
      {name === undefined ? <p>No hay archivo disponible</p> : <p>{name}</p>}
      <br />
      <button className="button" onClick={handleFile}>
        MAPA
      </button>
      {status && status == "success" ? (
        <p className="success">¡Carga exitosa!</p>
      ) : (
        <p className="error">{status}</p>
      )}
    </div>
  );
}

export default ExcelToJson;
