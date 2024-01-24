import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setLoading(true);

      const formData = new FormData();
      formData.append('image_file', selectedFile);

      try {
        const response = await fetch('http://localhost:8000/uploadfile/', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const resultsArray = Object.entries(data.results).map(([link, result]) => ({
            title: result.title,
            price: result.price,
            supports_bnpl: result.supports_bnpl,
            link: link,
          }));
          setResults(resultsArray);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
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

              {loading && <p>Loading...</p>}

              {results && (
                <div className="mt-4">
                  <h3>Results:</h3>
                  <ul className="list-group">
                    {results.map((result, index) => (
                      <li key={index} className="list-group-item">
                        <strong>Title:</strong> {result.title}<br />
                        <strong>Price:</strong> {result.price}<br />
                        <strong>Supports Affirm:</strong> {result.supports_bnpl ? 'Yes' : 'No'}<br />
                        <a href={result.link} target="_blank" rel="noopener noreferrer">
                          View Details
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
