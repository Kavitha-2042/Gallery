import React, {useState, useEffect} from "react";
import axios from "axios";

const Allimages = () => {

    const [allImage, setAllImage] = useState([])

    useEffect(() => {
        axios.get('/user/allimages')
        .then((allResponse)=>{
            if(allResponse){
                setAllImage(allResponse.data.file)
            }
        })
        .catch(err=>console.log(err))
    }, [])

  return (
    <div className="bg-slate-300 m-10 flex flex-row">
    
    <div className=" flex flex-wrap justify-evenly justify-items-center w-screen-2xl h-max shadow-lg   grid-cols-4  gap-4" data-mdb-ripple="true" data-mdb-ripple-color="light">
 {
        allImage?
        <>{
            allImage.map((val:any)=>(
                <img src={`http://localhost:5000/${val.image}`} alt="file"  key={val._id} className="block object-cover  grid grid-cols-4 rounded-lg"/>
            ))
        }
        
        </>
        :
        <></>
      }
      </div>
    </div>
       
  );
};

export default Allimages;
