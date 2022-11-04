import React, {useState} from 'react'
import axios from 'axios'
import { useAppDispatch } from '../Redux/Hooks';
import { initialize } from '../Redux/Slice/userSlice';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const [name,setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [conpassword, setConPassword] = useState("")

    const eventHandler = (e:any) =>{
        e.preventDefault()
       axios.post('/user/signup',{name, email, password, conpassword})
       .then((signupResponse)=>{
            if(signupResponse){
                localStorage.setItem('jwt-token',signupResponse.data.token)
                dispatch(initialize({user:signupResponse.data.user, auth:signupResponse.data.auth}))
                alert(signupResponse.data.message)
                navigate('/signin')
            }
       })
       .catch(err=>console.log(err))
    }

  return (
    <div>
      <div className="flex justify-center">
  <div className="block p-6 rounded-lg shadow-2xl bg-blue-100 max-w-lg  m-48">
    <h5 className="text-gray-900 leading-tight font-medium mb-2 text-center text-2xl">Sign up</h5>
    <div className='border rounded-lg'>
        <input type="text" name='username' placeholder=' username...' required className='required p-1 m-2 border border-gray-600 rounded-t-sm text-start' 
        onChange={(e:any)=>setName(e.target.value)}/>
        <br />
        <input type="email" name='email' placeholder=' email...' required className='p-1 m-2 border border-gray-600 rounded-t-sm text-start' 
        onChange={(e:any)=>setEmail(e.target.value)}/>
        <br />
        <input type="password" name='password' placeholder=' password...' required className='p-1 m-2 border border-gray-600 rounded-t-sm text-start' 
        onChange={(e:any)=>setPassword(e.target.value)}/>
        <br />
        <input type="password" name='confirm password' placeholder=' confirm password...' required className='p-1 m-2 border border-gray-600 rounded-t-sm text-start' 
        onChange={(e:any)=>setConPassword(e.target.value)}/>
    </div>
    <br />
    <button type="button" className="ml-14  text-base text-center inline-block px-6 py-2.5 bg-blue-600 text-white font-medium  leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
    onClick={eventHandler}>
        Signup</button>
  </div>
</div>
    </div>
  )
}

export default Signup
