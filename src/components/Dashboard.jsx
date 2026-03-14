"use client"

import {useState, useEffect} from 'react'

const Dashboard = () => {
	const [expenses, setExpenses] = useState(0);
	const [budget, setBudget] = useState(1000);

	const formatNumber = (num) => {
		const newNum = num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return newNum;
	}

	return (
		<main className="flex w-full flex-col items-center p-5 ">
			{/* EXPENSES */}
			<section className='flex flex-col py-20 text-center gap-3'>
				<div className='text-2xl py-1'>Total expenses</div>
				<div className='text-5xl py-1 font-bold'>{formatNumber(expenses)} €</div>
				<div className='text-lg py-1 px-4 border rounded-full'>Remaining budget: {formatNumber(budget - expenses)} €</div>
			</section>

		</main>
	)
}

export default Dashboard