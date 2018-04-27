
window.onload = inicializar; //Cuando se cargue la page, empezar la funcion inicializar
var formEmpleado;
var refEmpleados;
var tbodyTabla;
var create = "Agregar Empleado";
var update = "Modificar Empleado";
var modo = create;
var refEmpleadoEdit;


function inicializar()
{
   formEmpleado = document.getElementById("formData"); //Obtenems la información del form.
   formEmpleado.addEventListener("submit", enviarDatosFirebase, false); //cuando se haga clic en submit, enviar los datos.

    tbodyTabla = document.getElementById("tbody-tabla"); //obtenemos el id de la tabla para mostrar los datos.

   //una referencia al nodo raiz de la base de datos (crudjs-129df) osea "empleados"
   refEmpleados = firebase.database().ref().child("empleados");
   
  mostrarEmpleadosFirebase();
}

function mostrarEmpleadosFirebase()
{
    //cada vez que entre a refEmpleados (cada vez que se ejecuta) me sobreevalue y haga algo.
    refEmpleados.on("value", function (snap)
                    {
                        var datos = snap.val();
                        var filasAMostrar = "";
                            for (var key  in datos) 
                            {
                            filasAMostrar += "<tr>" +
                                                "<td>" + datos[key].nombre + "</td>" +
                                                "<td>" + datos[key].apellido + "</td>" +
                                                "<td>" + datos[key].departamento + "</td>" +
                                                "<td>" + datos[key].salario + "</td>" +
                                                '<td>'+
                                                '<button class="btn btn-default editar" data-empleado="'+key+'"> '+
                                                     '<span class="glyphicon glyphicon-pencil"></span>'+
                                                '</button>'+
                                                '</td>'+

                                                '<td>'+
                                                '<button class="btn btn-danger borrar" data-empleado="'+key+'"> '+
                                                     '<span class="glyphicon glyphicon-trash"></span>'+
                                                '</button>'+
                                                '</td>'+
                                                "</tr>";
                            }
                        tbodyTabla.innerHTML = filasAMostrar;

                        if(filasAMostrar != "")
                        {   
                            //**SI DOY CLICK EN EDITAR */
                            var elementosEdit = document.getElementsByClassName("editar");
                            for(var i = 0; i < elementosEdit.length; i++)
                            {
                                elementosEdit[i].addEventListener("click", editarEmpleadoFirebase, false);
                            }

                            //*** SI DOY CLIC EN ELIMINAR
                            //obtengo en una var todos los elementos a borrar con clase "borrar"
                            //recorro los elementos y llamo la funcion eliminarEmpleadoFirebase
                            var elementosDelete = document.getElementsByClassName("borrar");
                            for(var i = 0; i < elementosDelete.length; i++)
                            {
                                elementosDelete[i].addEventListener("click", eliminarEmpleadoFirebase, false);
                            }
                        }
                
                    }
              );             
}

function editarEmpleadoFirebase()
{
    var keyEmpleadoEdit = this.getAttribute("data-empleado"); //obtengo el key del icono generado en la tabla.
    refEmpleadoEdit = refEmpleados.child(keyEmpleadoEdit); //obtengo la referencia del nodo "Empleados" en la DB, para pasarle el key a borrar
     
    //leer los datos a editar y trae el valor en snap, para posteriormente pasarlos a datos y mostrar cada elemento en el input:
    refEmpleadoEdit.once("value", function(snap)
                            {   var datos = snap.val();
                                document.getElementById("nombre").value = datos.nombre;
                                document.getElementById("apellido").value = datos.apellido;
                                document.getElementById("depto").value = datos.departamento;
                                document.getElementById("salario").value = datos.salario;
                            }
                        );
                        document.getElementById("boton_form").value = update;
                        modo =update;
}

function eliminarEmpleadoFirebase()
{
    var keyEmpleadoDelete = this.getAttribute("data-empleado"); //obtengo el key del icono generado en la tabla.
    var refEmpleadoDelete = refEmpleados.child(keyEmpleadoDelete); //obtengo la referencia del nodo "Empleados" en la DB, para pasarle el key a borrar
    refEmpleadoDelete.remove();
}


function enviarDatosFirebase(event)
{
  event.preventDefault(); //No se recarga la pagina al presionar el formulario
switch (modo) {
    case create:   
                //enviar valores a firebase.
            refEmpleados.push(
                {
                    nombre: event.target.nombre.value,
                    apellido: event.target.apellido.value,
                    departamento: event.target.depto.value,
                    salario: event.target.salario.value
                }
                );   
        break;
    case update: 
          refEmpleadoEdit.update(
                   { 
                    nombre: event.target.nombre.value,
                    apellido: event.target.apellido.value,
                    departamento: event.target.depto.value,
                    salario: event.target.salario.value
                   }
                );
                document.getElementById("boton_form").value = create;
                modo = create;
        break;
    default:
        break;
}
    
  formEmpleado.reset(); //se recarga la página una vez enviando el formulario.
}