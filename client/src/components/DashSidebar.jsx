import {Sidebar} from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import  { useState ,useEffect} from 'react'
import {useLocation,Link} from 'react-router-dom'
import {signoutSuccess} from '../redux//user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
export default function DashSidebar() {
    const location =useLocation();
    const { currentUser } = useSelector((state) => state.user);
  const [tab,setTab]=useState('');
  const dispatch=useDispatch();
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search]
)
const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
            <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={ 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === 'users'}
                icon={HiDocumentText}
                as='div'
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
                <Sidebar.Item  onClick={handleSignout}icon={HiArrowSmRight} className='cursor-pointer'>
                    Signout
                </Sidebar.Item>
                
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
