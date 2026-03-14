"use client"

import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { ScanLine, History, Settings, CirclePlus as PlusCircle, CircleMinus as MinusCircle } from 'lucide-react';
import FooterButton from '@/components/ui/FooterButton';
import AddQR from '@/components/portals/AddQR';


const Footer = () => {
	const [openDialog, setOpenDialog] = useState("");

	return (
		<footer className='flex fixed bottom-0 p-6 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent backdrop-blur-lg border-t border-gray-700/50 justify-around items-center w-full shadow-2xl'>
			<AddQR openDialog={openDialog} setOpenDialog={setOpenDialog}/>

			<FooterButton type="button" value="BUDGET" openDialog={openDialog} setOpenDialog={setOpenDialog} className="">
				<PlusCircle className='w-10 h-10'/>
			</FooterButton>
			<FooterButton type="button" value="EXPENSE" openDialog={openDialog} setOpenDialog={setOpenDialog} className="">
				<MinusCircle className='w-10 h-10'/>
			</FooterButton>
			<FooterButton type="button" value="QR" openDialog={openDialog} setOpenDialog={setOpenDialog} className="">
				<ScanLine className='w-14 h-14'/>
			</FooterButton>
			<FooterButton type="button" value="HISTORY" openDialog={openDialog} setOpenDialog={setOpenDialog} className="">
				<History className='w-10 h-10'/>
			</FooterButton>
			<FooterButton type="button" value="SETTINGS" openDialog={openDialog} setOpenDialog={setOpenDialog} className="">
				<Settings className='w-10 h-10'/>
			</FooterButton>			
		</footer>
	)
}

export default Footer

/*<button type='button' value="BUDGET" onClick={(e) => handleButton(e.target.value)} className={`p-2 ${openDialog == "BUDGET" && "bg-amber-500"}`}></button>
			<button type='button' value="EXPENSE" onClick={(e) => handleButton(e.target.value)} className='p-2 '><MinusCircle className='w-10 h-10'/></button>
			<button type='button' value="QR" onClick={(e) => handleButton(e.target.value)} className='p-2 rounded-lg hover:bg-zinc-700 active:'><ScanLine className='w-14 h-14'/></button>
			<button type='button' value="HISTORY" onClick={(e) => handleButton(e.target.value)} className='p-2 '><History className='w-10 h-10'/></button>
			<button type='button' value="SETTINGS" onClick={(e) => handleButton(e.target.value)} className='p-2 '><Settings className='w-10 h-10'/></button>*/