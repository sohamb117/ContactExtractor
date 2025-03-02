import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { submit_to_gc } from '../api/api';

const CsvVisualizer = () => {
  const [contactData, setContactData] = useState({
    'Name Prefix': '',
    'First Name': '',
    'Middle Name': '',
    'Last Name': '',
    'Name Suffix': '',
    'Email 1 - Value': '',
    'Phone 1 - Value': '',
    'Organization Name': '',
    'Organization Title': '',
    'Organization Department': ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Define the complete set of expected headers in the correct order
  const expectedHeaders = [
    'Name Prefix', 'First Name', 'Middle Name', 'Last Name', 'Name Suffix', 
    'Phonetic First Name', 'Phonetic Middle Name', 'Phonetic Last Name', 
    'Nickname', 'File As', 'Email 1 - Label', 'Email 1 - Value', 
    'Phone 1 - Label', 'Phone 1 - Value', 'Address 1 - Label', 
    'Address 1 - Country', 'Address 1 - Street', 'Address 1 - Extended Address', 
    'Address 1 - City', 'Address 1 - Region', 'Address 1 - Postal Code', 
    'Address 1 - PO Box', 'Organization Name', 'Organization Title', 
    'Organization Department', 'Birthday', 'Event 1 - Label', 'Event 1 - Value', 
    'Relation 1 - Label', 'Relation 1 - Value', 'Website 1 - Label', 
    'Website 1 - Value', 'Custom Field 1 - Label', 'Custom Field 1 - Value', 
    'Notes', 'Labels'
  ];

  // Define the fields we want to display in the form
  const displayFields = [
    'First Name', 'Middle Name', 'Last Name', 'Name Prefix', 'Name Suffix',
    'Email 1 - Value', 'Phone 1 - Value', 'Organization Name', 'Organization Title',
    'Organization Department'
  ];

  useEffect(() => {
    const storedCsvData = sessionStorage.getItem('csvData');
    
    if (!storedCsvData) {
      setError('No CSV data found. Please submit the form first.');
      return;
    }
    
    try {
      // Parse CSV data
      let rows = storedCsvData.split('\n').filter(row => row.trim() !== '');
      
      // Check if headers are present
      /*
      const hasHeaders = rows[0] && (
        rows[0].includes('First Name') || 
        rows[0].includes('Last Name') || 
        rows[0].includes('Email')
      );*/
      
      // If no headers, add them
      /*
      if (!hasHeaders) {
        rows = [expectedHeaders.join(','), ...rows];
      }
      */
    
      
      if (rows.length < 2) {
        rows = [expectedHeaders.join(','), ...rows];
        console.log(rows);
        /*
        setError('CSV data has insufficient rows. Please ensure your CSV has at least one data row.');
        return;*/
      }
      
      // Parse the CSV rows
      const parseCSVLine = (line) => {
        const result = [];
        let inQuotes = false;
        let currentField = '';
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(currentField.trim());
            currentField = '';
          } else {
            currentField += char;
          }
        }
        
        // Don't forget the last field
        result.push(currentField.trim());
        console.log("Result: ", result);
        return result;
      };
      
      const headerRow = parseCSVLine(rows[0]);
      const dataRow = parseCSVLine(rows[1]);
      
      // Create a map of the CSV data
      const dataMap = {};
      headerRow.forEach((header, index) => {
        const trimmedHeader = header.trim();
        if (trimmedHeader) { // Only add non-empty headers
          dataMap[trimmedHeader] = index < dataRow.length ? dataRow[index] : '';
        }
      });
      console.log(dataMap);
      
      // Extract only the fields we want to display
      const extractedData = {};
      displayFields.forEach(field => {
        extractedData[field] = dataMap[field] || '';
      });
      
      setContactData(extractedData);
    } catch (error) {
      console.error('Error parsing CSV data:', error);
      setError(`Error parsing CSV data: ${error.message}`);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setContactData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Submit the contact data to the API
      const response = await submit_to_gc(contactData);
      
    } catch (error) {
      console.error('Error submitting contact:', error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-600 mb-4">{error}</div>
        <Link to="/" className="text-blue-600 hover:underline">
          Go back to form
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-6 text-center">Edit Contact Information</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="namePrefix" className="block text-sm font-medium text-gray-700 mb-1">
              Name Prefix
            </label>
            <input
              type="text"
              id="namePrefix"
              value={contactData['Name Prefix'] || ''}
              onChange={(e) => handleInputChange('Name Prefix', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={contactData['First Name'] || ''}
              onChange={(e) => handleInputChange('First Name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
              Middle Name
            </label>
            <input
              type="text"
              id="middleName"
              value={contactData['Middle Name'] || ''}
              onChange={(e) => handleInputChange('Middle Name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={contactData['Last Name'] || ''}
              onChange={(e) => handleInputChange('Last Name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="nameSuffix" className="block text-sm font-medium text-gray-700 mb-1">
            Name Suffix
          </label>
          <input
            type="text"
            id="nameSuffix"
            value={contactData['Name Suffix'] || ''}
            onChange={(e) => handleInputChange('Name Suffix', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Contact Info */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={contactData['Email 1 - Value'] || ''}
            onChange={(e) => handleInputChange('Email 1 - Value', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={contactData['Phone 1 - Value'] || ''}
            onChange={(e) => handleInputChange('Phone 1 - Value', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Organization Info */}
        <div>
          <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-1">
            Organization Name
          </label>
          <input
            type="text"
            id="orgName"
            value={contactData['Organization Name'] || ''}
            onChange={(e) => handleInputChange('Organization Name', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="orgTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Title
            </label>
            <input
              type="text"
              id="orgTitle"
              value={contactData['Organization Title'] || ''}
              onChange={(e) => handleInputChange('Organization Title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="orgDept" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Department
            </label>
            <input
              type="text"
              id="orgDept"
              value={contactData['Organization Department'] || ''}
              onChange={(e) => handleInputChange('Organization Department', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isLoading ? 'Submitting...' : 'Submit Contact'}
          </button>
          
          <Link 
            to="/" 
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded text-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CsvVisualizer;