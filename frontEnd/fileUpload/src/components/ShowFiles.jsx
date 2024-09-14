import React, { useState } from "react";
import Swal from "sweetalert2";

const url = "https://silver-loops-learn.loca.lt";
// const url = "http://localhost:5000";

const ShowFiles = () => {
  const [files, setFiles] = useState([]);
  const fetchData = () => {
    fetch(`${url}/files`)
      .then((res) => res.json())
      .then((data) => setFiles(data));
  };

  useState(() => {
    fetchData();
  }, []);

  const handleDelete = (file) => {
    console.log(file);
    fetch(`${url}/delete/${file}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.message === "File deleted successfully") {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your File Has bean deleted",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchData();
        }
      });
  };

  return (
    <div>
      <h2>Show uploaded files__</h2>
      <div className="container">
        {files.map((file) => (
          <div key={file._id} className="card">
            <p>{file.filename}</p>
            <img src={`${url}/${file.path}`} alt={file.filename} />
            <button
              onClick={() => handleDelete(file.filename)}
              className="btn-del">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowFiles;
