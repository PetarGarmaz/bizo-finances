"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import QrScanner from 'qr-scanner';
import { X } from 'lucide-react';

const AddQR = ({openDialog, setOpenDialog}) => {
	const [mounted, setMounted] = useState(false);
	const videoRef = useRef(null);
	const scannerRef = useRef(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		if (!openDialog) return;
		if (!videoRef.current) return;

		const video = videoRef.current;

		scannerRef.current = new QrScanner(
		video,
		result => {
			console.log("decoded qr code:", result.data);
		},
		{ returnDetailedScanResult: true },
		{preferredCamera: "environment"}
		);

		scannerRef.current.start();

		return () => {
		scannerRef.current?.stop();
		scannerRef.current?.destroy();
		scannerRef.current = null;
		};
	}, [openDialog, mounted]);

	return (
		<div>
			{openDialog==="QR" && mounted ? createPortal(
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center ">
					<div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

					<div className="relative rounded-lg bg-zinc-800 font-bold">
						<div className='flex gap-20'>
							<h2 className='p-4 uppercase text-2xl tracking-wide'>Scan receipt</h2>
							<button type='button' onClick={() => setOpenDialog("")} className={`flex items-center `}>
								<X className="w-10 h-10 mr-2 p-2 rounded-lg transition duration-300 hover:bg-neutral-700" />
							</button>
						</div>
						
						<video ref={videoRef} muted playsInline className="mt-4 rounded-lg w-[400px] p-5"	/>
					</div>

				</div>, document.body
			):null}
		</div>
	)
}

export default AddQR