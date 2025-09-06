import React, { createContext, useState, useEffect } from 'react';
import { getResourcesFromSession, saveResourcesToSession } from '../utils/storage';

export const ResourceContext = createContext();

export function ResourceProvider({ children }) {
  const [resources, setResources] = useState(() => getResourcesFromSession());

  // keep session storage in sync
  useEffect(() => {
    saveResourcesToSession(resources);
  }, [resources]);

  const addResource = (resource) => {
    setResources((prev) => [...prev, resource]);
  };

  const clearResources = () => setResources([]);

  return (
    <ResourceContext.Provider value={{ resources, addResource, setResources, clearResources }}>
      {children}
    </ResourceContext.Provider>
  );
}