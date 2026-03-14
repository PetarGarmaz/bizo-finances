import React from 'react'
import Image from "next/image";

const Header = () => {
	return (
		<nav className='flex py-6 px-8 justify-between items-center bg-gradient-to-b from-gray-900 via-gray-800 to-transparent backdrop-blur-lg border-b border-gray-700/50 shadow-xl'>
			<div className='flex flex-col gap-1'>
				<div className='text-sm text-gray-400 font-medium'>Welcome back,</div>
				<div className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent'>Bizo</div>
			</div>
			<Image
				src={"/bizo_image.png"}
				alt='bizo-image'
				height={56}
				width={56}
				className='rounded-full ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 shadow-lg hover:ring-blue-400 transition-all duration-300'
			/>
		</nav>
	)
}

export default Header