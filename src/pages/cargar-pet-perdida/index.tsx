import React, { useState, useEffect } from "react";
import Css from "./index.module.css";
import { MainFieldSet } from "../../ui/fields-sets";
import { FieldSetTextArea } from "../../ui/fields-sets";
import { MainButton } from "../../ui/buttons";
import Dropzone from "react-dropzone";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { checkTokenValidoHook } from "@/api-hooks/api-hooks-mis-datos";
import { cargarPet } from "../../api-hooks/api-hooks";
import { SpinnerWhite } from "../../components/spinner-white";
import Swal from "sweetalert2";
import { ProvinciaSelect } from "../../ui/select/index";

const CargarPet = () => {
  const { push } = useRouter();

  //este es la data uri de la imagen a cargar
  const [fileUrl, setFileUrl] = useState();
  const [enviarData, setEnviarData] = useState(false);
  //este state sirve para mostrar la pseudo url creada para mostrar
  //la imagen que se quiere cargar
  const [imagenMostrar, setImagenMostrar] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //x
  const [checkToken, setCheckToken] = useState({
    valido: false,
    terminoElChequeo: false,
  });

  const callbackCheckToken = (respuesta: any) => {
    if (respuesta.error) {
      //el checktokenvalid tiene dos atributos, si es valido o no el token
      //y si se termino el cheaque
      setCheckToken({ valido: false, terminoElChequeo: true });
    } else {
      setCheckToken({ valido: true, terminoElChequeo: true });
    }
  };

  //chequeo del token de la api
  useEffect(() => {
    checkTokenValidoHook(callbackCheckToken);
  }, []);

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
          text: "No está conectado a una cuenta, por favor inicie sesión para acceder a esta opción",
        });
        push("/sign-in");
      }
    }
  }, [checkToken]);

  //y

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

  //este callback verifica si se cargo correctamente la pet
  const callbackCargarPet = (result: any) => {
    if (result.petId) {
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
      const allData = {
        name: e.target["name"].value,
        type: e.target["tipoPet"].value,
        description: e.target["descripcion"].value,
        pictureDataURL: fileUrl,
        localidad: e.target["localidad"].value,
        provincia: e.target["provincia"].value,
        lost: true,
      };

      if (allData.localidad == "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor seleccione una provincia y podrá cargar a su mascota al sistema",
        });

        setIsLoading(false);
      } else {
        if (allData.pictureDataURL && allData.provincia && allData.localidad) {
          cargarPet(
            allData.name,
            allData.type,
            allData.description,
            allData.pictureDataURL,
            allData.localidad,
            allData.provincia,
            allData.lost,
            callbackCargarPet
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Por favor recuerde que es necesario ingresar una foto de su mascota y una ubicación donde se avisto por última vez ",
          });
          push("/cargar-pet-perdida");
          setIsLoading(false);
        }
      }
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
          <MainFieldSet
            idInput="name-input"
            nameInput="name"
            typeInput="text"
            labelName="NOMBRE(*) (Al menos 3 letras):"
          ></MainFieldSet>
          <MainFieldSet
            idInput="tipo-pet-input"
            nameInput="tipoPet"
            typeInput="text"
            labelName="TIPO DE MASCOTA(*) (Al menos 4 letras):"
          ></MainFieldSet>
          <img
            className={Css.mostrarImagen}
            src={imagenMostrar}
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
                    Haz click para subir una foto
                  </p>
                </div>
              </section>
            )}
          </Dropzone>
          <FieldSetTextArea
            idTextArea="descripcion"
            nameTextArea="descripcion"
            labelName="DESCRIPCION(*)"
          ></FieldSetTextArea>
          <MainFieldSet
            idInput="tipo-pet-input"
            nameInput="localidad"
            typeInput="text"
            labelName="Ciudad/Localidad/Barrio(CABA):"
          ></MainFieldSet>
          <ProvinciaSelect></ProvinciaSelect>
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

export default CargarPet;
