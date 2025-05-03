"use client"
import React, { useState, useEffect, useRef } from 'react';
import PanoramaViewer from './Image360';
interface ColorToFolderMap {
  [key: string]: string;
}
const CarViewerPage: React.FC = () => {
  const [currentColor, setCurrentColor] = useState<string>('yellow');
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalImages = 36; // Total number of images
  const carColors = ['red', 'blue', 'pink', 'white', 'silver', 'yellow'];
  const colorToFolder: ColorToFolderMap = {
  };

  useEffect(() => {

  }, );

  // Handle drag to rotate image
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {

  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {

  };

  const handleMouseUp = () => setIsDragging(false);

  const getCurrentImageSrc = () => {
    const folder = colorToFolder[currentColor] || currentColor;
    return `/images/vinfast/${folder}/${currentIndex}.png`;
  };

  return (
    <div className="flex mt-14 px-20 flex-col min-h-screen">
      <div className='w-full h-full '>
        <p className='font-bold text-3xl'>VinFast VF 3 - Unleash Your Creativity, Shine Your Unique Style!</p>
        <p>
With a diverse and unique exterior color range, featuring seven trendy and youthful color options, the VF 3 is the perfect choice to 
freely express your individuality and personality. No matter who you are, choose the color and features of the VF 3 that suit your preferences, and let VinFast turn your dreams into reality</p>
      </div>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-gray-100 rounded-lg shadow-lg overflow-hidden" style={{ height: '500px' }}>
            {/* Car Viewer Component */}
            <div
              ref={containerRef}
              className="relative w-full h-full flex items-center bg-white justify-center select-none cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              style={{ touchAction: 'none' }}
            >
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75">
                  <div className="text-xl font-semibold mb-2 text-blue-500">Đang tải hình ảnh VinFast...</div>
                  <div className="w-64 bg-white rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${(imagesLoaded / totalImages) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2">{imagesLoaded} / {totalImages}</div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center p-4">
                  <p className="font-bold">Lỗi tải hình ảnh:</p>
                  <p>{error}</p>
                  <p className="mt-4 text-sm">
                    Kiểm tra xem hình ảnh có đúng cấu trúc thư mục:<br />
                    /public/images/vinfast/{colorToFolder[currentColor]}/1.png đến {totalImages}.png
                  </p>
                </div>
              ) : (
                <>
                  <img
                    src={getCurrentImageSrc()}
                    alt={`VinFast car in ${currentColor} color, view ${currentIndex}`}
                    className="max-w-full max-h-full object-contain"
                    draggable="false"
                  />
                  <div className="absolute bottom-4 left-4 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    Giữ kéo để xoay
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">VinFast VF3</h2>
            <p className="text-gray-700 mb-6">
              Trải nghiệm mẫu xe hạng sang với khả năng vận hành mạnh mẽ và thiết kế hiện đại.
              Xem xe từ mọi góc độ với công nghệ xem 360 độ.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Chọn màu xe</h3>
              <div className="flex flex-wrap gap-2">
                {carColors.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 ${
                      currentColor === color ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: 
                        color === 'silver' ? '#C0C0C0' : 
                        color === 'yellow' ? '#FFD700' : color 
                    }}
                    onClick={() => setCurrentColor(color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
            
            <div className="mb-6 flex">
              <div>
              <h3 className="text-lg font-semibold mb-2">Thông số kỹ thuật</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Động cơ: 2.0L Turbo</li>
                <li>Công suất: 245 mã lực</li>
                <li>Mô-men xoắn: 350 Nm</li>
                <li>Hộp số: Tự động 8 cấp</li>
                <li>Dẫn động: AWD</li>
              </ul>
              </div>
              <div className='flex-1 justify-items-end'>
            <PanoramaViewer />
            </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default CarViewerPage;