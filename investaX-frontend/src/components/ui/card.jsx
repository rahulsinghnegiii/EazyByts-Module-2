// src/components/ui/card.jsx
import React from "react";

export const Card = ({ children }) => (
  <div className="p-4 bg-white shadow-md rounded-lg">{children}</div>
);

export const CardContent = ({ children }) => (
  <div className="p-2">{children}</div>
);
