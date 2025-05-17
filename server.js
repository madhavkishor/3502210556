const express = require('express');
const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const NUMBER_TYPES = {
  'p': 'prime',
  'f': 'fibonacci',
  'e': 'even', 
  'r': 'random'
};

// In-memory storage
const numberWindows = {};
Object.keys(NUMBER_TYPES).forEach(type => {
  numberWindows[type] = [];
});

// Helper functions
const calculateAverage = (numbers) => {
  if (!numbers.length) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
};

const getMockNumbers = (type) => {
  const mockData = {
    'p': [2, 3, 5, 7, 11, 13],
    'f': [1, 1, 2, 3, 5, 8],
    'e': [2, 4, 6, 8, 10],
    'r': [7, 14, 3, 8, 9]
  };
  return mockData[type] || [];
};

app.get('/numbers/:type', (req, res) => {
  const type = req.params.type;
  
  if (!NUMBER_TYPES[type]) {
    return res.status(400).json({error: `Invalid type. Use one of: ${Object.keys(NUMBER_TYPES).join(', ')}`});
  }

  const newNumbers = getMockNumbers(type);
  const window = numberWindows[type];
  const prevState = [...window];

  // Update window with new numbers
  newNumbers.forEach(num => {
    if (!window.includes(num)) {
      if (window.length >= WINDOW_SIZE) window.shift();
      window.push(num);
    }
  });

  res.json({
    windowPrevState: prevState,
    windowCurrState: window,
    numbers: newNumbers,
    avg: calculateAverage(window)
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  Object.entries(NUMBER_TYPES).forEach(([type, name]) => {
    console.log(`- /numbers/${type} (${name} numbers)`);
  });
});