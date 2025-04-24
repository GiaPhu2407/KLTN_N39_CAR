import React from 'react';

const Information = () => {
  return (
    <div className="w-full min-h-screen bg-white py-12" data-theme="light">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">Pin & Trạm Sạc VinFast</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* First card */}
          <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src="https://storage.googleapis.com/vinfast-data-01/pin-tramsac-2_1660273363.png"
                alt="Pin ô tô điện"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500">
              <h2 className="text-xl md:text-2xl font-bold mb-2 transform transition-all duration-500 group-hover:translate-y-[-70px]">
                Pin & Trạm sạc ô tô điện
              </h2>
              <p className="text-sm md:text-base opacity-0 transform translate-y-8 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                Với phương châm luôn đặt lợi ích Khách hàng lên hàng đầu, VinFast áp dụng chính sách cho thuê pin độc đáo, ưu việt và khác biệt với tất cả các mô hình cho thuê pin từ trước tới nay trên thế giới.
              </p>
            </div>
          </div>

          {/* Second card */}
          <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src="https://storage.googleapis.com/vinfast-data-01/pin-tramsac-1_1660273470.png"
                alt="Trạm sạc ô tô điện"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500">
              <h2 className="text-xl md:text-2xl font-bold mb-2 transform transition-all duration-500 group-hover:translate-y-[-70px]">
                Trạm sạc ô tô điện
              </h2>
              <p className="text-sm md:text-base opacity-0 transform translate-y-8 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                Nếu Khách hàng di chuyển nhiều hàng tháng thì chi phí thuê pin theo gói cố định và tiền sạc điện sẽ rẻ hơn tiền xăng hàng tháng khi dùng xe xăng cùng hạng.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile charging section */}
        <div className="mt-12 lg:mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Thiết bị sạc di động</h2>
              <p className="text-base md:text-lg text-gray-700 mb-6">
                VinFast cung cấp đa dạng giải pháp sạc để đáp ứng nhu cầu sử dụng của khách hàng một cách thuận tiện nhất.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="font-medium">Sạc nhanh tiện lợi</p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="font-medium">An toàn tuyệt đối</p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="font-medium">Bảo hành dài hạn</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg blur opacity-25"></div>
                <img 
                  src="https://shop.vinfastauto.com/on/demandware.static/-/Sites-vinfast_vn_master/default/dw3060cd2a/images/Accessory/EEH20000204/1.png" 
                  alt="Thiết bị sạc di động"
                  className="relative rounded-lg w-full h-auto shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Call to action section */}
        <div className="mt-16 text-center">
  <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 md:p-12 rounded-xl shadow-xl bg-cover bg-center" style={{backgroundImage: "url('https://vinfastauto.com/themes/porto/img/homepage-v2/join-the-charge.webp')"}}>
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Khám phá ngay hôm nay</h2>
    <p className="text-white text-lg mb-8">Trải nghiệm cùng VinFast - Nâng tầm di chuyển xanh, tiết kiệm chi phí</p>
    <button className="bg-white text-green-600 hover:bg-green-50 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
      Tìm hiểu thêm
    </button>
  </div>
</div>
      </div>
    </div>
  );
};

export default Information;