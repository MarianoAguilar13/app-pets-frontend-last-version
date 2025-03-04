import React from "react";
import Css from "./index.module.css";
import { MainInput } from "../inputs";
import { MainLabel } from "../labels";
import { MainTextArea } from "../texts-area";
import { InputEditPet } from "../inputs";
import { TextAreaEditPet } from "../texts-area";

type PropsFielSet = {
  idInput: string;
  nameInput: string;
  typeInput: string;
  labelName: string;
  nameValue?: boolean;
};

type PropsFieldSetTextArea = {
  idTextArea: string;
  nameTextArea: string;
  labelName: string;
};

type PropsFieldSetEditPet = {
  idInput: string;
  nameInput: string;
  typeInput: string;
  labelName: string;
  nameValue?: any;
  typeValue?: any;
  urlValue?: any;
};

type PropsFieldSetTextAreaEditPet = {
  idTextArea: string;
  nameTextArea: string;
  labelName: string;
  descriptionValue?: any;
};

export function MainFieldSet(props: PropsFielSet) {
  return (
    <div className={Css.contenedorFieldset}>
      <MainLabel id={props.idInput}>{props.labelName}</MainLabel>
      <MainInput
        nameValue={props.nameValue}
        idInput={props.idInput}
        nameInput={props.nameInput}
        typeInput={props.typeInput}
      ></MainInput>
    </div>
  );
}

export function FieldSetSearch(props: PropsFielSet) {
  return (
    <div className={Css.contenedorFieldsetSearch}>
      <MainLabel id={props.idInput}>{props.labelName}</MainLabel>
      <MainInput
        nameValue={props.nameValue}
        idInput={props.idInput}
        nameInput={props.nameInput}
        typeInput={props.typeInput}
      ></MainInput>
    </div>
  );
}

export function FieldSetTextArea(props: PropsFieldSetTextArea) {
  return (
    <div className={Css.contenedorFieldset}>
      <MainLabel id={props.idTextArea}>{props.labelName}</MainLabel>
      <MainTextArea
        idTextArea={props.idTextArea}
        nameTextArea={props.nameTextArea}
      ></MainTextArea>
    </div>
  );
}

export function FieldSetEditPet(props: PropsFieldSetEditPet) {
  return (
    <div className={Css.contenedorFieldset}>
      <MainLabel id={props.idInput}>{props.labelName}</MainLabel>
      <InputEditPet
        typeValue={props.typeValue}
        urlValue={props.nameValue}
        nameValue={props.nameValue}
        idInput={props.idInput}
        nameInput={props.nameInput}
        typeInput={props.typeInput}
      ></InputEditPet>
    </div>
  );
}

export function FieldSetTextAreaEditPet(props: PropsFieldSetTextAreaEditPet) {
  return (
    <div className={Css.contenedorFieldset}>
      <MainLabel id={props.idTextArea}>{props.labelName}</MainLabel>
      <TextAreaEditPet
        descriptionValue={props.descriptionValue}
        idTextArea={props.idTextArea}
        nameTextArea={props.nameTextArea}
      ></TextAreaEditPet>
    </div>
  );
}
