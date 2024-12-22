import React, { useState } from 'react';
import '../index.css';

const ImageUpload = () => {
  // 使用 useState 定義狀態
  const [image, setImage] = useState(null); // 用來儲存上傳前的圖片預覽
  const [error, setError] = useState(null); // 用來儲存錯誤訊息
  const [uploadedImage, setUploadedImage] = useState(null); // 用來儲存已成功上傳的圖片
  const [scale, setScale] = useState(1); // 用來儲存圖片的縮放比例，初始值為 1（100%）

  // 當使用者選擇檔案時執行這個函式
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 獲取使用者選擇的檔案
    if (!file) {
      setImage(null); // 如果沒有選擇檔案，清空圖片預覽
      setError(null); // 同時清除錯誤訊息
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png']; // 定義允許的圖片類型
    if (!validImageTypes.includes(file.type)) {
      // 如果檔案類型不符合，顯示錯誤訊息
      setImage(null); 
      setError('請上傳 jpeg 或 png 格式');
      return;
    }

    setError(null); // 如果類型正確，清空錯誤訊息
    const reader = new FileReader(); // 建立 FileReader 來讀取檔案內容
    reader.onloadend = () => {
      setImage(reader.result); // 將圖片的資料 URI 儲存在 state 中
      setScale(1); // 預設縮放比例為 1
    };
    reader.readAsDataURL(file); // 讀取檔案內容
  };

  // 當使用者按下 "上傳圖片" 按鈕時執行
  const handleImageUpload = () => {
    if (!image) {
      // 如果沒有圖片，顯示錯誤訊息
      setError('未選擇圖片');
      return;
    }

    setUploadedImage(image); // 將圖片從預覽區移至上傳區
    setImage(null); // 清空預覽區
    setError(null); // 清空錯誤訊息
    alert('圖片上傳成功！'); // 顯示提示訊息
  };

  // 當使用者按下 "刪除圖片" 按鈕時執行
  const handleDeleteImage = () => {
    setUploadedImage(null); // 清空上傳區的圖片
    alert('圖片刪除成功！'); // 顯示提示訊息
  };

  // 當使用者調整縮放條時執行
  const handleScale = (e) => {
    const newScale = parseFloat(e.target.value); // 獲取新的縮放比例
    setScale(newScale); // 更新縮放比例
  };

  return (
    <div className="image-upload-container">
      <h2 className="image-upload-title">圖片上傳</h2>
      <div className="upload-section">
        <div className="preview-container">
          <div className="preview-section">
            {image ? (
              // 如果有選擇圖片，顯示預覽圖片
              <div className="preview-image-container">
                {/* 使用 CSS transform 進行縮放 */}
                <div style={{ transform: `scale(${scale})` }}>
                  <img src={image} alt="預覽圖片" className="preview-image" />
                </div>
                <div className="scale-control">
                  {/* 縮放條，用於調整圖片大小 */}
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={handleScale}
                    className="scale-slider"
                  />
                </div>
              </div>
            ) : (
              // 如果沒有圖片，顯示預覽文字
              <p className="preview-placeholder">圖片預覽區域</p>
            )}
          </div>
          <div className="button-container">
            <div className="file-input-wrapper">
              {/* 隱藏的檔案選擇按鈕 */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
                id="file-input"
              />
              {/* 自定義的檔案選擇按鈕 */}
              <label htmlFor="file-input" className="custom-file-button">
                選擇檔案
              </label>
            </div>
            <button onClick={handleImageUpload} className="upload-button">
              上傳圖片
            </button>
          </div>
          {/* 錯誤訊息顯示區 */}
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* 圖片顯示區 */}
        <div className="display-container">
          <div className="display-section">
            {uploadedImage ? (
              // 如果有上傳圖片，顯示圖片
              <img src={uploadedImage} alt="上傳圖片" className="uploaded-image" />
            ) : (
              // 如果沒有上傳圖片，顯示文字
              <p className="display-placeholder">圖片顯示區域</p>
            )}
          </div>
          {/* 刪除圖片按鈕 */}
          {uploadedImage && (
            <div className="button-container">
              <button onClick={handleDeleteImage} className="delete-button">
                刪除圖片
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
