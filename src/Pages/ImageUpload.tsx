import React,{useState} from 'react'
import axios from 'axios'
import Allimages from './Allimages'

const ImageUpload = () => {

    const [input, setInput] = useState("")
    const [fileInput, setFileInput] = useState("")

    const formData = new FormData()
    formData.append('image',input)
    
    const formHandler = (e:any) =>{
        setInput(e.target.files[0])
    }

    const eventHandler = (e:any) =>{
        e.preventDefault()

        axios.post('/user/fileupload', formData)
        .then((imageResponse)=>{
            if(imageResponse){
                setFileInput(imageResponse.data.file)
            }
        })
        .catch(err=>console.log(err))
    }


  return (
    <div>
      <h1 className="text-center m-3 text-3xl">Upload Images</h1>
      <div className="flex justify-center">
        <input
          type="file"
          multiple
          className=" p-2 mt-4 flex justify-center place-self-center bg-blue-100 "
          onChange={formHandler}
        />
        <div>
        <button type="button" className=" inline-block  p-4 mt-4 bg-blue-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out"
        onClick={eventHandler}
        >Upload</button>
        </div>
      </div>
      <div >
      {
        fileInput?
        <><img src={`http://localhost:5000/${fileInput}`} alt="" /></>
        :
        <></>
      }
      </div>

      <div>
        <Allimages/>
      </div>
    </div>
  )
}

export default ImageUpload
