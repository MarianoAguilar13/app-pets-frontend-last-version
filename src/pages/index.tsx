import React, { useState, useEffect } from "react";
import Css from "./index.module.css";
import { useRouter } from "next/router";
import { MainButton } from "@/ui/buttons";
import { Layout } from "@/components/layout";
import { FormSerachPet } from "../components/form-search-pet/index";

function Home() {
  return (
    <Layout>
      <div className={Css.container}>
        <h1 className={Css.containerTitle}>Mascotas perdidas</h1>
        <div className={Css.containerLocationContainer}>
          <p className={Css.containerLocationContainerDesciption}>
            Ingrese la ciudad, localidad o barrio(CABA), para ver las mascotas
            perdidas en esa zona.
          </p>
          <div className={Css.containerLocationContainerButtonContainer}>
            <FormSerachPet></FormSerachPet>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
