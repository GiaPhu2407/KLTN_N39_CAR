import CarViewerPage from "./components/Car360";
import BackgroundSlider from "./components/Carousel";
import CozeChat from "./components/CozeAi";
import Footer from "./components/Footer";
import Information from "./components/Information";
import Itemslide from "./components/LogoSlide";
import Navbar from "./components/Navbar";
import Product from "./components/Product";
import TechnicalSpecs from "./components/Technical";
import Videobg from "./components/Video";
export default function Home() {
  return (
    <div>
      <BackgroundSlider></BackgroundSlider>
      <Product></Product>
      <CarViewerPage/>
      <TechnicalSpecs/>
      <Videobg></Videobg>
      <Information></Information>
      <Itemslide/>
      <CozeChat/>
      <Footer></Footer>
    </div>
  );
}
  
  

