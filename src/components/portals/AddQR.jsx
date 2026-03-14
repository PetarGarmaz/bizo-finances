"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import QrScanner from 'qr-scanner';
import { X, Camera, Check, ScanLine } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AddQR = ({openDialog, setOpenDialog}) => {
	const [mounted, setMounted] = useState(false);
	const [error, setError] = useState("");
	const [scannedData, setScannedData] = useState("");
	const [extractedAmount, setExtractedAmount] = useState(null);
	const [amount, setAmount] = useState('');
	const [sourceName, setSourceName] = useState('');
	const [description, setDescription] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [saving, setSaving] = useState(false);
	const videoRef = useRef(null);
	const scannerRef = useRef(null);

	const commonSources = ['Konzum', 'Lidl', 'Plodine', 'Pevex', 'Kaufland', 'Spar', 'Tommy', 'Other'];

	useEffect(() => {
		setMounted(true);
	}, []);


	useEffect(() => {
		if (!mounted) return;
		if (openDialog !== "QR") return;
		if (showForm) return;
		if (!videoRef.current) return;

		const video = videoRef.current;
		setError("");
		setScannedData("");
		setExtractedAmount(null);
		setAmount('');
		setSourceName('');
		setDescription('');
		setSaving(false);

		const handleScan = async (qrData) => {
			console.log("QR detected! Data:", qrData);
			setScannedData(qrData);

			if (scannerRef.current) {
				scannerRef.current.stop();
			}

			let detectedAmount = null;

			if (qrData.includes('porezna.gov.hr')) {
				try {
					const url = new URL(qrData);
					const iznParam = url.searchParams.get('izn');
					if (iznParam) {
						detectedAmount = parseFloat(iznParam.replace(',', '.'));
					}
				} catch (e) {
					console.error("Failed to parse QR link:", e);
				}
			}

			if (!detectedAmount) {
				const amountMatch = qrData.match(/(\d+[.,]\d{2})/);
				if (amountMatch) {
					detectedAmount = parseFloat(amountMatch[1].replace(',', '.'));
				}
			}

			if (detectedAmount) {
				console.log("Extracted amount:", detectedAmount);
				setExtractedAmount(detectedAmount);
				setAmount(detectedAmount.toFixed(2));
				setDescription('QR scanned receipt');
				setShowForm(true);
			} else {
				setError('No amount found in QR code');
			}
		};

		const qrScanner = new QrScanner(
			video,
			result => {
				console.log("QR Scanner callback triggered!");
				handleScan(result.data);
			},
			{
				returnDetailedScanResult: true,
				highlightScanRegion: true,
				highlightCodeOutline: true,
				maxScansPerSecond: 5,
			}
		);

		scannerRef.current = qrScanner;

		qrScanner.start().catch(err => {
			console.error("Scanner start error:", err);
			setError("Camera access denied or unavailable");
		});

		console.log("QR Scanner initialized and started");

		return () => {
			scannerRef.current?.stop();
			scannerRef.current?.destroy();
			scannerRef.current = null;
		};
	}, [openDialog, mounted, showForm]);

	useEffect(() => {
		if (openDialog !== "QR") {
			setShowForm(false);
		}
	}, [openDialog]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		const numAmount = parseFloat(amount);
		if (isNaN(numAmount) || numAmount <= 0) {
			setError('Please enter a valid amount');
			return;
		}

		setSaving(true);
		try {
			const { error } = await supabase
				.from('expenses')
				.insert({
					amount: numAmount,
					source_name: sourceName || null,
					description: description || '',
					source: 'qr_scan',
					receipt_url: scannedData
				});

			if (error) throw error;

			setOpenDialog('');
			setShowForm(false);
		} catch (error) {
			console.error('Error saving expense:', error);
			setError('Failed to save expense');
		} finally {
			setSaving(false);
		}
	};

	const handleRescan = () => {
		setShowForm(false);
		setError('');
		setScannedData('');
		setExtractedAmount(null);
		setAmount('');
		setSourceName('');
		setDescription('');
	};

	return (
		<div>
			{openDialog==="QR" && mounted ? createPortal(
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
					<div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setOpenDialog("")}></div>

					<div className="relative rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border border-gray-700/50 max-w-md w-full mx-4">
						<div className='flex justify-between items-center p-6 border-b border-gray-700/50'>
							<h2 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-2'>
								<ScanLine className="w-6 h-6 text-blue-500" />
								{showForm ? 'Confirm Expense' : 'Scan QR Code'}
							</h2>
							<button
								type='button'
								onClick={() => setOpenDialog("")}
								className='p-2 rounded-lg transition-all duration-300 hover:bg-gray-700/50 active:scale-95'
							>
								<X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
							</button>
						</div>

						{!showForm ? (
							<div className="p-6">
								<div className="relative rounded-xl overflow-hidden bg-black border-2 border-blue-500/30 shadow-lg">
									{error ? (
										<div className="w-full aspect-square flex flex-col items-center justify-center gap-4 p-8">
											<Camera className="w-16 h-16 text-red-400" />
											<p className="text-red-400 text-center font-medium">{error}</p>
											<p className="text-gray-400 text-sm text-center">Please scan another QR code or close this window</p>
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
								<p className="mt-4 text-center text-sm text-gray-400">Position the QR code within the frame</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="p-6 space-y-4">
								{error && (
									<div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
										{error}
									</div>
								)}

								<div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
									<p className="text-green-400 text-sm font-medium flex items-center gap-2">
										<Check className="w-4 h-4" />
										QR Code Scanned Successfully
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Amount (€) *
									</label>
									<input
										type="number"
										step="0.01"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										required
										className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
										placeholder="0.00"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Store / Vendor
									</label>
									<select
										value={sourceName}
										onChange={(e) => setSourceName(e.target.value)}
										className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all"
									>
										<option value="">Select a store...</option>
										{commonSources.map(source => (
											<option key={source} value={source}>{source}</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Description
									</label>
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										rows={3}
										className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all resize-none"
										placeholder="Add notes..."
									/>
								</div>

								<div className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={handleRescan}
										className="flex-1 px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg font-medium transition-all duration-300 hover:bg-gray-700 active:scale-95"
									>
										Rescan
									</button>
									<button
										type="submit"
										disabled={saving}
										className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-blue-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{saving ? 'Saving...' : 'Save Expense'}
									</button>
								</div>
							</form>
						)}
					</div>

				</div>, document.body
			):null}
		</div>
	)
}

export default AddQR