import React, { useState, useEffect } from 'react';
import AddPlant from './AddPlant'; // Adjust path if needed
import UpdatePlant from './UpdatePlant'; // Import your UpdateUser component
import './plants.css';
import { Axios } from '../../AxiosBuilder';
import DeletePlant from './DeletePlant';


const Plants = ({ activeTab }) => {
  //const [plants, setPlants] = useState([]);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);
  const [isUpdatePlantModalOpen, setIsUpdatePlantModalOpen] = useState(false);
  const [isDeletePlantModalOpen, setIsDeletePlantModalOpen] = useState(false);

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [plants, setPlants] = useState([]);  

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
    


const handleCloseDetailModal = () => {
    setSelectedPlant(null);
    setIsDetailModalOpen(false);
    };

  const handleSavePlant = async (plantDetails) => {
    try {
      const response = await Axios.post(`/addPlant`, plantDetails)
      setPlants(response.data);
    } catch (error) {
      console.log(error);
      alert('Failed to add plant');
    }
  };

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

  const handleUpdatePlant = async () => {
    try {
      const response = await Axios.put('/admin/updatePlant', selectedPlant);
      setPlants(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to update plant');
    }
    setIsUpdatePlantModalOpen(false);
    setSelectedPlant(null);
  };
  

const handleDeleteClick = (plantId) => {
  const plant = plants.find(p => p.id === plantId);
  if (plant) {
    setSelectedPlant(plant);
    setIsDeletePlantModalOpen(true);
  }
};

const handleConfirmDelete = async (id) => {
  try {
    const response = await Axios.delete(`/deletePlant/${id}`);
    setPlants(response.data);
  } catch (error) {
    console.error(error);
    alert('Failed to delete plant');
  }
  setIsDeletePlantModalOpen(false);
};

  

  

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await Axios.get("/getAllPlants");
        setPlants(response.data);
      } catch (error) {
        console.log(error);
        if(error.response?.data?.message){
          alert(error.response.data.message);
        }
      }
    }
    fetchPlants();
  }, []);

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
             <img className="plant-img-placeholder" src={`data:${plant.imageData};base64,${plant.imageName}`} alt='plantImage' />
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
        onSave={handleSavePlant}
      />

      <UpdatePlant
        isOpen={isUpdatePlantModalOpen}
        onClose={handleCloseUpdatePlantModal}
        onSave={handleUpdatePlant}
        user={selectedPlant} // Pass user data to UpdateUser
        setUser={setSelectedPlant}
          />
          
      
        <DeletePlant
          isOpen={isDeletePlantModalOpen}
          onClose={() => setIsDeletePlantModalOpen(false)}
          onDelete={handleConfirmDelete}
          plant={selectedPlant}
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
