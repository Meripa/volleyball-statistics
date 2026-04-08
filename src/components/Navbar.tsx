import {Link} from 'react-router-dom'
import logo from '../assets/images/logo.png'

const Navbar = () => {
  return (
    <nav className="relative container mx-auto p-6" >
        <div className="flex items-center justify-between ">
            <div className="pt-2">
                <img src={logo} alt="" className=' h-10 w-18 '/>
            </div>
            <div className="hidden md:flex space-x-6">
                <Link to='/' className='hover:text-white text-gray-400 border-amber-400'>RallyIQ</Link>
                <Link to='/newmatch' className='hover:text-white text-gray-400'>New Match</Link>
            </div>
        </div>
    </nav>
  )
}

export default Navbar