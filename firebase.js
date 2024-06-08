import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot,updateDoc,getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDHxyFpPJGIKt10JVpxIZFLKHo7GUgx5sg",
    authDomain: "automotora-5f9ce.firebaseapp.com",
    projectId: "automotora-5f9ce",
    storageBucket: "automotora-5f9ce.appspot.com",
    messagingSenderId: "679837611168",
    appId: "1:679837611168:web:6f57ea36217941f1e8c5c5"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
//función de firestore que retorna la base de datos para ser utilizada
const db = getFirestore(app);

//función para guardar un registro
export const save = async (cel) => {
  try {
      const modeloExiste = await verificarMacExistente(cel.mac);
      if (modeloExiste) {
          Swal.fire({
              title: "Error",
              text: "La direccion mac ya existe en la colección",
              icon: "error"
          });
          return; // Detener el proceso de guardar el registro
      }

      await addDoc(collection(db, 'Celulares'), cel);
      Swal.fire({
          title: "Guardado",
          text: "Su registro ha sido guardado exitosamente",
          icon: "success"
      });
  } catch (error) {
      Swal.fire({
          title: "Error",
          text: "Se produjo un error al intentar guardar el registro",
          icon: "error"
      });
      console.error("Error al guardar el registro:", error);
  }
}

//función para listar todos los registros
export const getData = (data) => {
    //onSnapshot es la función que permite retornar la colección y asignarla a una variable
    onSnapshot(collection(db, 'Celulares'), data)
}

//función eliminar 
export const eliminar = async (id) => {
  try {
      // Elimina el documento de la colección 'Celulares' por su id
      await deleteDoc(doc(db, 'Celulares', id));
      // Si se completa la operación sin errores, muestra el SweetAlert de éxito
      Swal.fire({
          title: "Eliminado",
          text: "El registro ha sido eliminado exitosamente",
          icon: "success"
      });
  } catch (error) {
      // Si ocurre un error, muestra un SweetAlert de error
      Swal.fire({
          title: "Error",
          text: "Se produjo un error al intentar eliminar el registro",
          icon: "error"
      });
      console.error("Error al eliminar el registro:", error);
  }
}


//getDoc obtener un documento, porque debe esperar a traer el resultado  
export const obtener = (id) => getDoc(doc(db,'Celulares',id))

//función para actualizar los datos del documento 
export const update = async (id, celulares) => {
    try {
      const macExistente = await verificarMacExistente(celulares.mac, id);
      if (macExistente) {
        Swal.fire({
          title: "Error",
          text: "La dirección MAC ya existe en la colección",
          icon: "error"
        });
        return; // Detener el proceso de actualizar el registro
      }
      // Actualizar el documento en Firestore
      await updateDoc(doc(db, 'Celulares', id), celulares);
      Swal.fire({
        title: "Actualizado",
        text: "Su registro ha sido actualizado exitosamente",
        icon: "success"
      });
    } catch (error) {
      console.error("Error al verificar la dirección MAC:", error);
    }
  };


// Función para verificar si el modelo ya existe en la colección
export const verificarMacExistente = async (mac, id = null) => {
    let querySnapshot;
    if (id) {
      querySnapshot = await getDocs(query(collection(db, 'Celulares'), where('mac', '==', mac), where('__name__', '!=', id)));
    } else {
      querySnapshot = await getDocs(query(collection(db, 'Celulares'), where('mac', '==', mac)));
    }
    return !querySnapshot.empty;
  }
  


