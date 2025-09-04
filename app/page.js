import Image from "next/image";
import {HeroSection} from '../components/Hero.jsx'
import {FeaturesSection} from '../components/Features.jsx'
import {DemoPreviewSection} from '../components/Demo.jsx'
import {MotivationSection} from '../components/Motivation.jsx'

export default function Home() {
  return (
    <div >
      <HeroSection/>
      <FeaturesSection/>
      <DemoPreviewSection/>
      <MotivationSection/>
    </div>
  );
}
