import './PhotoWidget.css';
import { useEffect, useState } from "react";  

// 动态导入所有图片
const importImages = () => {
  const images = {};
  const imageFiles = [
    '2020-11-02.jpg', '2020-11-02.jpg', '2020-11-02.jpg', '2020-11-02.jpg', '2020-11-02.jpg'
  ];
  
  imageFiles.forEach(fileName => {
    try {
      images[fileName] = require(`../../assets/images/${fileName}`);
    } catch (err) {
      console.warn(`Could not load image: ${fileName}`);
    }
  });
  
  return images;
};

const availableImages = importImages();

function getRandomImage() {
    const imageKeys = Object.keys(availableImages);
    if (imageKeys.length === 0) {
        console.warn('No images available');
        return null;
    }
    const randomKey = imageKeys[Math.floor(Math.random() * imageKeys.length)];
    return availableImages[randomKey];
}

function PhotoWidget() {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    // 初始加载照片
    loadNewPhoto();
  }, []);

  function loadNewPhoto() {
    const newPhoto = getRandomImage();
    if (newPhoto) {
      setPhotoUrl(newPhoto);
    }
  }

  return (
    <div className="widgets-photo">
      <img src={photoUrl}
        alt="Photo Widget"
        className="widgets-photo"
        onClick={loadNewPhoto}
        style={{ cursor: 'pointer' }}
        title="Click to change photo">
      </img>
    </div>
  );
}

export default PhotoWidget;