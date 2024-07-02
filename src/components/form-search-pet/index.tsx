import Css from "./index.module.css";
import { FieldSetSearch, MainFieldSet } from "../../ui/fields-sets";
import { MainButton } from "../../ui/buttons";
import { searchLocation } from "@/atoms/atoms";
import { useRecoilState } from "recoil";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export function FormSerachPet() {
  const [newSearchLocation, setNewSearchLocation] =
    useRecoilState(searchLocation);

  const { push } = useRouter();

  const submitHandler = (e: any) => {
    e.preventDefault();

    if (
      e.target.location.value.length <= 30 &&
      e.target.location.value.length >= 3
    ) {
      const newLocation = {
        location: e.target.location.value,
      };

      setNewSearchLocation(newLocation);

      push("/pets-cercanas");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El lugar que esta ingresando debe tener minimo 3 caracteres y maximo 30",
      });
    }
  };

  return (
    <form onSubmit={submitHandler} className={Css.form}>
      <FieldSetSearch
        idInput={"location-input"}
        nameInput={"location"}
        typeInput={"text"}
        labelName={"Ciudad, Localidad o Barrio(CABA)"}
      ></FieldSetSearch>
      <MainButton>{"Enviar"}</MainButton>
    </form>
  );
}
