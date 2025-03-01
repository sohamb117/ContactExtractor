import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CsvVisualizer = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState('');
  const [rawCsv, setRawCsv] = useState('');

  useEffect(() => {
    const storedCsvData = sessionStorage.getItem('csvData');
    console.log("Retrieved from sessionStorage:", storedCsvData); // Debug log
    
    if (!storedCsvData) {
      setError('No CSV data found. Please submit the form first.');
      return;
    }
    
    setRawCsv(storedCsvData);
    
    try {
      // Parse CSV data
      const rows = storedCsvData.split('\n');
      console.log("Split rows:", rows); // Debug log
      
      if (rows.length < 2) {
        setError('CSV data has insufficient rows.');
        return;
      }
      
      const headerRow = rows[0].split(',');
      console.log("Header row:", headerRow); // Debug log
      setHeaders(headerRow);
      
      const parsedData = [];
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].trim() === '') continue;
        
        const values = rows[i].split(',');
        console.log(`Row ${i} values:`, values); // Debug log
        
        const rowData = {};
        headerRow.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });
        
        parsedData.push(rowData);
      }
      
      console.log("Parsed data:", parsedData); // Debug log
      setCsvData(parsedData);
    } catch (error) {
      console.error('Error parsing CSV data:', error);
      setError(`Error parsing CSV data: ${error.message}`);
    }
  }, []);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-600 mb-4">{error}</div>
        <div className="p-4 bg-gray-100 rounded mb-4 overflow-auto">
          <h3 className="font-medium mb-2">Raw CSV Data:</h3>
          <pre className="whitespace-pre-wrap">{rawCsv || 'No data'}</pre>
        </div>
        <Link to="/" className="text-blue-600 hover:underline">
          Go back to form
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-6 text-center">CSV Visualization</h1>
      
      {csvData.length === 0 ? (
        <div>
          <div className="p-4 bg-yellow-100 rounded mb-4">
            <p>No data parsed from CSV. Debug information:</p>
            <p>Headers detected: {headers.length > 0 ? headers.join(', ') : 'None'}</p>
            <p>Raw CSV data:</p>
            <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded mt-2 text-sm">{rawCsv || 'Empty'}</pre>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {headers.map((header, index) => (
                  <th key={index} className="py-2 px-4 border-b text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  {headers.map((header, colIndex) => (
                    <td key={colIndex} className="py-2 px-4 border-b">
                      {String(row[header] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline">
          Go back to form
        </Link>
      </div>
    </div>
  );
};

export default CsvVisualizer;
