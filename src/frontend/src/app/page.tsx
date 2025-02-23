import Image from "next/image";
import Navbar from "./components/Navbar";
import Herosection from "./home/Herosection";
import Use from "./home/Use";
export default function Home() {
  return (
    <div >
			<Navbar />
			<Herosection />
			<Use />
		</div>
  );
}
