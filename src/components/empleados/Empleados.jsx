import React, { useState } from "react";
import EmpleadosListado from "./EmpleadosListado";
import EmpleadosRegistro from "./EmpleadosRegistro";
import { empleadosService } from "../../services/empleados.service";
import modalDialogService from "../../services/modalDialog.service";


function Empleados() {
  const TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)",
  };
  const [AccionABMC, setAccionABMC] = useState("L");

  const [ApellidoYNombre, setApellidoYNombre] = useState("");

  const [Items, setItems] = useState(null);
  const [Item, setItem] = useState(null); // usado en BuscarporId (Modificar, Consultar)
  const [RegistrosTotal, setRegistrosTotal] = useState(0);
  const [Pagina, setPagina] = useState(1);
  const [Paginas, setPaginas] = useState([]);

  async function Buscar(_pagina) {
    if (_pagina && _pagina !== Pagina) {
      setPagina(_pagina);
    }
    // OJO Pagina (y cualquier estado...) se actualiza para el proximo render, para buscar usamos el parametro _pagina
    else {
      _pagina = Pagina;
    }
    modalDialogService.BloquearPantalla(true);
    const data = await empleadosService.Buscar(ApellidoYNombre, _pagina);
    modalDialogService.BloquearPantalla(false);
    setItems(data.Items);
    setRegistrosTotal(data.RegistrosTotal);

    //generar array de las páginas para mostrar en select del paginador
    const arrPaginas = [];
    for (let i = 1; i <= Math.ceil(data.RegistrosTotal / 10); i++) {
      arrPaginas.push(i);
    }
    setPaginas(arrPaginas);
  }

  async function BuscarPorId(item, accionABMC) {
    const data = await empleadosService.BuscarPorId(item);
    setItem(data);
    setAccionABMC(accionABMC);
  }
  

  function Consultar(item) {
    BuscarPorId(item, "C"); // paso la accionABMC pq es asincrono la busqueda y luego de ejecutarse quiero cambiar el estado accionABMC
  }
  function Modificar(item) {
    BuscarPorId(item, "M"); // paso la accionABMC pq es asincrono la busqueda y luego de ejecutarse quiero cambiar el estado accionABMC
  }

  async function Agregar() {
    setAccionABMC("A");
    setItem({
      IdEmpleado: 0,
      ApellidoYNombre: "",
      Dni: "",
      FechaNacimiento: "",
      Suspendido: false,
    });
  }
  
  function Imprimir() {
    modalDialogService.Alert("En desarrollo...");
  }

  async function ActivarDesactivar(item) {
    modalDialogService.Confirm(
      "Esta seguro que quiere " +
        (item.Activo ? "desactivar" : "activar") +
        " el registro?",
      undefined,
      undefined,
      undefined,
      async () => {
        await empleadosService.ActivarDesactivar(item);
        await Buscar();
      }
    );

  }
  
  

  async function Grabar(item) {
    // agregar o modificar
    try
    {
      await empleadosService.Grabar(item);
    }
    catch (error)
    {
      modalDialogService.Alert(error?.response?.data?.message ?? error.toString())
      return;
    }
    await Buscar();
    Volver();
  
    //setTimeout(() => {
      modalDialogService.Alert(
        "Registro " +
          (AccionABMC === "A" ? "agregado" : "modificado") +
          " correctamente."
      );
    //}, 0);
  }
  

  // Volver/Cancelar desde Agregar/Modificar/Consultar
  function Volver() {
    setAccionABMC("L");
  }

  return (
    <div>
      <div className="tituloPagina">
        Empleados <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>

      {AccionABMC === "L" && (
        // <EmpleadosBuscar
        //   ApellidoYNombre={ApellidoYNombre}
        //   setApellidoYNombre={setApellidoYNombre}
        //   Buscar={Buscar}
        //   Agregar={Agregar}
        // />
        <form>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-4 col-md-2">
                <label className="col-form-label">ApellidoYNombre:</label>
              </div>
              <div className="col-sm-8 col-md-4">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setApellidoYNombre(e.target.value)}
                  value={ApellidoYNombre}
                  maxLength="55"
                  autoFocus
                />
              </div>
            </div>

            <hr />

            {/* Botones */}
            <div className="row">
              <div className="col text-center botones">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => Buscar(1)}
                >
                  <i className="fa fa-search"> </i> Buscar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => Agregar()}
                >
                  <i className="fa fa-plus"> </i> Agregar
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Tabla de resutados de busqueda y Paginador */}
      {AccionABMC === "L" && Items?.length > 0 && (
        <EmpleadosListado
          {...{
            Items,
            Consultar,
            Modificar,
            ActivarDesactivar,
            Imprimir,
            Pagina,
            RegistrosTotal,
            Paginas,
            Buscar,
          }}
        />
      )}

      {AccionABMC === "L" && Items?.length === 0 && (
        <div className="alert alert-info mensajesAlert">
          <i className="fa fa-exclamation-sign"></i>
          No se encontraron registros...
        </div>
      )}

      {/* Formulario de alta/modificacion/consulta */}
      {AccionABMC !== "L" && (
        <EmpleadosRegistro {...{ AccionABMC, Item, Grabar, Volver }} />
      )}
    </div>
  );
}
export { Empleados };
