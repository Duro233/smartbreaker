import { useEffect, useState } from 'react';
import './Background.css'

const ROWS = 35;
const HEX_WIDTH = 100;
const HEX_MARGIN = 1;
const HEX_OVERDRAW = 2;

export default function Background() {
  const [hexagonsPerRow, setHexagonsPerRow] = useState(10);

  useEffect(() => {
    const getHexagonsPerRow = () => {
      if (typeof window === 'undefined') return 10;
      const hexTotalWidth = HEX_WIDTH + (HEX_MARGIN * 2);
	  console.log('testtest');
	  return Math.ceil(window.innerWidth / hexTotalWidth) + HEX_OVERDRAW;
    };

    let timeoutId: number | undefined;

    const updateCount = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
	  timeoutId = window.setTimeout(() => {
        setHexagonsPerRow(getHexagonsPerRow());
      }, 50);
    };

    updateCount();
    window.addEventListener('resize', updateCount);
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener('resize', updateCount);
    };
  }, []);

return (
   
  <div className="backgroundContainer">
		{Array.from({ length: ROWS }).map((_, rowIndex) => (
			<div className="backgroundRow" key={`row-${rowIndex}`}>
				{Array.from({ length: hexagonsPerRow }).map((__, hexIndex) => (
					<div className="hexagon" key={`hex-${rowIndex}-${hexIndex}`}></div>
				))}
			</div>
		))}
	</div>

  );
}
