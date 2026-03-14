"use client"

import React, { useState } from 'react'

const FooterButton = ({type, value, openDialog, setOpenDialog, className, children}) => {
	const [result, setResult] = useState("");

	const handleButton = (value) => {
		if(openDialog === value) {
			setOpenDialog("");
		} else {
			setOpenDialog(value);
		}
	};

	return (
		<button
			type={type}
			value={value}
			onClick={() => handleButton(value)}
			className={`${className} p-3 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
				openDialog == value
					? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50"
					: "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50"
			}`}
		>
			{children}
		</button>
	)
}

export default FooterButton