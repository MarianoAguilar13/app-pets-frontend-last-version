import React, { useState, useEffect } from "react";
import { CardPetPerdida } from "../../components/card-pet-perdida";
import Css from "./index.module.css";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { SpinnerWhite } from "../../components/spinner-white";
import { Layout } from "@/components/layout";
import Swal from "sweetalert2";
import { searchLocation } from "@/atoms/atoms";
import { MainButton } from "@/ui/buttons";
import { petsByLocation } from "@/api-hooks/api-hooks";

const PetsCercanas = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [newSearchLocation, setNewSearchLocation] =
    useRecoilState(searchLocation);

  const [lasPetsByLocation, setLasPetsByLocation] = useState([]);

  const { push } = useRouter();

  //ejecuta el callback luego de que finalice el fetch
  //si encontro mascotas se settearan en el state y sino
  //se dara una alerta y lo redirigira al home
  const callbackPetsByLocation = (respuesta: any) => {
    if (respuesta[0]) {
      setLasPetsByLocation(respuesta);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No hay mascotas cerca de tu hubicación",
      });
      push("/");
    }
  };

  //se ejecuta una unica vez cuando se icicia el componente
  useEffect(() => {
    setIsLoading(true);
    petsByLocation(newSearchLocation.location, callbackPetsByLocation);
  }, []);

  return lasPetsByLocation ? (
    <Layout>
      <div className={Css.container}>
        <h1 className={Css.containerTitle}>{}Mascotas perdidas cerca tuyo</h1>
        {isLoading && <SpinnerWhite></SpinnerWhite>}
        <div className={Css.containerCard}>
          {lasPetsByLocation.map((r: any) => (
            <CardPetPerdida
              key={r.id}
              id={r.id}
              name={r.name}
              urlImagen={r.picURL}
              description={r.description}
              localidad={r.localidad}
              provincia={r.provincia}
            />
          ))}
        </div>
        <div className={Css.containerButton}>
          <MainButton
            disabled={isLoading}
            onClick={() => {
              push("/");
            }}
          >
            volver a buscar
          </MainButton>
        </div>
      </div>
    </Layout>
  ) : (
    <Layout>
      <div className={Css.container}>
        {isLoading && <SpinnerWhite></SpinnerWhite>}
        <h1 className={Css.containerTitle}>Mascotas perdidas cerca tuyo</h1>
      </div>
      <MainButton
        disabled={isLoading}
        onClick={() => {
          push("/");
        }}
      >
        volver a buscar
      </MainButton>
    </Layout>
  );
};

export default PetsCercanas;
