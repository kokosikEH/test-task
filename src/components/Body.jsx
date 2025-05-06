import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const CustomizedDot = (props) => {
  const { points } = props;

  if (!points || points.length === 0) return null;

  const coloredPoints = points.map((point, index) => {
    const item = point.payload;
    return {
      ...point,
      color: item?.zScore>1 ? "#ff0000" : "#8AD2FC"
    };
  });

  const gradientLines = [];
  const pointElements = [];

  const getControlPoints = (p0, p1, p2, p3) => {
    const smoothing = 0.12; 

    const control1x = p1.x + (p2.x - p0.x) * smoothing;
    const control1y = p1.y + (p2.y - p0.y) * smoothing;

    const control2x = p2.x - (p3.x - p1.x) * smoothing;
    const control2y = p2.y - (p3.y - p1.y) * smoothing;

    return [control1x, control1y, control2x, control2y];
  };

  for (let i = 0; i < coloredPoints.length - 1; i++) {
    const p0 = coloredPoints[i - 1] || coloredPoints[i];
    const p1 = coloredPoints[i];
    const p2 = coloredPoints[i + 1];
    const p3 = coloredPoints[i + 2] || p2;

    const [c1x, c1y, c2x, c2y] = getControlPoints(p0, p1, p2, p3);
    const d = `M${p1.x},${p1.y} C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;

    if (p1.color !== p2.color) {
      const gradientId = `gradient-${i}`;

      gradientLines.push(
        <defs key={`gradient-def-${i}`}>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={p1.color} />
            <stop offset="100%" stopColor={p2.color} />
          </linearGradient>
        </defs>
      );

      gradientLines.push(
        <path
          key={`gradient-line-${i}`}
          d={d}
          stroke={`url(#${gradientId})`}
          strokeWidth={2}
          fill="none"
        />
      );
    } else {
      gradientLines.push(
        <path
          key={`solid-line-${i}`}
          d={d}
          stroke={p1.color}
          strokeWidth={2}
          fill="none"
        />
      );
    }
  }
 
  coloredPoints.forEach((point, i) => {
    const item = point.payload;
    pointElements.push(
      <React.Fragment key={`point-${i}`}>
        {item?.zScore>1 ? (
          <svg x={point.x - 10} y={point.y - 10} width={20} height={20} fill="#F97766" viewBox="0 0 1024 1024">
            <path d="M517.12 53.248q95.232 0 179.2 36.352t145.92 98.304 98.304 145.92 36.352 179.2-36.352 179.2-98.304 145.92-145.92 98.304-179.2 36.352-179.2-36.352-145.92-98.304-98.304-145.92-36.352-179.2 36.352-179.2 98.304-145.92 145.92-98.304 179.2-36.352zM663.552 261.12q-15.36 0-28.16 6.656t-23.04 18.432-15.872 27.648-5.632 33.28q0 35.84 21.504 61.44t51.2 25.6 51.2-25.6 21.504-61.44q0-17.408-5.632-33.28t-15.872-27.648-23.04-18.432-28.16-6.656zM373.76 261.12q-29.696 0-50.688 25.088t-20.992 60.928 20.992 61.44 50.688 25.6 50.176-25.6 20.48-61.44-20.48-60.928-50.176-25.088zM520.192 602.112q-51.2 0-97.28 9.728t-82.944 27.648-62.464 41.472-35.84 51.2q-1.024 1.024-1.024 2.048-1.024 3.072-1.024 8.704t2.56 11.776 7.168 11.264 12.8 6.144q25.6-27.648 62.464-50.176 31.744-19.456 79.36-35.328t114.176-15.872q67.584 0 116.736 15.872t81.92 35.328q37.888 22.528 63.488 50.176 17.408-5.12 19.968-18.944t0.512-18.944-3.072-7.168-1.024-3.072q-26.624-55.296-100.352-88.576t-176.128-33.28z" />
          </svg>
        ) : (
          <svg x={point.x - 3} y={point.y - 3} width={6} height={6} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4" fill="none">
            <circle cx="2" cy="2" r="2" fill="white" />
          </svg>
        )}
      </React.Fragment>
    );
  });

  return (
    <>
      {gradientLines}
      {pointElements}
    </>
  );
};

export default function Body() {
  function getZScore(array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b.value, 0) / n;
    const std = Math.sqrt(array.map(x => Math.pow(x.value - mean, 2)).reduce((a, b) => a + b, 0) / n);

    return array.map(item => ({
      ...item,
      zScore: Math.abs((item.value - mean) / std)
    }));
  }

  const array = [
    { name: "A", value: 12 },
    { name: "B", value: 15 },
    { name: "C", value: 18 },
    { name: "D", value: 25 },
    { name: "E", value: 35 }, // высокое значение
    { name: "F", value: 22 },
    { name: "G", value: 3 }, // низкое значение
    { name: "H", value: 5 }, // низкое значение
    { name: "I", value: 10 },
  ];

  const data = getZScore(array);
  console.log("Processed data:", data);

  return (
    <div className='w-full p-4 text-black flex  justify-center'>
      <LineChart
        data={data}
        width={1300}
        height={800}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={0}
          stroke="#8AD2FC"
          dot={<CustomizedDot />}
        />
         <Line
          type="monotone"
          dataKey="zScore"
          strokeWidth={1}
          stroke="#FF9393"
        />
      </LineChart>
    </div>
  );
}