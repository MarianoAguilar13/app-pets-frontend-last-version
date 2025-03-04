import React, { useState, useEffect } from "react";
import Css from "./index.module.css";
import { FieldSetEditPet } from "../../ui/fields-sets";
import { FieldSetTextAreaEditPet } from "../../ui/fields-sets";
import { MainButton } from "../../ui/buttons";
import Dropzone from "react-dropzone";
import { useRouter } from "next/navigation";
import { checkTokenValidoHook } from "@/api-hooks/api-hooks-mis-datos";
import { getOnePet, editarPet } from "../../api-hooks/api-hooks";
import { idPetEditar } from "../../atoms/atoms";
import { useRecoilState } from "recoil";
import { SpinnerWhite } from "../../components/spinner-white";
import { Layout } from "@/components/layout";
import Swal from "sweetalert2";

const EditarPet = () => {
  const { push } = useRouter();

  const [fileUrl, setFileUrl] = useState();
  const [enviarData, setEnviarData] = useState(false);
  const [comenzar, setComenzar] = useState(true);
  const [petEditar, setPetEditar] = useRecoilState(idPetEditar);
  const [petData, setPetData] = useState({
    id: 0,
    name: "",
    type: "",
    description: "",
    picURL: "",
    localidad: "",
    provincia: "",
    lost: true,
    userId: 0,
  });
  //este state sirve para mostrar la pseudo url creada para mostrar
  //la imagen que se quiere cargar
  const [imagenMostrar, setImagenMostrar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkToken, setCheckToken] = useState({
    valido: false,
    terminoElChequeo: false,
  });
  const [inicializar, setInicializar] = useState(true);

  const callbackCheckToken = (respuesta: any) => {
    if (respuesta.error) {
      //el checktokenvalid tiene dos atributos, si es valido o no el token
      //y si se termino el cheaque
      setCheckToken({ valido: false, terminoElChequeo: true });
    } else {
      setCheckToken({ valido: true, terminoElChequeo: true });
    }
  };

  //este estado de inicializar lo cree para que solo se ejecute una vez el
  //chequeo del tengo de la api
  useEffect(() => {
    checkTokenValidoHook(callbackCheckToken);
  }, [inicializar]);

  //cada vez que cambia el stado del chequeo se ejecuta
  useEffect(() => {
    //si el chequeo termino entonces entro en el if
    if (checkToken.terminoElChequeo) {
      //si fue valido no hay problema, pero sino fue valido, entonces
      //te notificara que no estas conectado y que vayas al sign-in
      if (checkToken.valido) {
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No esta conectado a alguna cuenta, por favor inicie sesión para acceder a esta opción",
        });
        push("/sign-in");
      }
    }
  }, [checkToken]);

  //esta funcion me permite transformar imagenes en texto plano
  // base64url
  const encodeFileAsBase64URL = async (file: any) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("loadend", () => {
        resolve(reader.result);
      });
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    getOnePet(petEditar.id, callbackOnePet);
  }, [comenzar]);

  const callbackOnePet = (pet: any) => {
    if (pet.id) {
      setPetData(pet);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La mascota a la que quiere acceder ya no existe",
      });
      push("/");
    }
  };

  //este callback verifica si se cargo correctamente la pet
  const callbackEditPet = (result: any) => {
    if (result) {
      setIsLoading(false);
      Swal.fire("OK", "Tu mascota se ha cargado correctamente", "success");
      push("/");
    } else {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.error,
      });
      push("/cargar-pet");
    }
  };

  //le envio el submitHandler por props al form y checkea todos
  //los campos y si esta todo ok, guarda la nueva pet con un fetch
  //a la api
  function submitHandler(e: any) {
    e.preventDefault();
    if (enviarData) {
      e.preventDefault();
      setIsLoading(true);

      if (petData.name != e.target["name"].value && e.target["name"].value) {
        petData.name = e.target["name"].value;
      }
      if (
        petData.type != e.target["tipoPet"].value &&
        e.target["tipoPet"].value
      ) {
        petData.type = e.target["tipoPet"].value;
      }
      if (
        petData.description != e.target["descripcion"].value &&
        e.target["descripcion"].value
      ) {
        petData.description = e.target["descripcion"].value;
      }
      if (fileUrl) {
        petData.picURL = fileUrl;
      }

      if (
        petData.localidad != e.target["localidad"].value &&
        e.target["localidad"].value
      ) {
        petData.localidad = e.target["localidad"].value;
      }

      if (
        petData.provincia != e.target["provincia"].value &&
        e.target["provincia"].value
      ) {
        petData.provincia = e.target["provincia"].value;
      }

      editarPet(
        petData.name,
        petData.type,
        petData.description,
        petData.picURL,
        petData.localidad,
        petData.provincia,
        petData.lost,
        petData.id,
        callbackEditPet
      );
    } else {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <div className={Css.container}>
        <h3 className={Css.containerTitle}>Reportar mascota perdida</h3>
        {isLoading && <SpinnerWhite></SpinnerWhite>}
        <form className={Css.containerForm} onSubmit={submitHandler}>
          <FieldSetEditPet
            nameValue={petData.name}
            idInput="name-input"
            nameInput="name"
            typeInput="text"
            labelName="NOMBRE(*) (Al menos 3 letras):"
          ></FieldSetEditPet>
          <FieldSetEditPet
            typeValue={petData.type}
            idInput="tipo-pet-input"
            nameInput="tipoPet"
            typeInput="text"
            labelName="TIPO DE MASCOTA(*) (Al menos 4 letras):"
          ></FieldSetEditPet>
          <img
            className={Css.mostrarImagen}
            src={imagenMostrar || petData.picURL}
            alt="Imagen de la pet a cargar(*)"
          />
          <Dropzone
            onDrop={async (file) => {
              const base64URL = (await encodeFileAsBase64URL(file[0])) as any;

              //aca voy asignar una url al archivo cargado en dropzone
              //asi lo puedo mostrar como una imagen
              const fileMostrar = Object.assign(file[0], {
                preview: URL.createObjectURL(file[0]),
              });
              //setteo la url creada
              setImagenMostrar(fileMostrar.preview);
              //Ahora que transforme la imagen en data base64URL la guardo en
              //los datos
              setFileUrl(base64URL);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div className={Css.containerDropzone} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p className={Css.containerDropzoneP}>
                    Haz click en el fondo violeta para subir una foto
                  </p>
                </div>
              </section>
            )}
          </Dropzone>
          <FieldSetEditPet
            typeValue={petData.localidad}
            idInput="tipo-pet-input"
            nameInput="localidad"
            typeInput="text"
            labelName="Ciudad/Localidad/Barrio(CABA):"
          ></FieldSetEditPet>
          <FieldSetEditPet
            typeValue={petData.provincia}
            idInput="tipo-pet-input"
            nameInput="provincia"
            typeInput="text"
            labelName="Provincia:"
          ></FieldSetEditPet>
          <FieldSetTextAreaEditPet
            descriptionValue={petData.description}
            idTextArea="descripcion"
            nameTextArea="descripcion"
            labelName="DESCRIPCION(*)"
          ></FieldSetTextAreaEditPet>
          {isLoading && <SpinnerWhite></SpinnerWhite>}
          <MainButton
            disabled={isLoading}
            onClick={() => {
              //cuando apreto el click de enviar, recien ahi pongo el state
              //de enviarData en true para que se active lo del handleSubmit
              setEnviarData(true);
            }}
          >
            ENVIAR
          </MainButton>
        </form>
      </div>
    </Layout>
  );
};

export default EditarPet;
