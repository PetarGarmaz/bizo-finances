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
		<button type={type} value={value} onClick={() => handleButton(value)} className={`${className} p-2 rounded-lg transition-all duration-300 ${openDialog == value ? "bg-amber-500" : "bg-gray-600/30"}`}>
			{children}
		</button>
	)
}

export default FooterButton