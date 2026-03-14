"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, Receipt, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const OpenHistory = ({ openDialog, setOpenDialog }) => {
	const [mounted, setMounted] = useState(false);
	const [expenses, setExpenses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (openDialog === 'HISTORY') {
			loadHistory();
		}
	}, [openDialog]);

	const loadHistory = async () => {
		setLoading(true);
		setError('');
		try {
			const { data, error } = await supabase
				.from('expenses')
				.select('*')
				.order('created_at', { ascending: false });

			if (error) throw error;
			setExpenses(data || []);
		} catch (error) {
			console.error('Error loading history:', error);
			setError('Failed to load history');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm('Are you sure you want to delete this expense?')) return;

		try {
			const { error } = await supabase
				.from('expenses')
				.delete()
				.eq('id', id);

			if (error) throw error;

			setExpenses(expenses.filter(exp => exp.id !== id));
		} catch (error) {
			console.error('Error deleting expense:', error);
			setError('Failed to delete expense');
		}
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<div>
			{openDialog === "HISTORY" && mounted ? createPortal(
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
					<div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setOpenDialog("")}></div>

					<div className="relative rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border border-gray-700/50 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
						<div className='flex justify-between items-center p-6 border-b border-gray-700/50'>
							<h2 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-2'>
								<Receipt className="w-6 h-6 text-blue-500" />
								Expense History
							</h2>
							<button
								type='button'
								onClick={() => setOpenDialog("")}
								className='p-2 rounded-lg transition-all duration-300 hover:bg-gray-700/50 active:scale-95'
							>
								<X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
							</button>
						</div>

						<div className="flex-1 overflow-y-auto p-6">
							{error && (
								<div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mb-4">
									{error}
								</div>
							)}

							{loading ? (
								<div className="text-center py-8 text-gray-400">Loading...</div>
							) : expenses.length === 0 ? (
								<div className="text-center py-12">
									<Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
									<p className="text-gray-400">No expenses yet</p>
									<p className="text-gray-500 text-sm mt-2">Start adding expenses to see them here</p>
								</div>
							) : (
								<div className="space-y-3">
									{expenses.map((expense) => (
										<div
											key={expense.id}
											className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-gray-600/50 transition-all group"
										>
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<span className="text-xl font-bold text-white">
															{Number(expense.amount).toFixed(2)} €
														</span>
														{expense.source === 'qr_scan' && (
															<span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
																QR Scan
															</span>
														)}
													</div>

													{expense.source_name && (
														<p className="text-sm font-medium text-gray-300">
															{expense.source_name}
														</p>
													)}

													{expense.description && (
														<p className="text-sm text-gray-400 mt-1">
															{expense.description}
														</p>
													)}

													<div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
														<Calendar className="w-3 h-3" />
														{formatDate(expense.created_at)}
													</div>
												</div>

												<button
													onClick={() => handleDelete(expense.id)}
													className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
													title="Delete expense"
												>
													<Trash2 className="w-5 h-5" />
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						<div className="p-6 border-t border-gray-700/50 bg-gray-900/50">
							<div className="flex justify-between items-center text-sm">
								<span className="text-gray-400">Total Expenses:</span>
								<span className="text-xl font-bold text-white">
									{expenses.reduce((sum, exp) => sum + Number(exp.amount), 0).toFixed(2)} €
								</span>
							</div>
						</div>
					</div>
				</div>, document.body
			) : null}
		</div>
	);
};

export default OpenHistory;
