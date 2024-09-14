import React, { useState } from "react";
import Swal from "sweetalert2";

const Uploader = () => {
  // const url ="http://localhost:5000"
  const url = "https://silver-loops-learn.loca.lt";
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!file) {
      return Swal.fire({
        position: "center",
        icon: "error",
        title: "Please select a file",
      });
    }

    Swal.fire({
      position: "center",
      icon: "info",
      title: "Please wait",
      showConfirmButton: false,
    });

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${url}/upload`, {
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
      setLoading(false);
      e.target.reset();
    }
  };

  return (
    <div>
      <h1>Upload a File</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" onChange={handleFileChange} />
        <button type="submit">{loading ? "Loading..." : "Upload"}</button>
      </form>
    </div>
  );
};

export default Uploader;
