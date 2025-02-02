
import React from "react";
import axios from "axios";


const AddClientForm = () => {
    const [formData, setFormData] = React.useState({ nombre: "", ip: "", velocidad: "10/10" });
  
    const handleSubmit = async (e:any) => {
      e.preventDefault();
      try {
        await axios.post("http://localhost:3001/api/add-client", formData);
        alert("Cliente agregado!");
      } catch (error) {
        alert("Error al agregar cliente");
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="IP"
          onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
        />
        <button type="submit">Agregar</button>
      </form>
    );
  };
export default AddClientForm