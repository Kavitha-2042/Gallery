import React, {useState} from 'react'
import axios from 'axios'
import { useAppDispatch } from '../Redux/Hooks';
import { initialize } from '../Redux/Slice/userSlice';
import { useNavigate } from 'react-router-dom';

const Signin = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const eventHandler = (e:any) =>{
        e.preventDefault()
       axios.post('/user/signin',{email, password})
       .then((signinResponse)=>{
        console.log("Signin: ",signinResponse)
            if(signinResponse.data.auth === true){
                localStorage.setItem('jwt-token',signinResponse.data.token)
                dispatch(initialize({user:signinResponse.data.user, auth:signinResponse.data.auth}))
                alert(signinResponse.data.message)
                navigate('/profile')
            }
       })
       .catch(err=>console.log(err))
    }

  return (
    <div>
      <div className="flex justify-center">
  <div className="block p-6 rounded-lg shadow-2xl bg-blue-100 max-w-lg  m-48">
    <h5 className="text-gray-900 leading-tight font-medium mb-2 text-center text-2xl">Sign in</h5>
    <div className='border rounded-lg'>
        <input type="email" name='email' placeholder=' email...' required className='p-1 m-2 border border-gray-600 rounded-t-sm text-start' 
        onChange={(e:any)=>setEmail(e.target.value)}/>
        <br />
        <input type="password" name='password' placeholder=' password...' required className='p-1 m-2 border border-gray-600 rounded-t-sm text-start' 
        onChange={(e:any)=>setPassword(e.target.value)}/>
        <br />
    </div>
    <br />
    <button type="button" className="ml-14  text-base text-center inline-block px-6 py-2.5 bg-blue-600 text-white font-medium  leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
    onClick={eventHandler}>
        Signin</button>
  </div>
</div>
    </div>
  )
}

export default Signin
