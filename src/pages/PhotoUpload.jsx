import React, { useState, useRef } from 'react';
import './PhotoUpload.css';
import APIClient from '../services/apiClient';

const PhotoUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const apiClient = APIClient();

  // 处理文件选择
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    addFiles(files);
  };

  // 添加文件到列表
  const addFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('请选择图片文件');
      return;
    }

    setSelectedFiles(prev => [...prev, ...imageFiles]);

    // 生成预览
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, {
          file: file.name,
          url: reader.result,
          size: file.size
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 拖拽处理
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    }
  };

  // 移除文件
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setUploadResults(prev => prev.filter((_, i) => i !== index));
  };

  // 清空所有文件
  const clearAll = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setUploadResults([]);
    setUploadProgress({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 上传文件
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('请先选择要上传的图片');
      return;
    }

    setUploading(true);
    setUploadResults([]);
    const results = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);

      try {
        setUploadProgress(prev => ({ ...prev, [i]: 0 }));

        const response = await apiClient.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(prev => ({ ...prev, [i]: percentCompleted }));
          }
        });

        results.push({
          filename: file.name,
          status: 'success',
          message: '上传成功',
          data: response
        });

        setUploadProgress(prev => ({ ...prev, [i]: 100 }));
      } catch (error) {
        console.error(`上传失败 ${file.name}:`, error);
        results.push({
          filename: file.name,
          status: 'error',
          message: error.message || '上传失败'
        });
        setUploadProgress(prev => ({ ...prev, [i]: -1 }));
      }
    }

    setUploadResults(results);
    setUploading(false);
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="photo-upload-container">
      <div className="upload-header">
        <h1>图片上传</h1>
        <p className="upload-subtitle">支持拖拽上传，支持多张图片同时上传</p>
      </div>

      {/* 拖拽上传区域 */}
      <div
        className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <div className="dropzone-content">
          <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="dropzone-text">点击选择图片或拖拽图片到此处</p>
          <p className="dropzone-hint">支持 JPG、PNG、GIF 等格式</p>
        </div>
      </div>

      {/* 文件预览列表 */}
      {previews.length > 0 && (
        <div className="preview-section">
          <div className="preview-header">
            <h2>已选择 {previews.length} 张图片</h2>
            <button className="btn-clear" onClick={clearAll}>清空全部</button>
          </div>

          <div className="preview-grid">
            {previews.map((preview, index) => (
              <div key={index} className="preview-item">
                <div className="preview-image-wrapper">
                  <img src={preview.url} alt={preview.file} className="preview-image" />
                  <button
                    className="btn-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="preview-info">
                  <p className="preview-filename" title={preview.file}>{preview.file}</p>
                  <p className="preview-size">{formatFileSize(preview.size)}</p>
                  
                  {/* 上传进度 */}
                  {uploadProgress[index] !== undefined && (
                    <div className="upload-progress">
                      {uploadProgress[index] === -1 ? (
                        <span className="status-error">失败</span>
                      ) : uploadProgress[index] === 100 ? (
                        <span className="status-success">✓ 完成</span>
                      ) : (
                        <>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${uploadProgress[index]}%` }}
                            ></div>
                          </div>
                          <span className="progress-text">{uploadProgress[index]}%</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* 上传结果 */}
                  {uploadResults[index] && (
                    <p className={`upload-result ${uploadResults[index].status}`}>
                      {uploadResults[index].message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 上传按钮 */}
          <div className="upload-actions">
            <button
              className="btn-upload"
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading ? '上传中...' : `上传 ${selectedFiles.length} 张图片`}
            </button>
          </div>
        </div>
      )}

      {/* 上传结果汇总 */}
      {uploadResults.length > 0 && !uploading && (
        <div className="upload-summary">
          <h3>上传结果</h3>
          <div className="summary-stats">
            <span className="stat-success">
              成功: {uploadResults.filter(r => r.status === 'success').length}
            </span>
            <span className="stat-error">
              失败: {uploadResults.filter(r => r.status === 'error').length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
