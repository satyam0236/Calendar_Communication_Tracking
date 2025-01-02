// src/contexts/AdminContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

// Keys for localStorage
const STORAGE_KEYS = {
  COMPANIES: 'crm_companies',
  METHODS: 'crm_communication_methods',
  COMMUNICATIONS: 'crm_communications'
};

export const AdminProvider = ({ children }) => {
  // Initialize state from localStorage or use default values
  const [companies, setCompanies] = useState(() => {
    const savedCompanies = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    return savedCompanies ? JSON.parse(savedCompanies) : [];
  });

  const [communicationMethods, setCommunicationMethods] = useState(() => {
    const savedMethods = localStorage.getItem(STORAGE_KEYS.METHODS);
    return savedMethods ? JSON.parse(savedMethods) : [];
  });

  const [communications, setCommunications] = useState(() => {
    const savedCommunications = localStorage.getItem(STORAGE_KEYS.COMMUNICATIONS);
    return savedCommunications ? JSON.parse(savedCommunications) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.METHODS, JSON.stringify(communicationMethods));
  }, [communicationMethods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMUNICATIONS, JSON.stringify(communications));
  }, [communications]);

  const addCompany = (company) => {
    const newCompany = { ...company, id: Date.now() };
    setCompanies([...companies, newCompany]);
  };

  const updateCompany = (id, updatedCompany) => {
    setCompanies(companies.map(company =>
      company.id === id ? { ...updatedCompany, id } : company
    ));
  };

  const deleteCompany = (id) => {
    setCompanies(companies.filter(company => company.id !== id));
    // Also delete associated communications
    setCommunications(communications.filter(comm => comm.companyId !== id));
  };

  const addMethod = (method) => {
    const newMethod = { ...method, id: Date.now() };
    setCommunicationMethods([...communicationMethods, newMethod]);
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

  const addCommunication = (communication) => {
    const newCommunication = { ...communication, id: Date.now() };
    setCommunications([...communications, newCommunication]);
  };

  const getCompanyCommunications = (companyId) => {
    return communications.filter(comm => comm.companyId === companyId);
  };

  const getNextScheduledCommunication = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return null;

    const companyCommunications = getCompanyCommunications(companyId);
    if (companyCommunications.length === 0) {
      return new Date(); // Due immediately if no communications
    }

    const lastCommunication = new Date(Math.max(
      ...companyCommunications.map(comm => new Date(comm.date))
    ));

    const nextDate = new Date(lastCommunication);
    nextDate.setDate(nextDate.getDate() + company.communicationPeriodicity);
    return nextDate;
  };

  const getDueStatus = (companyId) => {
    const nextDate = getNextScheduledCommunication(companyId);
    if (!nextDate) return 'unknown';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(nextDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) return 'overdue';
    if (dueDate.getTime() === today.getTime()) return 'due';
    return 'upcoming';
  };

  return (
    <AdminContext.Provider value={{
      companies,
      communicationMethods,
      communications,
      addCompany,
      updateCompany,
      deleteCompany,
      addMethod,
      updateMethod,
      deleteMethod,
      addCommunication,
      getCompanyCommunications,
      getNextScheduledCommunication,
      getDueStatus
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;