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
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
					<div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setOpenDialog("")}></div>

					<div className="relative rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border border-gray-700/50 max-w-md w-full mx-4">
						<div className='flex justify-between items-center p-6 border-b border-gray-700/50'>
							<h2 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent'>Scan QR Code</h2>
							<button
								type='button'
								onClick={() => setOpenDialog("")}
								className='p-2 rounded-lg transition-all duration-300 hover:bg-gray-700/50 active:scale-95'
							>
								<X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
							</button>
						</div>

						<div className="p-6">
							<div className="relative rounded-xl overflow-hidden bg-black/50 border-2 border-blue-500/30 shadow-lg">
								<video ref={videoRef} muted playsInline className="w-full aspect-square object-cover" />
								<div className="absolute inset-0 pointer-events-none">
									<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-500 rounded-lg shadow-lg shadow-blue-500/50"></div>
								</div>
							</div>
							<p className="mt-4 text-center text-sm text-gray-400">Position the QR code within the frame</p>
						</div>
					</div>

				</div>, document.body
			):null}
		</div>
	)
}

export default AddQR