import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProblemDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="card p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Problem Detail Page
        </h3>
        <p className="text-gray-500">
          Problem ID: {id}
        </p>
        <p className="text-gray-500 mt-2">
          This page will contain the problem statement, code editor, and submission interface.
        </p>
      </div>
    </div>
  );
}