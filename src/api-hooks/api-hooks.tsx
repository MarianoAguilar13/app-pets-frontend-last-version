//const API_BASE_URL = "http://localhost:3000";
const API_BASE_URL = "https://app-pets-backend-last-version.onrender.com";

//crea el token del usuario cuando inicia sesion y lo guarda en
//el local storage
export async function iniciarSesionCrearToken(
  mail: string,
  password: string,
  callback: any
) {
  const fetchApi = fetch(API_BASE_URL + "/auth/token", {
    method: "post",
    //necesita este header para que funcione
    headers: {
      "content-type": "application/json",
    },

    body: JSON.stringify({
      mail: mail,
      password: password,
    }),
  });

  try {
    const res = await fetchApi;

    const resultado = await res.json();
    console.log("nombre del usuario: ", resultado);
    localStorage.setItem("Token", resultado.respuesta);

    callback(resultado);
  } catch (resultado) {
    callback(resultado);
  }
}

//este fetch nos permite crear un nuevo usuario
export async function crearCuenta(
  mail: string,
  password: string,
  name: string,
  callback: any
) {
  const fetchApi = fetch(API_BASE_URL + "/auth", {
    method: "post",
    //necesita este header para que funcione
    headers: {
      "content-type": "application/json",
    },

    body: JSON.stringify({
      mail: mail,
      password: password,
      name: name,
    }),
  });

  try {
    const res = await fetchApi;
    //console.log("nombre del usuario: ", resultado.name);
    const resultado = await res.json();

    callback(resultado);
  } catch (r) {
    callback(r);
  }
}

//este fetch devuelve los datos de un usario utilizando el token
//guardado en el local storage
export async function myData(callback: any) {
  const token = "bearer " + localStorage.getItem("Token");
  const fetchApi = fetch(API_BASE_URL + "/me", {
    method: "GET",
    //necesita este header para que funcione
    headers: {
      Authorization: token,
      "content-type": "application/json",
    },
  });
  try {
    const res = await fetchApi;
    //console.log("nombre del usuario: ", resultado.name);
    const resultado = await res.json();

    callback(resultado);
  } catch (r) {
    callback(r);
  }
}

//este fetch nos permite cargar una pet, la cual los otros usuarios
//podran verla si estan cerca de su ubicacion, para que puedan crear un reporte
export const cargarPet = async (
  name: string,
  type: string,
  description: string,
  pictureDataURL: string,
  localidad: string,
  provincia: string,
  lost: boolean,
  callback: any
) => {
  const token = "bearer " + localStorage.getItem("Token");
  //si existe un email en el state va a hacer el fetch-post
  const fetchApi = fetch(API_BASE_URL + "/pets", {
    method: "post",

    headers: {
      Authorization: token,
      "content-type": "application/json",
    },

    body: JSON.stringify({
      name,
      type,
      description,
      pictureDataURL,
      localidad,
      provincia,
      lost,
    }),
  });

  try {
    const res = await fetchApi;
    //console.log("nombre del usuario: ", resultado.name);
    const resultado = await res.json();

    callback(resultado);
  } catch (resultado) {
    callback(resultado);
  }
};

//esta funcion me permite obtener las pets que subio un usuarios
//para asi luego poder mostrarselas en la page
export const misPets = async (callback: any) => {
  const token = "bearer " + localStorage.getItem("Token");

  const fetchApi = fetch(API_BASE_URL + "/me/pets", {
    method: "GET",

    headers: {
      Authorization: token,
      "content-type": "application/json",
    },
  });

  try {
    const res = await fetchApi;
    //console.log("nombre del usuario: ", resultado.name);
    const resultado = await res.json();

    const mascotas = resultado;

    let arrayMascotas = [] as any;
    //Ahora itero y agrego todas las cards de mis mascotas perdidas
    if (mascotas[0]) {
      for (const pet of mascotas) {
        const newPet = {
          id: pet.id,
          picURL: pet.picURL,
          name: pet.name,
        };
        arrayMascotas.push(newPet);
      }

      callback(arrayMascotas);
    } else {
      callback(resultado);
    }
  } catch (resultado) {
    callback(resultado);
  }
};

//este fetch nos trar la pets perdidas que estan cerca de nuestra
//ubicacion actual, en un radio de 5km
export const petsByLocation = async (localidad: string, callback: any) => {
  const fetchApi = fetch(
    API_BASE_URL + "/pets/cercanas?localidad=" + localidad,
    {
      method: "GET",

      headers: {
        "content-type": "application/json",
      },
    }
  );

  try {
    const res = await fetchApi;
    //console.log("nombre del usuario: ", resultado.name);
    const resultado = await res.json();

    const mascotas = resultado;

    let arrayMascotas = [] as any;
    //Ahora itero y agrego todas las cards de las mascotas perdidas
    if (mascotas[0]) {
      for (const pet of mascotas) {
        if (pet) {
          const newPet = {
            id: pet.id,
            picURL: pet.picURL,
            name: pet.name,
            description: pet.description,
            localidad: pet.localidad,
            provincia: pet.provincia,
          };
          arrayMascotas.push(newPet);
        }
      }

      console.log("mascotas: ", arrayMascotas);

      callback(arrayMascotas);
    } else {
      callback(resultado);
    }
  } catch (resultado) {
    callback(resultado);
  }
};

//con este fetch obtenemos los datos de una pet si tenemos el id de la pet
export const getOnePet = async (idPet: number, callback: any) => {
  const token = "bearer " + localStorage.getItem("Token");

  const fetchApi = fetch(API_BASE_URL + "/pets?idPet=" + idPet, {
    method: "GET",

    headers: {
      Authorization: token,
      "content-type": "application/json",
    },
  });

  try {
    const res = await fetchApi;
    //console.log("nombre del usuario: ", resultado.name);
    const resultado = await res.json();
    const pet = resultado;
    console.log("esta es la pet: ", pet);
    callback(pet);
  } catch (resultado) {
    callback(resultado);
  }
};

export const editarPet = async (
  name: string,
  type: string,
  description: string,
  pictureDataURL: any,
  localidad: string,
  provincia: string,
  lost: boolean,
  petId: number,
  callback: any
) => {
  const token = "bearer " + localStorage.getItem("Token");

  const fetchApi = fetch(API_BASE_URL + "/pets", {
    method: "PATCH",
    headers: {
      Authorization: token,
      "content-type": "application/json",
    },

    body: JSON.stringify({
      name,
      type,
      description,
      pictureDataURL,
      localidad,
      provincia,
      lost,
      petId,
    }),
  });

  try {
    const res = await fetchApi;
    const resultado = await res.json();

    callback(resultado);
  } catch (resultado) {
    callback(resultado);
  }
};
