import React,{useState,useEffect} from 'react';
import  {gql} from  'apollo-boost';
import {useMutation} from '@apollo/react-hooks';

import M from 'materialize-css/dist/js/materialize.min.js';
//import  App from '../App';

const  Agregar =(props) =>{
  let {DetalleEstadoPersona:propiedad}=props;
  console.log(propiedad.nombre,"vernombre");
  // let nomb=propiedad.nombre
    let [formData,setFormData]=useState({

        nombre:"",
        apellido:"",
        edad:0,
        instituto:""
    });

    console.log(formData,"Antiguo");
    console.log(formData,"Nuevo");
    // let nombre=React.createRef();
    // let apellido=React.createRef();
    // let edad=React.createRef();
    // let instituto=React.createRef();
 
    const addProductoGa=gql`
    mutation Agregar($nombre:String!,$apellido:String!,$edad:Int!,$instituto:String!){
      addPersonas(nombre:$nombre,apellido:$apellido,edad:$edad,instituto:$instituto){
        id
        nombre
        apellido
        edad 
        instituto
      }
    }
    `;
    const UpdatePers=gql`
    mutation update($id:ID!,$nombre:String,$apellido:String,$edad:Int,$instituto:String){
      updatePersonas(id:$id,nombre:$nombre,apellido:$apellido,edad:$edad,instituto:$instituto){
        id
      }
    }
    `;
    let  [addPersonas]=useMutation(addProductoGa);
    let [updatePersonas]=useMutation(UpdatePers);
    const ActualizarPersona= async (e) =>{
      console.log(formData,"first");
        e.preventDefault();
        console.log(formData,"twoo");
        await  updatePersonas({variables:{
          id:propiedad.id,
          nombre:formData.nombre,
          apellido:formData.apellido,
          edad:parseInt(formData.edad),
          instituto:formData.instituto
        } }).then(resp => {
            const  {data:{updatePersonas:info}} =resp;
            M.toast({html:`Se ha actualizado correctamente el siguiente id : ${JSON.stringify(info.id)}`});
            props.funcionga();
        }).catch(error => {
          M.toast({html:`Error : ${error.message}`})
        })
    }

//     const  ko=()=>{
//  setFormData({
//           ...formData,
//           nombre:nomb
//         })
//     }
//     ko();

      useEffect(()=>{
        setFormData({
         ...formData,
         nombre:propiedad.nombre,
         apellido:propiedad.apellido,
         edad:propiedad.edad,
         instituto:propiedad.instituto
       })
       // eslint-disable-next-line
     },[propiedad.nombre,propiedad.apellido,propiedad.edad,propiedad.instituto])
     console.log(formData)
    const updateFormData=async (e) =>{
      
        await setFormData({
          ...formData,
          [e.target.name]:e.target.value
        })

    
    }


    const  AgregarPersona= async (e) =>{
  e.preventDefault();
      await addPersonas({
        variables:{
          nombre:formData.nombre,
          apellido:formData.apellido,
          edad:parseInt(formData.edad),
          instituto:formData.instituto
        } 
      }).then(info => {
          return info.data.addPersonas;
        //const  {}=info;
        //console.log(info.data.addPersonas,"Informacion"+new Date().toLocaleDateString());
        //alert(`Se agrego  ala persona :${}`)
        //datas=info;
      }).then(resp=>{
        //console.log(resp);
        M.toast({html:resp.nombre});
        props.funcionga();
        
        // new App().ListarTodo.bind(this);
        // console.log( new App().ListarTodo.length);
    });
      //alert(`Persona agregada ${data.data.addPersonas.nombre}`);
     // alert("PERSONA AGREGADA");
      //alert(`Persona agregada ${datas.data.addPersonas.nombre}`);
     //alert("PERSONA AGREGADA");
    }
 
    return  <div style={{width:"500px",margin:"auto"}}>
        {         
          M.AutoInit()
        }

         <form>
        <label>Nombre : </label> <input  name="nombre" value={formData.nombre} onChange={(e)=>{updateFormData(e)} }  /><br/>
        <label>apellido : </label> <input  name="apellido" value={formData.apellido}   onChange={(e)=>{updateFormData(e)} }/><br/>
        <label>Edad : </label> <input  name="edad" value={formData.edad}  onChange={(e)=>{updateFormData(e)} }  /><br/>
        <label>Instituto : </label> <input name="instituto" value={formData.instituto}   onChange={(e)=>{updateFormData(e)} }/><br/>
        <button onClick={(e)=>{AgregarPersona(e)}}  className="btn btn-danger">Hecho</button><span> </span>
        <button className="btn orange" onClick={(e)=>{ActualizarPersona(e)}}>Actualizar</button>
       
        </form>
      




        {/* <form>
        <label>Nombre : </label> <input ref={nombre}  name="nombre" onChange={(e)=>{e.target} }  /><br/>
        <label>apellido : </label> <input  ref={apellido}  placeholder={propiedad.apellido}  onChange={()=>{}}/><br/>
        <label>Edad : </label> <input  ref={edad}  placeholder={propiedad.edad}  onChange={()=>{}}  /><br/>
        <label>Instituto : </label> <input ref={instituto} placeholder={propiedad.instituto}  onChange={()=>{}}/><br/>
        <button onClick={AgregarPersona} className="btn btn-danger">Hecho</button><span> </span>
        <button className="btn orange" onClick={ActualizarPersona}>Actualizar</button>
        </form>
       */}


      </div>
    

}
export default  Agregar;