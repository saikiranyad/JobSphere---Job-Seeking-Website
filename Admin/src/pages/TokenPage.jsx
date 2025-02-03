import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { Package } from "lucide-react";


import TokenTable from "../components/token/TokenTable";

const TokenPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Tokens' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total tokens' icon={Package} value={1234} color='#6366F1' />
					
				</motion.div>

				<TokenTable />

				
			
			</main>
		</div>
	);
};
export default TokenPage;
