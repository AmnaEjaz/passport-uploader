import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './FileUpload.css';

const apiUrl = process.env.REACT_APP_API_URL;
const wsUrl = process.env.REACT_APP_WEBSOCKET_URL;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [extracting, setExtracting] = useState(false);

  let wsConnection = null;

  const connectWebSocket = (socketId) => {
    const url = `${wsUrl}?key=${socketId}`;
    wsConnection = new WebSocket(url);

    wsConnection.onopen = () => {
      console.log('WebSocket Connected!');
      setExtracting(true);
    };

    wsConnection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.dateOfBirth && data.expiryDate) {
        setStatus(
          `Date of Birth: ${data.dateOfBirth}\nExpiry Date: ${data.expiryDate}`
        );
      } else {
        setStatus('Invalid Image');
      }

      wsConnection.close();
      setExtracting(false);
    };

    wsConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
      setExtracting(false);
    };

    wsConnection.onclose = () => {
      console.log('WebSocket connection closed');
    };

    console.log('WebSocket connection established: ', wsConnection);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && !ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setMessage('Invalid file type. Only JPEG and PNG images are allowed.');
      setFile(null);
      setStatus('');
      return;
    }

    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      setMessage('File is too large. Maximum size is 5MB.');
      setFile(null);
      setStatus('');
      return;
    }

    setMessage('');
    setFile(selectedFile);
    setStatus('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('Please select a valid file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setMessage('');

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setMessage('File uploaded successfully.');
        console.log('Got SocketID: ', response.data.socketId);
        connectWebSocket(response.data.socketId);
      } else {
        setMessage('Error: Unable to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Passport Image</h2>
      <form onSubmit={handleSubmit}>
        <p>Only JPEG and PNG images are allowed. Maximum size is 5MB.</p>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !file}>
          {loading ? <ClipLoader size={20} color={'#ffffff'} /> : 'Upload'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      {loading && <ClipLoader size={20} color={'#ffffff'} />}
      {extracting && (
        <p className="extracting-info">
          <ClipLoader size={20} color={'#000000'} /> Extracting info from
          image...
        </p>
      )}
      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default FileUpload;
