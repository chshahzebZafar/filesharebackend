import React from 'react';

interface WorldMapBackgroundProps {
  className?: string;
}

export const WorldMapBackground: React.FC<WorldMapBackgroundProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 1000 500"
      className={`w-full h-full opacity-10 dark:opacity-5 ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* North America */}
      <path
        d="M 150 150 Q 180 140 200 150 Q 220 160 240 150 Q 260 140 280 150 Q 300 160 320 150 Q 340 140 360 150 Q 380 160 400 150 Q 420 140 440 150 Q 460 160 480 150 Q 500 140 520 150 Q 540 160 560 150 Q 580 140 600 150 Q 620 160 640 150 Q 660 140 680 150 Q 700 160 720 150 Q 740 140 760 150 Q 780 160 800 150 Q 820 140 840 150 Q 860 160 880 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-400"
      />
      
      {/* South America */}
      <path
        d="M 300 250 Q 320 260 340 250 Q 360 240 380 250 Q 400 260 420 250 Q 440 240 460 250 Q 480 260 500 250 Q 520 240 540 250 Q 560 260 580 250 Q 600 240 620 250 Q 640 260 660 250 Q 680 240 700 250 Q 720 260 740 250 Q 760 240 780 250 Q 800 260 820 250 Q 840 240 860 250 Q 880 260 900 250"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-400"
      />
      
      {/* Europe */}
      <path
        d="M 450 120 Q 470 110 490 120 Q 510 130 530 120 Q 550 110 570 120 Q 590 130 610 120 Q 630 110 650 120 Q 670 130 690 120 Q 710 110 730 120 Q 750 130 770 120 Q 790 110 810 120 Q 830 130 850 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-400"
      />
      
      {/* Africa */}
      <path
        d="M 480 180 Q 500 190 520 180 Q 540 170 560 180 Q 580 190 600 180 Q 620 170 640 180 Q 660 190 680 180 Q 700 170 720 180 Q 740 190 760 180 Q 780 170 800 180 Q 820 190 840 180 Q 860 170 880 180 Q 900 190 920 180"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-400"
      />
      
      {/* Asia */}
      <path
        d="M 600 100 Q 620 90 640 100 Q 660 110 680 100 Q 700 90 720 100 Q 740 110 760 100 Q 780 90 800 100 Q 820 110 840 100 Q 860 90 880 100 Q 900 110 920 100 Q 940 90 960 100 Q 980 110 1000 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-400"
      />
      
      {/* Australia */}
      <path
        d="M 750 350 Q 770 340 790 350 Q 810 360 830 350 Q 850 340 870 350 Q 890 360 910 350 Q 930 340 950 350"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-gray-400"
      />
      
      {/* Islands and smaller landmasses */}
      <circle cx="200" cy="200" r="3" fill="currentColor" className="text-gray-400" />
      <circle cx="800" cy="300" r="2" fill="currentColor" className="text-gray-400" />
      <circle cx="900" cy="150" r="2" fill="currentColor" className="text-gray-400" />
      <circle cx="150" cy="300" r="2" fill="currentColor" className="text-gray-400" />
      <circle cx="950" cy="200" r="2" fill="currentColor" className="text-gray-400" />
    </svg>
  );
}; 