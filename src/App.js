import './App.css';
import { Button, Pagination, Table } from 'react-bootstrap'
import BASE_URL from './helper'
import { useState } from 'react'
import swal from 'sweetalert'
import axios from 'axios'

function App() {
  //1. State / Hook variable
  const [ student,  setStudent] = useState({
    data:[]
  });

  const [paginationItem, setPaginationItem] = useState([
    //passing empty array
  ]);


  //2. Function
  
  let handleDelete =(e) => {
      //console.log(e.target.closest('tr').querySelector('td:first-child').innerHTML);
      var tr = e.target.closest('tr');
      var delId = e.target.closest('tr').querySelector('td:first-child').innerHTML;
      console.log(delId)

      swal({
        title:"Are you sure?",
        text:"Once deleted, you will not be able to recover this file!",
        icon:"warning",
        buttons: true,
        dangerMode: true
      })
      .then(async (willDelete)=>{
        if(willDelete){

          try {
            let po = await axios.delete(`${BASE_URL}/api/students/${delId}`);
                tr.remove();
                swal("Success!", "Student removed successfully!", "success");
          } catch (error) {
            console.log(error)
          }
        }else{
          //swal("Something went wrong!")
        }
      })
  }
  
    let lastPage =(e) =>{
      //console.log("Last")
      if(student.meta.pagination.page !== student.meta.pagination.pageCount){
        getStudents(student.meta.pagination.pageCount);
      }
    }

    let nextPage = (e) =>{
      //console.log("Next")
      if(student.meta.pagination.page !== student.meta.pagination.pageCount){
          getStudents(student.meta.pagination.page + 1);
      }
     
    }

    let previousPage = (e) =>{
      //console.log("Previous")
      if(student.meta.pagination.page !== 1 ){
        getStudents(student.meta.pagination.page - 1);
      }
      
    }

    let firstPage = (e) =>{
      //console.log("First")
     
      if(student.meta.pagination.page !== 1){
        getStudents(1);
      }
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
        setStudent(data);
        //set karne ke baad data kya aaya
        
      var start = data.meta.pagination.page;
      var arr =[]; //empty array for

      for( let i=1; i<= data.meta.pagination.pageCount; i++ ){  
        if(i === start){
          arr.push(<Pagination.Item active onClick = {(e)=>{ goToPage(e)}}>{i}</Pagination.Item>);
        }else{
          arr.push(<Pagination.Item onClick = {(e)=>{ goToPage(e)}}>{i}</Pagination.Item>);
        }       
         
      }

      setPaginationItem(arr);

        
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
        <h1>Read Operations</h1>
       

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
                    <Button variant="danger" onClick={(e)=>{ handleDelete(e) }} size="sm">Delete</Button>&nbsp;
                  </td>
                </tr>
              
            )
          })
        }
          
          
        </tbody>
        </Table>

        <Pagination className="d-flex justify-content-center">
              <Pagination.First onClick={ (e)=>{ firstPage(e); } } />
              <Pagination.Prev onClick={ (e)=>{ previousPage(e); } } />

              {
               
                paginationItem.map(function(currentValue, index, arr){
                  return currentValue
                })

              }
            
              
              
               
              <Pagination.Next onClick={ (e)=>{ nextPage(e); } } />
              <Pagination.Last onClick={ (e)=>{ lastPage(e); } } />
        </Pagination>
       </> 

      } 
    </>
  )
}

export default App;
