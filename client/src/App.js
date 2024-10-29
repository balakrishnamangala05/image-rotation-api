import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [angle, setAngle] = useState(90);
  const [filename, setFilename] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      setFilename(response.data.filename);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading the image', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/download/${filename}/${angle}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rotated_${angle}_${filename}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the image', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Image Upload and Processed Download Image</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} className="upload-button">Upload Image</button>

      {filename && (
        <>
          <h3>Select Rotation Angle:</h3>
          <select value={angle} onChange={(e) => setAngle(e.target.value)} className="angle-selector">
            <option value={90}>90 degrees</option>
            <option value={180}>180 degrees</option>
            <option value={270}>270 degrees</option>
            <option value={360}>360 degrees</option>
          </select>
          <button onClick={handleDownload} className="download-button">Download Rotated Image</button>
        </>
      )}
    </div>
  );
}

export default App;
