import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
	return (
		<div className="font-sans">
			<Header/>
			<Dashboard/>
			<Footer/>
		</div>
	);
}
