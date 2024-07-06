import React from 'react';

function FileUpload({ onFileRead }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        onFileRead(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <input type="file" onChange={handleFileChange} />
  );
}

export default FileUpload;
