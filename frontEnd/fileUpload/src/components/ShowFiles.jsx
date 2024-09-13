import React, { useState } from "react";
const url = "http://localhost:5000";

const ShowFiles = () => {
  const [files, setFiles] = useState([]);

  useState(() => {
    fetch(`${url}/files`)
      .then((res) => res.json())
      .then((data) => setFiles(data));
  }, []);

  return (
    <div>
      <h2>Show uploaded files__</h2>
      <div className="container">
        {files.map((file) => (
          <div key={file._id}>
            <p>{file.filename}</p>
            <img src={`${url}/${file.path}`} alt={file.filename} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowFiles;
