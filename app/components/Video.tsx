import React from "react";
import { FaCheckCircle, FaChargingStation, FaHeadset } from "react-icons/fa";

const Videobg = () => {
  return (
    <div className="w-full">
       <div className='xl:mx-36  md:mx-26 mt-7 mb-7 animate-appeartop [animation-timeline:view()] animation-range-entry '>
        <div className='text-center w-full h-5'>
      <span className='font-semibold text-center xl:text-3xl md:text-2xl text-xl w-full font-serif '>
          Khám phá & sự thoải mái của Gia đình
        </span>
        </div>
        <br />
        <span className='xl:text-lg md:text-lg sm:text-base text-xs text-start'>
          VinFast Ngôn ngữ thiết kế của VinFast kết hợp những đường cong thể
          thao, nét sang trọng và sự hiện diện đáng gờm. Nó tối ưu hóa hiệu
          suất, chức năng và sự đơn giản thanh lịch, thiết lập một tiêu chuẩn
          mới cho các công ty xe điện..
        </span>
      </div>
      <div className="xl:mx-36 md:mx-26 mx-10 animate-appeartop [animation-timeline:view()]  animation-range-entry">
        <video
          className="w-full "
          controls
          loop
          muted
          autoPlay
          playsInline
          poster="https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwd4dadefc/reserves/VF3/vf3.jpg"
        >
          <source
            src="https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw3bedfd7b/reserves/VF3/TVC_VF3_Online_1080.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div>
        <section className="text-center py-9 px-4 bg-white animate-appeartop [animation-timeline:view()] animation-range-entry">
          <h2 className="text-3xl font-semibold">Trải nghiệm của VinFast</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-start">
            VinFast, công ty xe điện mới sáng tạo, ưu tiên nghề thủ công cao cấp
            và các bộ phận chất lượng cao trong việc chế tạo xe điện của mình.
            Được thiết kế để đảm bảo an toàn, độ tin cậy và thoải mái trên mọi
            hành trình.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Warranty Section */}
            <div className=" md:border-blue-500 p-4 flex flex-col items-center border-2 border-blue-500 rounded-2xl">
              <FaCheckCircle className="text-4xl text-black" />
              <h3 className="text-xl font-semibold mt-4">
                Bảo hành 10 năm / 125.000 dặm
              </h3>
              <a href="#" className="text-blue-500 mt-2 hover:underline">
                Khám phá Bảo hành →
              </a>
            </div>

            {/* Charging Section */}
            <div className="md:border-blue-500 p-4 flex flex-col items-center border-2 border-blue-500 rounded-2xl">
              <FaChargingStation className="text-4xl text-black" />
              <h3 className="text-xl font-semibold mt-4">
                Phạm vi phủ sóng trạm sạc EV 95%
              </h3>
              <a href="#" className="text-blue-500 mt-2 hover:underline">
                Khám phá sạc →
              </a>
            </div>

            {/* Service Section */}
            <div className="md:border-blue-500 p-4 flex flex-col items-center border-2 border-blue-500 rounded-2xl">
              <FaHeadset className="text-4xl text-black" />
              <h3 className="text-xl font-semibold mt-4">Dịch vụ xuất sắc</h3>
              <a href="#" className="text-blue-500 mt-2 hover:underline">
                Khám phá dịch vụ →
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Videobg;
