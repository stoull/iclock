import './PhotoWidget.css';
import { useEffect, useState } from "react";

import { smartClockService, BASE_URL_IMAGES} from '../../services';

function PhotoWidget() {
  const [photoList, setPhotoList] = useState([]);
  const [showPhoto, setShowPhoto] = useState('');

  useEffect(() => {
    // 初始加载照片
    getPhotoList();
  }, []);

  function getPhotoList() {
    smartClockService.getPhotoList(22).then(response => {
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
      console.log('Using photoList state.');
    } else {
      console.log('Using provided photos array.', photos);
    }
    console.log('Updating random image...', photoList.length);
    console.log('Photo list length:', currentPhotos.length);
    if (currentPhotos.length === 0) return null;
    const idx = Math.floor(Math.random() * currentPhotos.length);
    const randomPhoto = currentPhotos[idx];
    if (randomPhoto != null && randomPhoto.url) {
     setShowPhoto(randomPhoto);
    }
  }

  function handleImageClick() {
    updateRandomImage();
  }

  return (
    <div className="widgets-photo">
      <img src={`${BASE_URL_IMAGES}${showPhoto.url}`}
        alt="Photo Widget"
        className="widgets-photo"
        onClick={handleImageClick}
        style={{ cursor: 'pointer' }}
        title="Click to change photo">
      </img>
    </div>
  );
}

export default PhotoWidget;