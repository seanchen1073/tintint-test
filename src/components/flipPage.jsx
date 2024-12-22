import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FlipPage = () => {
  const [currentSpread, setCurrentSpread] = useState(0); // 使用 spread 來追蹤當前頁面展開
  const [isFlipping, setIsFlipping] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next');
  const imageCache = useMemo(() => new Map(), []);

  const pages = useMemo(() => [
    'https://via.placeholder.com/600x400/ff9999/ffffff?text=Front+Cover',
    'https://via.placeholder.com/300x400/99ff99/ffffff?text=Page+1',
    'https://via.placeholder.com/300x400/99ff99/ffffff?text=Page+2',
    'https://via.placeholder.com/300x400/9999ff/ffffff?text=Page+3',
    'https://via.placeholder.com/300x400/9999ff/ffffff?text=Page+4',
    'https://via.placeholder.com/300x400/ffff99/ffffff?text=Page+5',
    'https://via.placeholder.com/300x400/ffff99/ffffff?text=Page+6',
    'https://via.placeholder.com/300x400/ff99ff/ffffff?text=Page+7',
    'https://via.placeholder.com/300x400/ff99ff/ffffff?text=Page+8',
    'https://via.placeholder.com/300x400/99ffff/ffffff?text=Page+9',
    'https://via.placeholder.com/300x400/99ffff/ffffff?text=Page+10',
    'https://via.placeholder.com/300x400/ff9999/ffffff?text=Page+11',
    'https://via.placeholder.com/300x400/ff9999/ffffff?text=Page+12',
    'https://via.placeholder.com/600x400/ffcc99/ffffff?text=Back+Cover'
  ], []);

  // 優化的圖片預加載
  useEffect(() => {
    const preloadImages = async () => {
      // 優先加載當前和鄰近的圖片
      const priorityLoad = async (indices) => {
        const loadPromises = indices.map(index => {
          if (index >= 0 && index < pages.length) {
            return new Promise((resolve) => {
              if (imageCache.has(pages[index])) {
                resolve();
                return;
              }
              const img = new Image();
              img.onload = () => {
                imageCache.set(pages[index], true);
                resolve();
              };
              img.onerror = () => {
                resolve();
              };
              img.src = pages[index];
            });
          }
          return Promise.resolve();
        });
        await Promise.all(loadPromises);
      };

      // 首先加載封面和第一個展開
      await priorityLoad([0, 1, 2]);
      setImagesLoaded(true);

      // 然後在背景加載其餘的圖片
      const remainingIndices = Array.from(
        { length: pages.length },
        (_, i) => i
      ).filter(i => !imageCache.has(pages[i]));
      
      await priorityLoad(remainingIndices);
    };

    preloadImages();
  }, [pages, imageCache]);

  const handlePrev = () => {
    if (currentSpread > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1);
        setTimeout(() => setIsFlipping(false), 50);
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentSpread < Math.ceil((pages.length - 1) / 2) && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1);
        setTimeout(() => setIsFlipping(false), 50);
      }, 300);
    }
  };

  const renderSpread = () => {
    if (!imagesLoaded) {
      return <div className="loading">載入中...</div>;
    }

    if (currentSpread === 0) {
      // 封面
      return (
        <>
          <div className="page page-left empty-page"></div>
          <div className="page page-right">
            <img src={pages[0]} alt="封面" className="page-image" />
          </div>
        </>
      );
    }

    if (currentSpread === Math.ceil((pages.length - 1) / 2)) {
      // 封底
      return (
        <>
          <div className="page page-left">
            <img src={pages[pages.length - 1]} alt="封底" className="page-image" />
          </div>
          <div className="page page-right empty-page"></div>
        </>
      );
    }

    // 計算當前展開的頁面索引
    const leftPageIndex = (currentSpread * 2) - 1;
    const rightPageIndex = leftPageIndex + 1;

    return (
      <>
        <div className="page page-left">
          <img src={pages[leftPageIndex]} alt={`第 ${leftPageIndex} 頁`} className="page-image" />
        </div>
        <div className="page page-right">
          <img src={pages[rightPageIndex]} alt={`第 ${rightPageIndex} 頁`} className="page-image" />
        </div>
      </>
    );
  };

  const getPageDisplay = () => {
    if (currentSpread === 0) return '封面';
    if (currentSpread === Math.ceil((pages.length - 1) / 2)) return '封底';
    return `${currentSpread}/${Math.ceil((pages.length - 2) / 2)}`;
  };

  return (
    <div className="book-flip-section">
      <h2 className="flip-page-title">翻書特效</h2>
      <div className="book-container">
        <div className="book">
          <div className={`book-pages ${isFlipping ? `flipping-${flipDirection}` : ''}`}>
            <div className="spread current-spread">
              {renderSpread()}
            </div>
          </div>
        </div>
        <div className="controls">
          <button
            className="control-button"
            onClick={handlePrev}
            disabled={currentSpread === 0 || isFlipping}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="page-number">{getPageDisplay()}</span>
          <button
            className="control-button"
            onClick={handleNext}
            disabled={currentSpread === Math.ceil((pages.length - 1) / 2) || isFlipping}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlipPage;