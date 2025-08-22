'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface RadarChartData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon?: string;
}

export interface RadarChartProps {
  data: RadarChartData[];
  size?: number;
  className?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  strokeWidth?: number;
  gridLevels?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 300,
  className,
  showGrid = true,
  showLabels = true,
  animated = true,
  strokeWidth = 2,
  gridLevels = 5
}) => {
  const center = size / 2;
  const radius = (size * 0.35);
  const numPoints = data.length;
  
  // Calculate points for the polygon based on data values
  const getPolygonPoints = () => {
    return data.map((item, index) => {
      const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
      const normalizedValue = item.value / item.maxValue;
      const pointRadius = radius * normalizedValue;
      const x = center + pointRadius * Math.cos(angle);
      const y = center + pointRadius * Math.sin(angle);
      return { x, y, normalizedValue };
    });
  };

  // Calculate points for axis lines
  const getAxisPoints = () => {
    return data.map((_, index) => {
      const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { x, y, angle };
    });
  };

  // Calculate points for labels
  const getLabelPoints = () => {
    return data.map((item, index) => {
      const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
      const labelRadius = radius * 1.2;
      const x = center + labelRadius * Math.cos(angle);
      const y = center + labelRadius * Math.sin(angle);
      return { x, y, label: item.label, icon: item.icon };
    });
  };

  const polygonPoints = getPolygonPoints();
  const axisPoints = getAxisPoints();
  const labelPoints = getLabelPoints();

  // Create path string for the data polygon
  const polygonPath = polygonPoints.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '') + ' Z';

  // Create grid circles
  const gridCircles = Array.from({ length: gridLevels }, (_, i) => {
    const gridRadius = (radius * (i + 1)) / gridLevels;
    return gridRadius;
  });

  return (
    <div className={cn("relative inline-block", className)}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid */}
        {showGrid && (
          <g className="opacity-30">
            {/* Grid circles */}
            {gridCircles.map((gridRadius, index) => (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={gridRadius}
                fill="none"
                stroke="#0f172a"
                strokeWidth={0.5}
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Axis lines */}
            {axisPoints.map((point, index) => (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="#0f172a"
                strokeWidth={0.5}
                strokeDasharray="2,2"
              />
            ))}
          </g>
        )}

        {/* Data area (filled polygon) */}
        <motion.path
          d={polygonPath}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 1.5, ease: "easeOut" } : undefined}
        />

        {/* Data points */}
        {polygonPoints.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={data[index].color}
            stroke="#fff"
            strokeWidth={2}
            initial={animated ? { scale: 0, opacity: 0 } : undefined}
            animate={animated ? { scale: 1, opacity: 1 } : undefined}
            transition={
              animated
                ? { delay: 0.5 + index * 0.1, duration: 0.5, ease: "easeOut" }
                : undefined
            }
            className="drop-shadow-sm"
          />
        ))}

        {/* Labels */}
        {showLabels && labelPoints.map((point, index) => (
          <g key={index}>
            <motion.text
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-slate-700 text-xs font-medium"
              initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
              animate={animated ? { opacity: 1, scale: 1 } : undefined}
              transition={
                animated
                  ? { delay: 1 + index * 0.1, duration: 0.3 }
                  : undefined
              }
            >
              {point.icon && (
                <tspan className="text-base" dy="-8">
                  {point.icon}
                </tspan>
              )}
              <tspan x={point.x} dy={point.icon ? "20" : "0"}>
                {point.label}
              </tspan>
            </motion.text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={animated ? { opacity: 0, y: 10 } : undefined}
            animate={animated ? { opacity: 1, y: 0 } : undefined}
            transition={
              animated
                ? { delay: 1.5 + index * 0.1, duration: 0.3 }
                : undefined
            }
            className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-md text-xs"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-700">
              {item.label}: {Math.round((item.value / item.maxValue) * 100)}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Simplified version for smaller displays
export const MiniRadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 150,
  className,
  animated = false
}) => {
  return (
    <RadarChart
      data={data}
      size={size}
      className={className}
      showGrid={false}
      showLabels={false}
      animated={animated}
      strokeWidth={1.5}
    />
  );
};