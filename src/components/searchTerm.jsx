import React, { useState, useEffect } from 'react';
import '../index.css';

const SearchTerm = () => {
  const [data, setData] = useState([]); // 儲存所有的資料
  const [searchTerm, setSearchTerm] = useState(''); // 儲存使用者輸入的搜尋字串
  const [filteredData, setFilteredData] = useState([]); // 儲存過濾後的資料
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // 控制下拉選單顯示與否

  // 用useEffect來載入userData.json裡的資料
  useEffect(() => {
    fetch('/userData/userData.json') // 抓取JSON檔
      .then((response) => response.json()) // 解析回傳的JSON資料
      .then((jsonData) => {
        setData(jsonData); // 把資料儲存到data裡
        setFilteredData(jsonData); // 初始時就顯示所有資料
      })
      .catch((error) => console.error('載入userData失敗:', error)); // 如果出錯的話就印出錯誤
  }, []);

  // 當輸入框的值改變時，這個函式會被觸發
  const handleSearch = (e) => {
    const value = e.target.value; // 取得使用者輸入的值
    setSearchTerm(value); // 更新搜尋字串

    if (value.trim() === '') {
      setFilteredData(data); // 如果搜尋字串是空的，就顯示所有資料
    } else {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) // 根據名稱篩選符合的資料
      );
      setFilteredData(filtered); // 顯示符合條件的資料
    }
  };

  // 當輸入框獲得焦點時，顯示下拉選單
  const handleFocus = () => {
    setIsDropdownVisible(true); // 顯示下拉選單
  };

  // 當輸入框失去焦點時，隱藏下拉選單
  const handleBlur = () => {
    setTimeout(() => setIsDropdownVisible(false), 200); // 延遲一下再隱藏，這樣使用者可以點選選項
  };

  // 當點擊下拉選單的某一項時，這個函式會被觸發
  const handleSelectItem = (item) => {
    setSearchTerm(item.name); // 把選中的名字填入搜尋框
    setIsDropdownVisible(false); // 點選後隱藏下拉選單
  };

  // 處理滾動事件
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom) {
      // 滾動到底部了（目前只是印出訊息）
      console.log('已經滾動到最底部');
    }
  };

  return (
    <div className="search-term-container">
      <h2 className="search-term-title">搜尋使用者</h2>
      <div className="search-section">
        <input
          type="text"
          value={searchTerm} // 顯示搜尋框中的文字
          onChange={handleSearch} // 當輸入變動時觸發
          onFocus={handleFocus} // 當輸入框聚焦時觸發
          onBlur={handleBlur} // 當輸入框失去焦點時觸發
          placeholder="輸入姓名(英文)..." // 搜尋框的提示文字
          className="search-input"
        />
        {isDropdownVisible && (
          <ul
            className="dropdown"
            onScroll={handleScroll} // 下拉選單滾動時觸發
          >
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <li 
                  key={item.id} 
                  className="dropdown-item"
                  onClick={() => handleSelectItem(item)} // 點擊選擇項目時觸發
                >
                  {item.name} {/* 顯示資料中的名字 */}
                </li>
              ))
            ) : (
              <li className="dropdown-item">無符合結果</li> // 如果沒有符合的資料，顯示這個
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchTerm;
