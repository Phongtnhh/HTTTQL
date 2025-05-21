import React, { useState, useEffect } from "react";
import './style.css';
import Cookies from "js-cookie";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu sau khi lọc
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm

  useEffect(() => {
    const token = Cookies.get("tokenUser"); 
    fetch("http://localhost:5000", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.documents) {
          setData(json.documents);
          setFilteredData(json.documents); // Ban đầu hiển thị tất cả
        }
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);

    const filtered = data.filter(item =>
      item.title.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="dashboard-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm tài liệu..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="card-list">
        {filteredData.map((item) => (
          <div
            key={item._id}
            className="card"
            onClick={() => setSelectedItem(item)}
          >
            <h3>{item.title}</h3>
            <p>{item.description.substring(0, 80)}...</p>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="details-card">
          <h2>{selectedItem.title}</h2>
          <p><strong>Mô tả:</strong> {selectedItem.description}</p>
          <p><strong>Trạng thái:</strong> {selectedItem.status}</p>
          <p><strong>Ngày tạo:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</p>
          <img
            src={selectedItem.thumbnail}
            alt={selectedItem.title}
            className="thumbnail"
          />
          <button onClick={() => setSelectedItem(null)} className="close-button">
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
