import { eliminar, getData, obtener, save, update,verificarMacExistente} from "./firebase.js"

let id = 0
//addEventListener me permite capturar un evento 
document.getElementById('btnGuardar').addEventListener('click', async () => {
    valida();
    if (document.querySelectorAll('.is-invalid').length == 0) {
        
        if (document.getElementById('btnGuardar').value == 'Guardar') {
            const cel = {
                'mac': document.getElementById('mac').value,
                'marca': document.getElementById('marca').value,
                'modelo': document.getElementById('modelo').value,
                'sisop': document.querySelector('input[name="sisop"]:checked').value,
                'fecha': document.getElementById('fecha').value,
                'almacenamiento': document.getElementById('almacenamiento').value,
                'precio': document.getElementById('precio').value,
                'estado': document.getElementById('estado').value
            }
            
            // Verificar si el modelo ya existe en la colección antes de guardar
            
            
            const macExiste = await verificarMacExistente(cel.mac);
            if (macExiste) {
                Swal.fire({
                    title: "Error",
                    text: "La dirección MAC ya existe en la colección",
                    icon: "error"
                });
                return; // Detener el proceso de guardar el registro
            }
 
            save(cel);
            limpiar();
        } else {
            const cel = {
                'mac': document.getElementById('mac').value,
                'marca': document.getElementById('marca').value,
                'modelo': document.getElementById('modelo').value,
                'sisop': document.querySelector('input[name="sisop"]:checked').value,
                'fecha': document.getElementById('fecha').value,
                'almacenamiento': document.getElementById('almacenamiento').value,
                'precio': document.getElementById('precio').value,
                'estado': document.getElementById('estado').value
            }
            update(id, cel);
            limpiar();
            id = 0;
        }
    }
})
//DOMEventLister es un evento que se ejecuta cuando se recarga la página 
window.addEventListener('DOMContentLoaded', () => {
    getData((collection) => {
        let tabla = ''
        //se recorre la colección y se crear el item doc para mostrar los datos
        collection.forEach((doc) => {
            const item = doc.data()
            tabla += `<tr>
            <td>${item.mac}</td>
            <td>${item.marca}</td>
            <td>${item.modelo}</td>
            <td>${item.sisop}</td>
            <td>${item.fecha}</td>
            <td>${item.almacenamiento}</td>
            <td>${item.precio}</td>
            <td>${item.estado}</td>
            <td nowrap>
                <button class="btn btn-warning" id="${doc.id}">Editar</button>
                <button class="btn btn-danger" id="${doc.id}">Eliminar</button>
            </td>
        </tr>`
        })
        document.getElementById('contenido').innerHTML = tabla
        //recorrer todos los botón y eliminar
        document.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => {
                Swal.fire({
                    title: "¿Estás seguro de eliminar el registro?",
                    text: "No podrás revertir los cambios",
                    icon: "error",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Eliminar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        //añadir sweetalert para confirmar la eliminación
                        eliminar(btn.id)
                    }
                })
            })
        })

        // 
        // 

        
        
        //seleccionar el documento
        document.querySelectorAll('.btn-warning').forEach( btn => {
            //async indica que necesitamos un await para esperar a que la función responda
            btn.addEventListener('click',async() =>{
                //invocar función para buscar el documento por su id
                const doc = await obtener(btn.id)
                //obtener los valores del documento
                const d = doc.data()
                //asignar los valores a los input
                document.getElementById('mac').value = d.mac
                document.getElementById('marca').value = d.marca
                document.getElementById('modelo').value = d.modelo
                if (d.sisop === 'Android') {
                    document.getElementById('android').checked = true;
                } else if (d.sisop === 'iOS') {
                    document.getElementById('ios').checked = true;
                }
                document.getElementById('fecha').value = d.fecha
                document.getElementById('almacenamiento').value = d.almacenamiento
                document.getElementById('precio').value = d.precio
                document.getElementById('estado').value = d.estado
                //modificar el valor del botón 
                document.getElementById('btnGuardar').value = 'Modificar'
                
                //asignar el id del documento a nuestra variable
                id = btn.id
            })
        })

    })
})