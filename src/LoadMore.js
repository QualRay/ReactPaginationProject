import './App.css';
import { Button, Pagination, Table } from 'react-bootstrap'
import BASE_URL from './helper'
import { useState } from 'react'

function LoadMore() {
  //1. State / Hook variable
  const [ student,  setStudent] = useState({
    data:[], //JS Object [{},{}] //Array of a Object
    meta:{
      pagination:{
        page:'',
        pageCount:'',
        pageSize:'',
        total:''
      }
    }  //JS Object
  });

  const [paginationItem, setPaginationItem] = useState([
    //passing empty array
  ]);


  //2. Function
  
   let loadMore = (e) => {
      //alert("Clicked");
     
        getStudents( student.meta.pagination.page +1);
      
     
   }

    let goToPage = (e) =>{
      //console.log(e.target.innerHTML);
      var pageno = parseInt(e.target.innerHTML);
      getStudents(pageno);
    }

    

   let getStudents = (pageno=1) =>{ // pageno1 is a default argument
    //console.log("Clicked")
    //Always wrap API code inside try catch block
  
    // either Fetch API or Axios
    try {

      fetch(
        `${BASE_URL}/api/students?pagination[page]=${pageno}&pagination[pageSize]=10`
      ).then( (data) => {
        //lets make data readable 1st then block we need to read JSON
        return data.json();
      }).then( (data)=>{
        //console.log(data)
        //Set karne se pehle data kya hey
        
        //now set the data in student hook variable
        setStudent({
          ...student,
          data: student.data.concat(data.data),
          meta: data.meta
        });
        //set karne ke baad data kya aaya
        
      
        //array.map(function(currentValue, index, arr), thisValue)
        
      }).catch( (err)=>{
        console.log(err)
      })
      
      
    } catch (error) {
      console.log(error)
    }
   }



  //3. Return statement
  return (
    <>
      <div className="d-flex justify-content-center">
        <h1>Load More Feature</h1>
       

      <Button onClick={ (e)=>{ getStudents() }} >Fetch Data</Button><br /><br />
      
      </div>
      {
       student.data.length > 0 &&
             
       <>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {
          student.data.map(function(currentValue, index, arr){
          //console.log(arr[index].attributes.Name)
            return (
              
                <tr key={index}>
                  <td>{arr[index].id}</td>
                  <td>{arr[index].attributes.Name}</td>
                  <td>{arr[index].attributes.LastName}</td>
                  <td>{arr[index].attributes.Username}</td>
                  <td>
                    <Button variant="success" size="sm">View</Button>&nbsp;
                    <Button variant="primary" size="sm">Edit</Button>&nbsp;
                    <Button variant="danger" size="sm">Delete</Button>&nbsp;
                  </td>
                </tr>
              
            )
          })
        }
          
          
        </tbody>
        </Table>
        <>
        {
          (student.meta.pagination.page !== student.meta.pagination.pageCount) && 
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={ (e) => { loadMore(e); }}>Load more...</Button>
          </div>
        }
         
       
     
  
</>
       
       </> 

      } 
    </>
  )
}

export default LoadMore;
