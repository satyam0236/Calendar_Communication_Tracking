// src/contexts/AdminContext.jsx
import React, { createContext, useState, useContext } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [communicationMethods, setCommunicationMethods] = useState([]);

  const addCompany = (company) => {
    setCompanies([...companies, { ...company, id: Date.now() }]);
  };

  const updateCompany = (id, updatedCompany) => {
    setCompanies(companies.map(company =>
      company.id === id ? { ...updatedCompany, id } : company
    ));
  };

  const deleteCompany = (id) => {
    setCompanies(companies.filter(company => company.id !== id));
  };

  const addMethod = (method) => {
    setCommunicationMethods([...communicationMethods, { ...method, id: Date.now() }]);
  };

  const updateMethod = (id, updatedMethod) => {
    setCommunicationMethods(methods =>
      methods.map(method => method.id === id ? { ...updatedMethod, id } : method)
    );
  };

  const deleteMethod = (id) => {
    setCommunicationMethods(methods =>
      methods.filter(method => method.id !== id)
    );
  };

  return (
    <AdminContext.Provider value={{
      companies,
      communicationMethods,
      addCompany,
      updateCompany,
      deleteCompany,
      addMethod,
      updateMethod,
      deleteMethod
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);