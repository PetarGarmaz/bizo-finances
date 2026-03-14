import React from 'react'
import Image from "next/image";

const Header = () => {
	return (
		<nav className='flex py-5 px-10 justify-between bg-gray-600/30 rounded-b-lg'>
			<div className='flex-col text-lg'>
				<div>Welcome back,</div>
				<div>Bizo!</div>
			</div>
			<Image src={"/bizo_image.png"} alt='bizo-image' height={60} width={60} className='rounded-full ring-2 ring-amber-500'/>
		</nav>
	)
}

export default Header