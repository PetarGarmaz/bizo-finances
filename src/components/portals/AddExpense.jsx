"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Minus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AddExpense = ({ openDialog, setOpenDialog }) => {
	const [mounted, setMounted] = useState(false);
	const [amount, setAmount] = useState('');
	const [sourceName, setSourceName] = useState('');
	const [description, setDescription] = useState('');
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	const commonSources = ['Konzum', 'Lidl', 'Plodine', 'Pevex', 'Kaufland', 'Spar', 'Tommy', 'Other'];

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (openDialog === 'EXPENSE') {
			setAmount('');
			setSourceName('');
			setDescription('');
			setError('');
			setSaving(false);
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
					source: 'manual'
				});

			if (error) throw error;

			setOpenDialog('');
		} catch (error) {
			console.error('Error saving expense:', error);
			setError('Failed to save expense');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div>
			{openDialog === "EXPENSE" && mounted ? createPortal(
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
					<div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setOpenDialog("")}></div>

					<div className="relative rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border border-gray-700/50 max-w-md w-full mx-4">
						<div className='flex justify-between items-center p-6 border-b border-gray-700/50'>
							<h2 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent flex items-center gap-2'>
								<Minus className="w-6 h-6 text-red-500" />
								Add Expense
							</h2>
							<button
								type='button'
								onClick={() => setOpenDialog("")}
								className='p-2 rounded-lg transition-all duration-300 hover:bg-gray-700/50 active:scale-95'
							>
								<X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-4">
							{error && (
								<div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
									{error}
								</div>
							)}

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
									className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
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
									className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-white transition-all"
								>
									<option value="">Select a store...</option>
									{commonSources.map(source => (
										<option key={source} value={source}>{source}</option>
									))}
								</select>
							</div>

							{sourceName === 'Other' && (
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Custom Store Name
									</label>
									<input
										type="text"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
										placeholder="Enter store name"
									/>
								</div>
							)}

							{sourceName !== 'Other' && (
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Description (Optional)
									</label>
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										rows={3}
										className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all resize-none"
										placeholder="What did you buy?"
									/>
								</div>
							)}

							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={() => setOpenDialog('')}
									className="flex-1 px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg font-medium transition-all duration-300 hover:bg-gray-700 active:scale-95"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={saving}
									className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium shadow-lg shadow-red-500/30 transition-all duration-300 hover:shadow-red-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{saving ? 'Saving...' : 'Add Expense'}
								</button>
							</div>
						</form>
					</div>
				</div>, document.body
			) : null}
		</div>
	);
};

export default AddExpense;