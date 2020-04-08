import React,{Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import  {useQuery,useMutation} from  '@apollo/react-hooks';
import  {gql} from  'apollo-boost';
import  Agregar from './components/Agregar';
import M from 'materialize-css/dist/js/materialize.min.js';
const queryGetPersonas=`
{
 getPersonas{
   id
   nombre
   apellido
    edad
   instituto
 }
}
`;

const  deletePersonas=`
mutation remov($id:ID!){
  deletePersona(id:$id){
    id
    nombre
    apellido
  }
}
`;
//let [deletePersona]=useMutation(gql(deletePersonas));
const RenderLoadingError = () =>{
  const  {loading,error} = useQuery(gql(queryGetPersonas));
  if(loading){
       return <p>CARGANDO TABLA . . . </p>
  }
  if(error){
       return <p>Ah ocurrido un error</p>
  }
  return <p></p>
}

const  ComponentEliminar = (props) =>{ 
  // const EliminarPersona=async (id) =>{
  //     alert(id);
  // }
  let [deletePersona]=useMutation(gql(deletePersonas));

  const  funcion= async (id)=>{
    let  confirmacion=window.confirm("SEGURO QUE DESEAS ELIMINAR  ESTE DATO ? ");

      if(confirmacion===true){
        await  deletePersona({variables:{id:id}}).then(resp =>resp.data.deletePersona).then(respt => {
          M.toast({html:`Eliminado  : ID:${respt.id} \n Nombre : ${respt.nombre}<br /> Apellido :${respt.apellido} ` })
          props.listarRefresh();
          //M.toast({html:"xdd"});
      }).catch(error=> M.toast({html:`Error ocasionado : ${error.message}`}))
          
      }
      

  
  }

  return <td><button onClick={funcion.bind(this,props.eliminar)} className="btn red">Eliminar</button></td>
}
 
class App extends Component {
  
 constructor(){
  

   super();
    this.state={
      ListaPersonas:[],
      detallePersona:{
        nombre:"",
        apellido:"",
        edad:0,
        instituto:""
      }
      
    }
    this.SelectOnePersona.bind(this);
    this.ListarTodo.bind(this);
    //deletePersonas.bind(this);
  } 
  
  componentDidMount(){
    this.ListarTodo();
    
  }
    EliminarPersona(id){
       
    var eliminar=window.confirm("SEGURO QUE DESEAS  ELIMINAR ESTE DATO ? ");
    if(eliminar===true){
     
        //         
        //deletePersonas.bind(this,{variables:{id:id}});
      M.toast({html:`Se ha eliminado el id : ${id}`});
      this.ListarTodo();
    }
    else{
      alert("xdddddddd");
    }
  }

  async SelectOnePersona(id){

      const  consulta =await fetch("https://api-graph-personas.herokuapp.com/graphql",{
          method:"POST",
          headers: { "Content-Type": "application/json" },
          body:JSON.stringify({query:`query($id:ID!){  
            getOnePersona(id:$id){
              id
              nombre
              apellido
              edad
              instituto
            }
          }`,variables:{id}
        })});
        
      const {data:{getOnePersona:detallePersona}}=await consulta.json();
      // console.log(this.state.detallePersona,"Antiguo state");
      await this.setState({
        detallePersona
      });
      // console.log(this.state.detallePersona,"Nuevo state");
      // console.log(detallePersona);
      await  M.toast({html:JSON.stringify(detallePersona)});
  }

  async  ListarTodo(){
   await fetch("https://api-graph-personas.herokuapp.com/graphql",{
        method:"POST",
		headers: { "Content-Type": "application/json" },
        body:JSON.stringify({query:`{
          getPersonas{
            id
            nombre
            apellido
             edad
            instituto
          }
         }`})
    }).then(datasss => { return datasss.json()}).then(result=>{
      this.setState({ListaPersonas:result.data.getPersonas});
      //console.log(result.data.getPersonas)
      }
      ).catch(error => {
        M.toast({html:"Ah ocurrido un error"+error});
        console.log(error);
      })
 }
  render(){
   return ( <div className="App">
       {
          M.AutoInit()
          
        }
     <Agregar  funcionga={this.ListarTodo.bind(this)}  DetalleEstadoPersona={this.state.detallePersona}/>

     <RenderLoadingError/>
     <table className="table striped responsive-table centered">
       <thead>
         <tr>
         <th>ID</th>
         <th>Nombre</th>
         <th>Apellido</th>
         <th>Edad</th>
         <th>Instituto</th>
         </tr>
       </thead>
       <tbody>
        
      {
        this.state.ListaPersonas.map(item => {
        return <tr key={item.id}> 
              <td>{item.id}</td>
             <td>{item.nombre}</td>
             <td>{item.apellido}</td>
             <td>{item.edad}</td>
             <td>{item.instituto}</td>   
             <td><button className="btn blue" onClick={this.SelectOnePersona.bind(this,item.id)}>SELECCIONAR</button></td> 
              <ComponentEliminar eliminar={item.id} listarRefresh={this.ListarTodo.bind(this)}/>
             {/* <td><button className="btn red" onClick={this.EliminarPersona.bind(this,item.id)}>ELIMINAR</button></td>               
            */}
            </tr>
            
        })
      }
     
      </tbody>
      </table>
    </div>
   )}
}

export default App;

