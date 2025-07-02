import React, { useState, useEffect } from 'react';
import AddPlant from './AddPlant'; // Adjust path if needed
import UpdatePlant from './UpdatePlant'; // Import your UpdateUser component
import './plants.css';
import { Axios } from '../../AxiosBuilder';

const Plants = ({ activeTab }) => {
  //const [plants, setPlants] = useState([]);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
  const [isUpdatePlantModalOpen, setIsUpdatePlantModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [plants, setPlants] = useState([
    { id: 1, name: 'Tomato',description: 'Tomato is a warm-season crop.', temperature: '20-25°C', humidity: '60%',moisture: 'Medium',nitrogen: 'High',phosphorus: 'Medium', potassium: 'High',image: 'https://via.placeholder.com/100?text=Tomato',},
    { id: 2, name: 'Rice' },
    { id: 3, name: 'Ginger' },
    { id: 4, name: 'Orchid' },
  ]);  

  const handleAddPlantClick = () => {
    setIsAddPlantModalOpen(true);
  };

  const handleCloseAddPlantModal = () => {
    setIsAddPlantModalOpen(false);
    };
    
  const handlePlantClick = (plant) => {
     setSelectedPlant(plant);
     setIsDetailModalOpen(true);
    }; 
    
  const handleUpdatePlant = () => {
      setPlants(prev =>
        prev.map(p => (p.id === selectedPlant.id ? selectedPlant : p))
      );
      setIsUpdatePlantModalOpen(false);
      setSelectedPlant(null);
  };
  

const handleCloseDetailModal = () => {
    setSelectedPlant(null);
    setIsDetailModalOpen(false);
    };

//   const handleSavePlant = async (userDetails) => {
//     try {
//       const response = await Axios.post(`/addPlant`, plantDetails)
//       setPlants(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

const handleEditClick = (plantId) => {
  const plant = plants.find(p => p.id === plantId);
  if (plant) {
    setSelectedPlant({ ...plant }); // make a copy
    setIsUpdatePlantModalOpen(true);
  }
};

  const handleCloseUpdatePlantModal = () => {
    setIsUpdatePlantModalOpen(false);
    setSelectedPlant(null);
  };

//   const handleUpdatePlant = async () => {
//     try {
//       const response = await Axios.put(`/updatePlant`, selectedPlant)
//       setPlants(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//     handleCloseUpdatePlantModal();
//   };


const handleDeleteClick = (plantId) => {
    alert(`Delete clicked for plant ID: ${plantId}`);
    // Add your delete logic here
  };

//   useEffect(() => {
//     const fetchPlants = async () => {
//       try {
//         const response = await Axios.get("/getAllPlants");
//         setPlants(response.data);
//       } catch (error) {
//         console.log(error);
//         if(error.response?.data?.message){
//           alert(error.response.data.message);
//         }
//       }
//     }
//     fetchPlants();
//   }, []);

  return (
    <div className="plants-container">
      <div className="plants-main-content">
        <h2 className="plants-header">Plant Management</h2>

        <button onClick={handleAddPlantClick} className="add-plant-btn">
          Add Plant
        </button>
        {/* Show hardcoded plant names */}
        <ul className="plant-list">
          {plants.map((plant) => (
            <li key={plant.id} className="plant-item">
            <div className="plant-info" onClick={() => handlePlantClick(plant)}>
             <div className="plant-img-placeholder" />
             <div className="plant-name">{plant.name}</div>
           </div>
             <div className="plant-buttons">
               <button className="edit-btn" onClick={() => handleEditClick(plant.id)}>Edit</button>
               <button className="delete-btn" onClick={() => handleDeleteClick(plant.id)}>Delete</button>
             </div>
           </li>
          ))}
        </ul>
        
      </div>

      <AddPlant
        isOpen={isAddPlantModalOpen}
        onClose={handleCloseAddPlantModal}
        //onSave={handleSavePlant}
      />

      <UpdatePlant
        isOpen={isUpdatePlantModalOpen}
        onClose={handleCloseUpdatePlantModal}
        onSave={handleUpdatePlant}
        user={selectedPlant} // Pass user data to UpdateUser
        setUser={setSelectedPlant}
          />
          





       {isDetailModalOpen && selectedPlant && (
            <div className="plant-detail-modal">
              <div className="modal-content">
                <h3>{selectedPlant.name}</h3>
                <img src={selectedPlant.image} alt={selectedPlant.name} style={{ width: '100px' }} />
                <p>{selectedPlant.description}</p>
                <ul>
                  <li>Temperature🌡️: {selectedPlant.temperature}</li>
                  <li>Humidity💧: {selectedPlant.humidity}</li>
                  <li>Moisture🌿: {selectedPlant.moisture}</li>
                  <li>Nitrogen Level: {selectedPlant.nitrogen}</li>
                  <li>Phosphorus Level: {selectedPlant.phosphorus}</li>
                  <li>Potassium Level: {selectedPlant.potassium}</li>
                </ul>
                <button onClick={handleCloseDetailModal}>Close</button>
              </div>
            </div>
          )}   
    </div>
  );
};

export default Plants;
