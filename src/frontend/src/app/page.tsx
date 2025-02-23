import Image from "next/image";
import Herosection from "./home/Herosection";
import Use from "./home/Use";
export default function Home() {
  return (
    <div className="bg-white text-black" >
			<Herosection />
			<Use />
		</div>
  );
}
