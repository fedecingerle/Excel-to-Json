import React, { useState } from "react";
import XLSX from "xlsx";
import { array } from "./array";
import { Types } from "./excelType";
import axios from "axios";

class ExcelToJson extends React.Component {
  // const [file, setFile] = useState({});
  // const [data, setData] = useState([]);
  // const [cols, setCols] = useState([]);

  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: []
    };
  }

  handleChange(e) {
    const files = e.target.files;
    console.log(files);
    // setFile({ file: file[0] });
    this.setState({ file: files[0] });
  }

  handleFile() {
    const { file } = this.state;
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

      console.log(123, wb);

      /* Get first worksheet */
      //This const only read the first excelSheet
      const wsname = wb.SheetNames[0];
      console.log(345, wsname);

      //This const reads the excelData
      const ws = wb.Sheets[wsname];
      console.log(567, ws);

      /* Converting the data into array object */
      const data = XLSX.utils.sheet_to_json(ws);
      console.log(8910, data);

      /* Update state */
      // this.setState({ data: data, cols: array(ws["!ref"]) }, () => {
      //   console.log(JSON.stringify(data, null, 2));
      // });

      data.map(async unique => {
        const data = await axios.post(
          "localhost:3000/api/point",
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods":
                "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }
          },
          {
            x: unique["X"],
            y: unique["Y"],
            text: unique["NORMALIZED ADRESS"],
            brand: unique["MERCHANT"].toLowerCase(),
            marker:
              "https://digiventures-whitelabel.s3.amazonaws.com/whitelabel/Columbia/benefit/gotas/Gota+restaurantes-contactless.png"
          }
        );
        console.log(data);
      });
    };

    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }
  render() {
    return (
      <div>
        <h3>Carga de archivo</h3>
        <br />
        <input
          type="file"
          className="form-control"
          id="file"
          accept={Types}
          // onChange={handleChange}
          onChange={this.handleChange.bind(this)}
        />
        <br />
        <button
          onClick={this.handleFile.bind(this)}
          // onClick={handleFile}
        >
          MAPA
        </button>
      </div>
    );
  }
}

export default ExcelToJson;
