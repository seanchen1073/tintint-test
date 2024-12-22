import React, { useState } from 'react';
import '../index.css';

const ImageUpload = () => {
  const [image, setImage] = useState(null); // 儲存上傳前的圖片預覽
  const [error, setError] = useState(null); // 儲存錯誤訊息
  const [uploadedImage, setUploadedImage] = useState(null); // 儲存已上傳的圖片
  const [scale, setScale] = useState(1); // 儲存圖片的縮放比例，預設為1

  // 當使用者選擇檔案時，觸發這個函式
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 取得使用者選擇的檔案
    
    if (!file) { // 如果沒有選擇檔案，清空圖片和錯誤訊息
      setImage(null);
      setError(null);
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png']; // 限制上傳的圖片格式
    if (!validImageTypes.includes(file.type)) { // 如果檔案類型不對，顯示錯誤訊息
      setImage(null);
      setError('檔案類型錯誤，請上傳jpeg、png檔');
      return;
    }

    setError(null); // 清除錯誤訊息
    const reader = new FileReader(); // 讀取檔案
    reader.onloadend = () => {
      setImage(reader.result); // 設定圖片預覽
      setScale(1); // 重置縮放比例
    };
    reader.readAsDataURL(file); // 把檔案讀成DataURL格式，這樣就能顯示在畫面上
  };

  // 當使用者按下「上傳圖片」按鈕時，觸發這個函式
  const handleImageUpload = () => {
    if (image) { // 如果有圖片預覽，執行上傳
      setUploadedImage(image); // 設定已上傳圖片
      setImage(null); // 清空預覽圖片
      alert('圖片上傳成功！'); // 顯示提示訊息
    }
  };

  // 當使用者按下「刪除圖片」按鈕時，觸發這個函式
  const handleDeleteImage = () => {
    setUploadedImage(null); // 清除已上傳的圖片
    alert('圖片刪除成功！'); // 顯示刪除成功的訊息
  };

  // 處理圖片縮放的變動
  const handleScale = (e) => {
    const newScale = parseFloat(e.target.value); // 取得新的縮放比例
    setScale(newScale); // 更新縮放比例
  };

  return (
    <div className="image-upload-container">
      <h2 className="image-upload-title">圖片上傳區域</h2>
      <div className="upload-section">
        <div className="preview-container">
          <div className="preview-section">
            {image ? (
              <div className="preview-image-container">
                <div style={{ transform: `scale(${scale})` }}>
                  <img src={image} alt="預覽圖片" className="preview-image" />
                </div>
                <div className="scale-control">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={handleScale} // 當縮放條變動時觸發
                    className="scale-slider"
                  />
                </div>
              </div>
            ) : (
              <p className="preview-placeholder">圖片預覽區域</p> // 如果還沒有選圖片，就顯示這個提示
            )}
          </div>
          <div className="button-container">
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange} // 當選擇檔案時觸發
                className="file-input"
                id="file-input"
              />
              <label htmlFor="file-input" className="custom-file-button">
                選擇檔案
              </label>
            </div>
            <button onClick={handleImageUpload} className="upload-button">
              上傳圖片
            </button>
          </div>
        </div>

        <div className="display-container">
          <div className="display-section">
            {uploadedImage ? (
              <img src={uploadedImage} alt="上傳圖片" className="uploaded-image" />
            ) : (
              <p className="display-placeholder">圖片顯示區域</p> // 如果沒有上傳圖片，就顯示這個提示
            )}
          </div>
          {uploadedImage && (
            <div className="button-container">
              <button onClick={handleDeleteImage} className="delete-button">
                刪除圖片
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <p className="error-message">{error}</p>} {/* 顯示錯誤訊息 */}
    </div>
  );
};

export default ImageUpload;
