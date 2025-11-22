import './PhotoWidget.css';
import { useEffect, useState } from "react";

import { smartClockService, BASE_URL_IMAGES} from '../../services';

function PhotoWidget({reloadTrigger, onTriggerReload}) {
  const [photoList, setPhotoList] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // 初始加载照片
    getPhotoList();
  }, []);

  // 监听父组件的 reloadTrigger 变化
  useEffect(() => {
    if (reloadTrigger > 0) {
      console.log('PhotoWidget: 收到父组件的更新信号, trigger:', reloadTrigger);
      // 执行更新操作：重新获取照片或切换照片
      updateRandomImage();
    }
  }, [reloadTrigger]);

  function getPhotoList() {
    smartClockService.getPhotoList(10).then(response => {
      if (response && response.data) {
        const photos = response.data.data;
        setPhotoList(photos);
        updateRandomImage(photos);
      }
    }).catch(error => {
      console.error('Error fetching photo list:', error);
    });
  }

  function updateRandomImage(photos) {
    // 如果没有传入photos参数，使用当前的photoList状态
    let currentPhotos = photos
    if (photos == undefined || photos.length === 0) {
      currentPhotos = photoList;
    }
    if (currentPhotos.length === 0) return null;
    const idx = Math.floor(Math.random() * currentPhotos.length);
    const randomPhoto = currentPhotos[idx];
    if (randomPhoto != null && randomPhoto.url) {
      setIsLoading(true);
      setImageLoaded(false); // 重置加载状态
      setCurrentPhoto(randomPhoto);
    }
  }

  function handleImageClick() {
    updateRandomImage();
  }

  function handleImageThumbnailLoad() {
     setIsLoading(false);
  }

  function handleImageLoad() {
    setImageLoaded(true);
  }

  function handleImageError() {
    console.error('图片加载失败:', currentPhoto.url);
    setIsLoading(false);
  }

  // 生成缩略图URL（假设API支持缩略图参数）
  function getThumbnailUrl(photo) {
    if (!photo || !photo.url) return '';
    // 方案1: 如果API支持缩略图参数
    // return `${BASE_URL_IMAGES}${photo.url}?thumbnail=true&size=small`;
    
    // 方案2: 如果有专门的缩略图字段
    return photo.thumbnail_url ? `${BASE_URL_IMAGES}${photo.thumbnail_url}` : `${BASE_URL_IMAGES}${photo.url}`;
  }

  function getFullImageUrl(photo) {
    if (!photo || !photo.url) return '';
    return `${BASE_URL_IMAGES}${photo.url}`;
  }

  return (
    <div className="widgets-photo">
      {/* 加载占位符 - 显示在顶层 */}
      {isLoading && (
        <div className="photo-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {/* 缩略图 - 绝对定位，z-index: 5 */}
      {currentPhoto && (
        <img 
          src={getThumbnailUrl(currentPhoto)}
          alt="Thumbnail"
          className="photo-thumbnail"
          onLoad={handleImageThumbnailLoad}
          onError={handleImageThumbnailLoad}
          onClick={handleImageClick}
        />
      )}
      
      {/* 高清图 - 绝对定位，z-index: 6，加载完成后显示 */}
      {currentPhoto && (
        <img 
          src={getFullImageUrl(currentPhoto)}
          alt="Photo Widget"
          className={`photo-fullimage ${imageLoaded ? 'loaded' : ''}`}
          onClick={handleImageClick}
          onLoad={handleImageLoad}
          onError={handleImageError}
          title="Click to change photo"
        />
      )}
    </div>
  );
}

export default PhotoWidget;