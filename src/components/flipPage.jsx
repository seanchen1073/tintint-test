import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FlipPage = () => {
  // 定義狀態變數
  const [currentSpread, setCurrentSpread] = useState(0);  // 當前的頁面索引
  const [isFlipping, setIsFlipping] = useState(false);  // 是否正在翻頁
  const [imagesLoaded, setImagesLoaded] = useState(false);  // 圖片是否已經載入完成
  const [loadedImages, setLoadedImages] = useState(new Set());  // 儲存已載入的圖片索引
  const [flipDirection, setFlipDirection] = useState('next');  // 記錄翻頁方向

  // 定義頁面圖片網址
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
  ], []);  // 使用 useMemo 儲存頁面圖片網址，避免每次渲染時都重新計算

  // 預載入頁面圖片的函式
  const preloadImages = useCallback(async (indices) => {
    const promises = indices.map(index => {
      // 如果圖片索引無效或已經載入過，就跳過
      if (index < 0 || index >= pages.length || loadedImages.has(index)) {
        return Promise.resolve();
      }

      // 建立新的 Image 物件來預載入圖片
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          // 當圖片載入完成時，更新已載入圖片的狀態
          setLoadedImages(prev => new Set([...prev, index]));
          resolve();
        };
        img.onerror = resolve;  // 若載入失敗，仍然 resolve 以繼續執行
        img.src = pages[index];  // 設定圖片來源
      });
    });

    // 等待所有圖片預載入完成
    await Promise.all(promises);
  }, [pages, loadedImages]);  // useCallback 的依賴：pages 和 loadedImages

  // 預載入所有頁面圖片
  useEffect(() => {
    const loadAllImages = async () => {
      // 呼叫預載入函式，並傳入所有頁面的索引
      await preloadImages(Array.from({ length: pages.length }, (_, index) => index));
      setImagesLoaded(true);  // 當所有圖片載入完成，設置 imagesLoaded 為 true
    };

    loadAllImages();
  }, [preloadImages, pages.length]);  // 依賴 preloadImages 和 pages.length，這樣當頁面數量改變時會重新載入圖片

  // 上一頁的處理函式
  const handlePrev = () => {
    // 當前頁面大於 0 且沒有正在翻頁的情況下，才可以翻到上一頁
    if (currentSpread > 0 && !isFlipping) {
      setIsFlipping(true);  // 設置正在翻頁
      setFlipDirection('prev');  // 設定翻頁方向為上一頁
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1);  // 翻頁後，更新當前頁面
        setTimeout(() => setIsFlipping(false), 50);  // 50ms 後取消翻頁狀態
      }, 300);  // 設定翻頁的延遲時間
    }
  };

  // 下一頁的處理函式
  const handleNext = () => {
    // 當前頁面小於總頁數的一半且沒有正在翻頁的情況下，才可以翻到下一頁
    if (currentSpread < Math.ceil((pages.length - 1) / 2) && !isFlipping) {
      setIsFlipping(true);  // 設置正在翻頁
      setFlipDirection('next');  // 設定翻頁方向為下一頁
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1);  // 翻頁後，更新當前頁面
        setTimeout(() => setIsFlipping(false), 50);  // 50ms 後取消翻頁狀態
      }, 300);  // 設定翻頁的延遲時間
    }
  };

  // 渲染圖片的函式
  const renderImage = (index, alt) => {
    // 如果索引無效，返回 null
    if (index < 0 || index >= pages.length) return null;
    // 如果圖片未載入，顯示載入中的提示
    if (!loadedImages.has(index)) {
      return <div className="loading-placeholder">載入中...</div>;
    }
    // 圖片已載入，返回 img 元素
    return (
      <img 
        src={pages[index]}  // 圖片來源
        alt={alt}  // 圖片說明
        className="page-image"  // 設定圖片的 CSS class
      />
    );
  };

  // 渲染一對頁面的函式
  const renderSpread = () => {
    // 如果圖片尚未全部載入，顯示載入中的提示
    if (!imagesLoaded) {
      return <div className="loading">載入中...</div>;
    }

    // 如果是封面，只有右邊頁面顯示
    if (currentSpread === 0) {
      return (
        <>
          <div className="page page-left empty-page"></div>
          <div className="page page-right">
            {renderImage(0, "封面")}
          </div>
        </>
      );
    }

    // 如果是封底，只有左邊頁面顯示
    if (currentSpread === Math.ceil((pages.length - 1) / 2)) {
      return (
        <>
          <div className="page page-left">
            {renderImage(pages.length - 1, "封底")}
          </div>
          <div className="page page-right empty-page"></div>
        </>
      );
    }

    // 渲染中間的頁面，根據當前頁面索引計算左右頁面的圖片
    const leftPageIndex = (currentSpread * 2) - 1;
    const rightPageIndex = leftPageIndex + 1;

    return (
      <>
        <div className="page page-left">
          {renderImage(leftPageIndex, `第 ${leftPageIndex} 頁`)}
        </div>
        <div className="page page-right">
          {renderImage(rightPageIndex, `第 ${rightPageIndex} 頁`)}
        </div>
      </>
    );
  };

  // 顯示當前頁面的位置
  const getPageDisplay = () => {
    if (currentSpread === 0) return '封面';
    if (currentSpread === Math.ceil((pages.length - 1) / 2)) return '封底';
    return `${currentSpread}/${Math.ceil((pages.length - 2) / 2)}`;  // 返回頁碼，像是 "3/6"
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
            disabled={currentSpread === 0 || isFlipping}  // 如果在封面或翻頁中，禁用上一頁按鈕
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="page-number">{getPageDisplay()}</span>  {/* 顯示當前頁數 */}
          <button
            className="control-button"
            onClick={handleNext}
            disabled={currentSpread === Math.ceil((pages.length - 1) / 2) || isFlipping}  // 如果在封底或翻頁中，禁用下一頁按鈕
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlipPage;
