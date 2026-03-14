"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, TriangleAlert as AlertTriangle, Database } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const OpenSettings = ({ openDialog, setOpenDialog }) => {
	const [mounted, setMounted] = useState(false);
	const [stats, setStats] = useState({ expenses: 0, budgets: 0 });
	const [loading, setLoading] = useState(false);
	const [showConfirm, setShowConfirm] = useState(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (openDialog === 'SETTINGS') {
			loadStats();
		}
	}, [openDialog]);

	const loadStats = async () => {
		setLoading(true);
		try {
			const [expensesResult, budgetsResult] = await Promise.all([
				supabase.from('expenses').select('id', { count: 'exact', head: true }),
				supabase.from('budgets').select('id', { count: 'exact', head: true })
			]);

			setStats({
				expenses: expensesResult.count || 0,
				budgets: budgetsResult.count || 0
			});
		} catch (error) {
			console.error('Error loading stats:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleClearExpenses = async () => {
		try {
			const { error } = await supabase
				.from('expenses')
				.delete()
				.neq('id', '00000000-0000-0000-0000-000000000000');

			if (error) throw error;

			setShowConfirm(null);
			loadStats();
		} catch (error) {
			console.error('Error clearing expenses:', error);
			alert('Failed to clear expenses');
		}
	};

	const handleClearBudgets = async () => {
		try {
			const { error } = await supabase
				.from('budgets')
				.delete()
				.neq('id', '00000000-0000-0000-0000-000000000000');

			if (error) throw error;

			setShowConfirm(null);
			loadStats();
		} catch (error) {
			console.error('Error clearing budgets:', error);
			alert('Failed to clear budgets');
		}
	};

	const handleClearAll = async () => {
		try {
			await Promise.all([
				supabase.from('expenses').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
				supabase.from('budgets').delete().neq('id', '00000000-0000-0000-0000-000000000000')
			]);

			setShowConfirm(null);
			loadStats();
		} catch (error) {
			console.error('Error clearing all data:', error);
			alert('Failed to clear data');
		}
	};

	return (
		<div>
			{openDialog === "SETTINGS" && mounted ? createPortal(
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
					<div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setOpenDialog("")}></div>

					<div className="relative rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border border-gray-700/50 max-w-md w-full mx-4">
						<div className='flex justify-between items-center p-6 border-b border-gray-700/50'>
							<h2 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent flex items-center gap-2'>
								<Database className="w-6 h-6 text-gray-400" />
								Settings
							</h2>
							<button
								type='button'
								onClick={() => setOpenDialog("")}
								className='p-2 rounded-lg transition-all duration-300 hover:bg-gray-700/50 active:scale-95'
							>
								<X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
							</button>
						</div>

						<div className="p-6 space-y-6">
							<div className="space-y-3">
								<h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
									Database Statistics
								</h3>
								<div className="grid grid-cols-2 gap-3">
									<div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
										<p className="text-xs text-gray-400 mb-1">Expenses</p>
										<p className="text-2xl font-bold text-white">{stats.expenses}</p>
									</div>
									<div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
										<p className="text-xs text-gray-400 mb-1">Budgets</p>
										<p className="text-2xl font-bold text-white">{stats.budgets}</p>
									</div>
								</div>
							</div>

							<div className="border-t border-gray-700/50 pt-6">
								<h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
									<AlertTriangle className="w-4 h-4 text-yellow-500" />
									Danger Zone
								</h3>
								<div className="space-y-3">
									<button
										onClick={() => setShowConfirm('expenses')}
										className="w-full px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-500/20 active:scale-95 flex items-center justify-center gap-2"
									>
										<Trash2 className="w-4 h-4" />
										Clear All Expenses
									</button>

									<button
										onClick={() => setShowConfirm('budgets')}
										className="w-full px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg font-medium transition-all duration-300 hover:bg-yellow-500/20 active:scale-95 flex items-center justify-center gap-2"
									>
										<Trash2 className="w-4 h-4" />
										Clear All Budgets
									</button>

									<button
										onClick={() => setShowConfirm('all')}
										className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg font-medium transition-all duration-300 hover:bg-red-500/20 active:scale-95 flex items-center justify-center gap-2"
									>
										<Trash2 className="w-4 h-4" />
										Clear All Data
									</button>
								</div>
							</div>

							<div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
								<p className="text-blue-400 text-xs">
									Version 1.0.0 - Bizo Finances
								</p>
							</div>
						</div>
					</div>

					{showConfirm && (
						<div className="fixed inset-0 z-[60] flex items-center justify-center">
							<div className="absolute inset-0 bg-black/60" onClick={() => setShowConfirm(null)}></div>
							<div className="relative bg-gray-900 border border-red-500/50 rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
								<div className="flex items-center gap-3 mb-4">
									<AlertTriangle className="w-6 h-6 text-red-500" />
									<h3 className="text-lg font-bold text-white">Confirm Action</h3>
								</div>
								<p className="text-gray-300 mb-6">
									Are you sure you want to clear{' '}
									{showConfirm === 'expenses' ? 'all expenses' :
									 showConfirm === 'budgets' ? 'all budgets' :
									 'all data'}? This action cannot be undone.
								</p>
								<div className="flex gap-3">
									<button
										onClick={() => setShowConfirm(null)}
										className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
									>
										Cancel
									</button>
									<button
										onClick={() => {
											if (showConfirm === 'expenses') handleClearExpenses();
											else if (showConfirm === 'budgets') handleClearBudgets();
											else handleClearAll();
										}}
										className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all"
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					)}
				</div>, document.body
			) : null}
		</div>
	);
};

export default OpenSettings;
