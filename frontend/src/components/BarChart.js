import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getPriceRange } from '../services/apiService';

const BarChart = ({ month }) => {
  const [priceRange, setPriceRange] = useState({});

  useEffect(() => {
    fetchPriceRange();
  }, [month]);

  const fetchPriceRange = async () => {
    const response = await getPriceRange(month);
    setPriceRange(response.data);
  };

  const data = {
    labels: ['0-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901+'],
    datasets: [
      {
        label: 'Items in Price Range',
        data: Object.values(priceRange),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return <Bar data={data} />;
};

export default BarChart;
