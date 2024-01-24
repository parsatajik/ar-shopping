import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image_file', selectedFile);

      try {
        const response = await fetch('http://localhost:8000/uploadfile/', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setResults(data.results);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Image Upload and Results</h2>
              <input type="file" onChange={handleFileChange} className="form-control mb-3" />
              <button onClick={handleUpload} className="btn btn-primary">
                Upload
              </button>

              {results && (
                <div className="mt-4">
                  <h3>Results:</h3>
                  <ul className="list-group">
                    {Object.entries(results).map(([link, title]) => (
                      <li key={link} className="list-group-item">
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
