
// import Navbar from "./components/Navbar";
 // import CozeChat from "./components/CozeAi";
  
  
import TechnicalSpecs from "./component/ui/Thongso";
import CarViewerPage from "./component/ui/Car360";
import Itemslide from "./component/ui/ItemSlide";
import Footer from "./component/ui/Footer";
import Information from "./component/ui/Information";
import Videobg from "./component/ui/Videobg";
import Product from "./component/ui/Product";
import BackgroundSlider from "./component/ui/BackgroundSlide";
 



export default function Home() {
  return (
    <div >
      <BackgroundSlider></BackgroundSlider>
      <Product></Product>
      <CarViewerPage/>
      <TechnicalSpecs/>
      <Videobg></Videobg>
      <Information></Information>
      <Itemslide/>
      {/* <CozeChat/> */}
      <Footer></Footer>
    </div>
  );
}
