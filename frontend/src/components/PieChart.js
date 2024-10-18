import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getCategories } from '../services/apiService';

const PieChart = ({ month }) => {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    fetchCategories();
  }, [month]);

  const fetchCategories = async () => {
    const response = await getCategories(month);
    setCategories(response.data);
  };

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Items per Category',
        data: Object.values(categories),
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
