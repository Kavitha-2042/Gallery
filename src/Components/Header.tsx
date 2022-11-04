import axios from 'axios'
import React,{useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppState } from '../Redux/Hooks'
import { initialize } from '../Redux/Slice/userSlice'

const Header = () => {

    const dispatch = useAppDispatch()
    const auth = useAppState((state)=>{
        return state.user.auth
    })

    console.log("AUTH: ",auth)

    useEffect(()=>{
        axios.get('/user/status')
        .then((statusResponse)=>{
          console.log("Status: ", statusResponse)
          console.log("auth", statusResponse.data.auth)
            dispatch(initialize({user:statusResponse.data.user, auth:statusResponse.data.auth}))
        })
        .catch(err=>console.log(err))
    },[dispatch,auth])

  return (
    <div className='flex justify-between bg-blue-500 p-4 text-white text-xl'>
      <Link to='/' className='flex '>Home</Link>
      {
        auth?
        <div className='flex justify-between space-x-4'>
          <Link to='/imageupload'>All images</Link>
        <Link to='/profile'>Profile</Link>
        <Link to='/signout'>Signout</Link>
        </div>
        :
        <div className='flex justify-between space-x-4'>
        <Link to='/signup'>Signup</Link>
        <Link to='/signin'>Signin</Link>
        </div>
      }
      
    </div>
  )
}

export default Header
