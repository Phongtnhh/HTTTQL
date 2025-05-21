import React, { useEffect, useState } from "react";
import './style.css';
import Cookies from "js-cookie";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [role, setRole] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null,
    documentFile: null,
  });

  useEffect(() => {
    const token = Cookies.get("tokenUser");
    fetch("http://localhost:5000/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(json => {
        if (json.documents) {
          setDocuments(json.documents.filter(doc => !doc.deleted));
        }
        if (json.role !== undefined) {
          setRole(json.role);
        }
      })
      .catch(err => console.error("Lỗi khi lấy dữ liệu:", err));
  }, []);

  const handleAddClick = () => {
    setFormData({ title: "", description: "", thumbnail: null, documentFile: null });
    setShowForm(true);
    setIsEdit(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", thumbnail: null, documentFile: null });
    setShowForm(false);
    setIsEdit(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
    if (formData.documentFile) data.append("documentFile", formData.documentFile);

    try {
      const url = isEdit
        ? `http://localhost:5000/products/updatePost/${editId}`
        : "http://localhost:5000/products/createPost";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });

      const result = await res.json();
      alert(result.message || (isEdit ? "Cập nhật thành công" : "Tạo tài liệu thành công"));

      if (isEdit) {
        setDocuments(prev =>
          prev.map(doc => (doc._id === editId ? { ...doc, ...result.document } : doc))
        );
      } else {
        setDocuments(prev => [...prev, result.document]);
      }

      handleCancel();
    } catch (error) {
      alert(isEdit ? "Lỗi khi cập nhật" : "Lỗi khi tạo tài liệu");
      console.error(error);
    }
  };

  const handleEditClick = (doc) => {
    if (role >= doc.check) {
      setFormData({
        title: doc.title,
        description: doc.description,
        thumbnail: null,
        documentFile: null,
      });
      setEditId(doc._id);
      setIsEdit(true);
      setShowForm(true);
    } else {
      alert("Bạn không có quyền chỉnh sửa");
    }
  };

  const handleDeleteClick = async (doc) => {
    if (role < doc.check) {
      alert("Bạn không có quyền xóa tài liệu này");
      return;
    }

    const confirm = window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?");
    if (!confirm) return;

    try {
      const res = await fetch("http://localhost:5000/delete-item", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: doc._id }),
      });

      const result = await res.json();
      alert(result.message || "Xóa thành công!");

      // Cập nhật lại danh sách tài liệu
      setDocuments(prev => prev.filter(item => item._id !== doc._id));
    } catch (error) {
      alert("Lỗi khi xóa tài liệu");
      console.error(error);
    }
  };

  return (
    <div className="document-container">
      <h2>Danh sách tài liệu</h2>
      <button onClick={handleAddClick} className="add-button">+ Thêm tài liệu</button>

      <div className="document-list">
        {documents.map(doc => (
          <div key={doc._id} className="document-card">
            <h3>{doc.title}</h3>
            <p>{doc.description?.substring(0, 100)}...</p>
            {doc.thumbnail && (
              <img src={doc.thumbnail} alt={doc.title} className="thumbnail" />
            )}
            <div className="button-group">
              <button
                className="edit-btn"
                onClick={() => (role >= doc.check ? handleEditClick(doc) : alert("Không đủ quyền"))}
              >
                Sửa
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteClick(doc)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-form">
          <h3>{isEdit ? "Chỉnh sửa tài liệu" : "Thêm tài liệu"}</h3>
          <input
            type="text"
            name="title"
            placeholder="Tên tài liệu"
            value={formData.title}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Mô tả"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          <h4>Ảnh (tải ảnh mới nếu muốn thay)</h4>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
          />
          <h4>Tài liệu (tải tài liệu mới nếu muốn thay)</h4>
          <input
            type="file"
            name="documentFile"
            onChange={handleChange}
          />
          <div className="form-buttons">
            <button onClick={handleSubmit} className="submit-btn">Xác nhận</button>
            <button onClick={handleCancel} className="cancel-btn">Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
