"use client"

import {useState, useEffect} from 'react'
import { supabase } from '@/lib/supabase'

const Dashboard = () => {
	const [expenses, setExpenses] = useState(0);
	const [budget, setBudget] = useState(1000);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadData();

		const channel = supabase
			.channel('dashboard-db-changes')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'expenses' },
				(payload) => {
					console.log('Expenses change received:', payload);
					loadData();
				}
			)
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'budgets' },
				(payload) => {
					console.log('Budgets change received:', payload);
					loadData();
				}
			)
			.subscribe((status) => {
				console.log('Subscription status:', status);
			});

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	const loadData = async () => {
		try {
			const { data: expensesData, error: expensesError } = await supabase
				.from('expenses')
				.select('amount');

			if (expensesError) throw expensesError;

			const totalExpenses = expensesData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
			setExpenses(totalExpenses);

			const { data: budgetData, error: budgetError } = await supabase
				.from('budgets')
				.select('amount')
				.order('updated_at', { ascending: false })
				.limit(1)
				.maybeSingle();

			if (budgetError) throw budgetError;

			if (budgetData) {
				setBudget(Number(budgetData.amount));
			} else {
				const { error: insertError } = await supabase
					.from('budgets')
					.insert({ amount: 1000 });

				if (!insertError) {
					setBudget(1000);
				}
			}
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			setLoading(false);
		}
	};

	const formatNumber = (num) => {
		const newNum = num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return newNum;
	}

	const percentage = budget > 0 ? ((budget - expenses) / budget) * 100 : 0;

	if (loading) {
		return (
			<main className="flex w-full flex-col items-center px-5 py-12">
				<div className="text-gray-400">Loading...</div>
			</main>
		);
	}

	return (
		<main className="flex w-full flex-col items-center px-5 py-12">
			<section className='flex flex-col w-full max-w-md text-center gap-6'>
				<div className='flex flex-col gap-2'>
					<div className='text-sm uppercase tracking-wider text-gray-400 font-semibold'>Total Expenses</div>
					<div className='text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent'>
						{formatNumber(expenses)} €
					</div>
				</div>

				<div className='relative w-full h-2 bg-gray-800 rounded-full overflow-hidden shadow-inner'>
					<div
						className='absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 shadow-lg'
						style={{ width: `${Math.min(percentage, 100)}%` }}
					/>
				</div>

				<div className='flex flex-col gap-3 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl'>
					<div className='text-xs uppercase tracking-wider text-gray-400 font-semibold'>Remaining Budget</div>
					<div className='text-3xl font-bold text-gray-100'>
						{formatNumber(budget - expenses)} €
					</div>
					<div className='text-sm text-gray-400'>
						{percentage.toFixed(1)}% of budget remaining
					</div>
				</div>
			</section>
		</main>
	)
}

export default Dashboard