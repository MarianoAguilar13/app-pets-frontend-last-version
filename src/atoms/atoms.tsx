import { atom } from "recoil";

export const userLogin = atom({
  key: "userLoginKey",
  default: {
    mail: "",
    password: "",
  },
});

export const token = atom({
  key: "token",
  default: {
    token: "",
  },
});

export const searchLocation = atom({
  key: "searchLocation",
  default: {
    location: "",
  },
});

export const userCreate = atom({
  key: "userCreate",
  default: {
    mail: "",
    password: "",
    name: "",
    passwordRepetida: "",
  },
});

export const checkToken = atom({
  key: "checkToken",
  default: {
    valido: false,
    terminoElChequeo: false,
  },
});

export const misDatos = atom({
  key: "misDatos",
  default: {
    name: "",
    password: "",
    newPassword: "",
    newPasswordRepetido: "",
  },
});

export const myName = atom({
  key: "myName",
  default: {
    name: "",
  },
});

export const valueName = atom({
  key: "valueName",
  default: "",
});

//es el id de la pet que se quiere reportar
export const idPet = atom({
  key: "idPet",
  default: { id: "", name: "" },
});

export const idPetEditar = atom({
  key: "idPetEditar",
  default: { id: 1 },
});

//este atom es para guardar el mail de usuario dueño de la pet
export const mailUser = atom({
  key: "mailUser",
  default: { mail: "" },
});

export const sesionIniciada = atom({
  key: "sesioniniciada",
  default: { sesionOn: false, name: "" },
});

/*
export const buttonHidden = atom({
  key: "mailUser",
  default: { hidden: false },
});*/
