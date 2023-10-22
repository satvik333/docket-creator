import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    hoursWorked: '',
    ratePerHour: '',
    supplierName: '',
    purchaseOrder: '',
    description: ''
  });

  const [supplierOptions, setSupplierOptions] = useState([]);
  const [purchaseOrderOptions, setPurchaseOrderOptions] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [dockets, setDockets] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch dockets
      const docketResponse = await fetchDockets();
      setDockets(docketResponse.dockets);

      // Fetch suppliers
      const data = await fetchFileData();
      if (data && Array.isArray(data)) {
        data.forEach((ele, index) => {
          ele.index = index;
        });
        setJsonData(data);

        const uniqueSuppliers = [...new Set(data.map((item) => item.supplier))];

        const supplierOptions = uniqueSuppliers.map((name, index) => ({
          supplierNumber: index,
          supplierName: name,
        }));

        setSupplierOptions(supplierOptions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDockets = async () => {
    const response = await fetch('http://localhost:4000/getdockets');
    return await response.json();
  };

  const fetchFileData = async () => {
    const response = await fetch('http://localhost:4000/readFile');
    return await response.json();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'supplierName' && value) {
      const poOptions = jsonData.filter(item => item.supplier === value);
      setPurchaseOrderOptions(poOptions);
    }

    if (name === 'purchaseOrder' && value) {
      const selectedItem = purchaseOrderOptions.find(item => item.index == value);

      if (selectedItem) {
        const purchaseOrder = selectedItem.poNumber;
        const description = selectedItem.description;

        setFormData({
          ...formData,
          purchaseOrder,
          description
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/adddocket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Docket created successfully');
      } else {
        console.error('Failed to create docket:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating docket:', error);
    }
    setShowForm(false);
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      hoursWorked: '',
      ratePerHour: '',
      supplierName: '',
      purchaseOrder: '',
      description: ''
    });

    const docketResponse = await fetchDockets();
    setDockets(docketResponse.dockets);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const closeForm = () => {
    setShowForm(!showForm);
  }

  return (
    <div>
      <div className="app-container">
        <button onClick={toggleForm}>Add Docket</button>
        {showForm && (
          <div className="popup-form">
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </label>
              <br />
              <label>
                Start Time:
                <input type="date" name="startTime" value={formData.startTime} onChange={handleChange} />
              </label>
              <br />
              <label>
                End Time:
                <input type="date" name="endTime" value={formData.endTime} onChange={handleChange} />
              </label>
              <br />
              <label>
                No of Hours Worked:
                <input type="text" name="hoursWorked" value={formData.hoursWorked} onChange={handleChange} />
              </label>
              <br />
              <label>
                Rate per Hour:
                <input type="text" name="ratePerHour" value={formData.ratePerHour} onChange={handleChange} />
              </label>
              <br />
              <label>
                Supplier Name:
                <select
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Supplier</option>
                  {supplierOptions.map((option) => (
                    <option key={option.supplierNumber} value={option.supplierName}>
                      {option.supplierName}
                    </option>
                  ))}
                </select>
              </label>
              <br/>
              <label>
                Purchase Order:
                <select
                  name="purchaseOrder"
                  value={formData.purchaseOrder}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Purchase Order</option>
                  {purchaseOrderOptions.map((option) => (
                    <option key={option.index} value={option.index}>
                      {option.poNumber}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              {formData.description && (
                <h4>
                  PO Number: {formData.purchaseOrder}
                </h4>
              )}
              {formData.description && (
                <h4>
                  Description: {formData.description}
                </h4>
              )}
              <button type="submit">Submit</button>
              <button onClick={closeForm}>Close</button>
            </form>
          </div>
        )}
      </div>

    <div className="dockets-container">
        <h2>Dockets</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Hours Worked</th>
              <th>Rate per Hour</th>
              <th>Supplier Name</th>
              <th>Purchase Order</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {dockets.map((docket) => (
              <tr key={docket._id}>
                <td>{docket.name}</td>
                <td>{docket.startTime}</td>
                <td>{docket.endTime}</td>
                <td>{docket.hoursWorked}</td>
                <td>{docket.ratePerHour}</td>
                <td>{docket.supplierName}</td>
                <td>{docket.purchaseOrder}</td>
                <td>{docket.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
