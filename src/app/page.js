import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
			<Header/>
			<Dashboard/>
			<Footer/>
		</div>
	);
}
