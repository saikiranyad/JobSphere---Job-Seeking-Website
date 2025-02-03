import Header from "../components/common/Header";

import Logout from "../components/settings/Logout";

import Profile from "../components/settings/Profile";


const SettingsPage = ({onLogout}) => {
	return (
		<div className='flex-1 overflow-auto relative z-10 '>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				
				<Logout onLogout = {onLogout}/>
			</main>
		</div>
	);
};
export default SettingsPage;
