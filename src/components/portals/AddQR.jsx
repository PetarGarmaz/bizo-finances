"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import QrScanner from 'qr-scanner';
import { X, Camera, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AddQR = ({openDialog, setOpenDialog}) => {
	const [mounted, setMounted] = useState(false);
	const [error, setError] = useState("");
	const [scannedData, setScannedData] = useState("");
	const [extractedAmount, setExtractedAmount] = useState(null);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const videoRef = useRef(null);
	const scannerRef = useRef(null);

	useEffect(() => {
		setMounted(true);
	}, []);


	useEffect(() => {
		if (!mounted) return;
		if (openDialog !== "QR") return;
		if (!videoRef.current) return;

		const video = videoRef.current;
		setError("");
		setScannedData("");
		setExtractedAmount(null);
		setSaving(false);
		setSaved(false);

		const handleScan = async (qrData) => {
			setScannedData(qrData);

			if (qrData.includes('porezna.gov.hr')) {
				try {
					const url = new URL(qrData);
					const iznParam = url.searchParams.get('izn');
					if (iznParam) {
						const amount = parseFloat(iznParam.replace(',', '.'));
						console.log("Extracted amount:", amount);
						setExtractedAmount(amount);

						setSaving(true);
						try {
							const { error } = await supabase
								.from('expenses')
								.insert({
									amount: amount,
									description: 'QR scanned receipt',
									source: 'qr_scan',
									receipt_url: qrData
								});

							if (error) throw error;

							setSaved(true);

							setTimeout(() => {
								scannerRef.current?.stop();
								setOpenDialog("");
							}, 2000);

						} catch (error) {
							console.error('Error saving expense:', error);
							setError('Failed to save expense');
						} finally {
							setSaving(false);
						}
					}
				} catch (e) {
					console.error("Failed to parse QR link:", e);
				}
			}
		};

		scannerRef.current = new QrScanner(
			video,
			result => {
				console.log("decoded qr code:", result.data);
				handleScan(result.data);
			},
			{
				returnDetailedScanResult: true,
				highlightScanRegion: true,
				highlightCodeOutline: true,
			}
		);

		scannerRef.current.start().catch(err => {
			console.error("Scanner error:", err);
			setError("Camera access denied or unavailable");
		});

		return () => {
			scannerRef.current?.stop();
			scannerRef.current?.destroy();
			scannerRef.current = null;
		};
	}, [openDialog, mounted, setOpenDialog]);

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
							<div className="relative rounded-xl overflow-hidden bg-black border-2 border-blue-500/30 shadow-lg">
								{error ? (
									<div className="w-full aspect-square flex flex-col items-center justify-center gap-4 p-8">
										<Camera className="w-16 h-16 text-red-400" />
										<p className="text-red-400 text-center font-medium">{error}</p>
										<p className="text-gray-400 text-sm text-center">Please allow camera access in your browser settings</p>
									</div>
								) : (
									<>
										<video ref={videoRef} muted playsInline autoPlay className="w-full aspect-square object-cover" />
										<div className="absolute inset-0 pointer-events-none">
											<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-500 rounded-lg shadow-lg shadow-blue-500/50"></div>
										</div>
									</>
								)}
							</div>
							{scannedData ? (
								<div className="mt-4 space-y-3">
									{extractedAmount !== null && (
										<div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
											<p className="text-green-400 text-sm font-medium">Amount Detected:</p>
											<p className="text-white text-2xl font-bold mt-1">{extractedAmount.toFixed(2)} €</p>
											{saved && (
												<div className="flex items-center gap-2 mt-2 text-green-400">
													<Check className="w-5 h-5" />
													<span className="text-sm font-medium">Expense saved!</span>
												</div>
											)}
											{saving && !saved && (
												<p className="text-sm text-gray-400 mt-2">Saving...</p>
											)}
										</div>
									)}
									<div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
										<p className="text-blue-400 text-sm font-medium">Scanned Data:</p>
										<p className="text-gray-300 text-xs mt-1 break-all">{scannedData}</p>
									</div>
								</div>
							) : (
								<p className="mt-4 text-center text-sm text-gray-400">Position the QR code within the frame</p>
							)}
						</div>
					</div>

				</div>, document.body
			):null}
		</div>
	)
}

export default AddQR