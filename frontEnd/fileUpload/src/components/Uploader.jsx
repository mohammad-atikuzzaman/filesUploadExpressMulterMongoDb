import React, { useState } from "react";
import Swal from "sweetalert2";

const Uploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      return alert("File Upload successful");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (result.message === "File uploaded successfully") {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your File Has bean uploaded",
        showConfirmButton: false,
        timer: 1500,
      });
      e.target.reset()
    }
  };

  return (
    <div>
      <h1>Upload a File</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Uploader;
