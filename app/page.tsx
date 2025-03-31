
import CarViewerPage from "./components/Car360";
import BackgroundSlider from "./components/Carousel";
import Footer from "./components/Footer";
import Information from "./components/Information";
import Itemslide from "./components/LogoSlide";
import Navbar from "./components/Navbar";
import Product from "./components/Product";
import TechnicalSpecs from "./components/Technical";
import Videobg from "./components/Video";



export default function Home() {
  return (
    <div data-theme="light">
      <BackgroundSlider></BackgroundSlider>
      <Product></Product>
      <CarViewerPage/>
      <TechnicalSpecs/>
      <Videobg></Videobg>
      <Information></Information>
      <Itemslide/>
      <Footer></Footer>
    </div>
  );
}
