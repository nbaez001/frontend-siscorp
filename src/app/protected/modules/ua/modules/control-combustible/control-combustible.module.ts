import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { ControlCombustibleRoutingModule } from './control-combustible-routing.module';
import { BdjVehiculosComponent } from './components/bdj-vehiculos/bdj-vehiculos.component';
import { SharedModule } from '@shared/shared.module';
import { SharedModulesUaModule } from '../shared-module-ua.module';
import { MAT_DATE_LOCALE } from '@angular/material';
import { RegArtEmergenciaComponent } from './components/bdj-vehiculos/reg-art-emergencia/reg-art-emergencia.component';
import { RegConductorComponent } from './components/bdj-vehiculos/reg-conductor/reg-conductor.component';
import { RegPrevLubricanteComponent } from './components/bdj-vehiculos/reg-prev-lubricante/reg-prev-lubricante.component';
import { RegRevTecnicaComponent } from './components/bdj-vehiculos/reg-rev-tecnica/reg-rev-tecnica.component';
import { RegSoatComponent } from './components/bdj-vehiculos/reg-soat/reg-soat.component';
import { BdjGrpElectrogenoComponent } from './components/bdj-grp-electrogeno/bdj-grp-electrogeno.component';
import { RegPrevLubricanteGrpElecComponent } from './components/bdj-grp-electrogeno/reg-prev-lubricante-grp-elec/reg-prev-lubricante-grp-elec.component';
import { BdjDeslizadoresComponent } from './components/bdj-deslizadores/bdj-deslizadores.component';
import { RegPrevLubricanteDeslComponent } from './components/bdj-deslizadores/reg-prev-lubricante-desl/reg-prev-lubricante-desl.component';
import { BdjCtrlKilometrajeComponent } from './components/bdj-ctrl-kilometraje/bdj-ctrl-kilometraje.component';
import { RegKilometrajeComponent } from './components/bdj-ctrl-kilometraje/reg-kilometraje/reg-kilometraje.component';
import { VerObservacionComponent } from './components/bdj-ctrl-kilometraje/ver-observacion/ver-observacion.component';
import { BdjHrsGrpElectrogenoComponent } from './components/bdj-hrs-grp-electrogeno/bdj-hrs-grp-electrogeno.component';
import { BdjHrsDeslizadorComponent } from './components/bdj-hrs-deslizador/bdj-hrs-deslizador.component';
import { RegHrsDeslizadorComponent } from './components/bdj-hrs-deslizador/reg-hrs-deslizador/reg-hrs-deslizador.component';
import { RegHrsGrpElectrogenoComponent } from './components/bdj-hrs-grp-electrogeno/reg-hrs-grp-electrogeno/reg-hrs-grp-electrogeno.component';
import { BdjReqServiciosComponent } from './components/bdj-req-servicios/bdj-req-servicios.component';
import { BdjSolMantenimientoComponent } from './components/bdj-sol-mantenimiento/bdj-sol-mantenimiento.component';
import { BdjReqBienesComponent } from './components/bdj-req-bienes/bdj-req-bienes.component';
import { RegSolMantenimientoComponent } from './components/bdj-sol-mantenimiento/reg-sol-mantenimiento/reg-sol-mantenimiento.component';
import { RegReqServicioComponent } from './components/bdj-req-servicios/reg-req-servicio/reg-req-servicio.component';
import { BuscarOrdenComponent } from './components/bdj-req-servicios/reg-req-servicio/buscar-orden/buscar-orden.component';
import { BuscarSolMantComponent } from './components/bdj-req-servicios/reg-req-servicio/buscar-sol-mant/buscar-sol-mant.component';
import { RegSolFonfecgComponent } from './components/bdj-req-servicios/reg-req-servicio/reg-sol-fonfecg/reg-sol-fonfecg.component';
import { VerDetMantComponent } from './components/bdj-req-servicios/reg-req-servicio/ver-det-mant/ver-det-mant.component';
import { RegReqCombustibleComponent } from './components/bdj-req-bienes/reg-req-combustible/reg-req-combustible.component';
import { CuadroCtrlDetalladoComponent } from './components/cuadro-ctrl-detallado/cuadro-ctrl-detallado.component';
import { CuadroCtrlPresupuestalComponent } from './components/cuadro-ctrl-presupuestal/cuadro-ctrl-presupuestal.component';
import { BdjBancosComponent } from './components/config/bdj-bancos/bdj-bancos.component';
import { BdjFondoEcgComponent } from './components/config/bdj-fondo-ecg/bdj-fondo-ecg.component';
import { BdjOrdCompraComponent } from './components/config/bdj-ord-compra/bdj-ord-compra.component';
import { BdjOrdServicioComponent } from './components/config/bdj-ord-servicio/bdj-ord-servicio.component';
import { BdjProveedoresComponent } from './components/config/bdj-proveedores/bdj-proveedores.component';
import { RegBancoComponent } from './components/config/bdj-bancos/reg-banco/reg-banco.component';
import { RegFondoEcgComponent } from './components/config/bdj-fondo-ecg/reg-fondo-ecg/reg-fondo-ecg.component';
import { IptOrdCompraComponent } from './components/config/bdj-ord-compra/ipt-ord-compra/ipt-ord-compra.component';
import { CfgOrdCompraComponent } from './components/config/bdj-ord-compra/cfg-ord-compra/cfg-ord-compra.component';
import { IptOrdServComponent } from './components/config/bdj-ord-servicio/ipt-ord-serv/ipt-ord-serv.component';
import { CfgOrdServComponent } from './components/config/bdj-ord-servicio/cfg-ord-serv/cfg-ord-serv.component';
import { RegProveedorComponent } from './components/config/bdj-proveedores/reg-proveedor/reg-proveedor.component';
import { BuscProveedorComponent } from './components/config/bdj-ord-compra/cfg-ord-compra/busc-proveedor/busc-proveedor.component';
import { RegAsigPresupuestalComponent } from './components/bdj-asig-presupuestal/reg-asig-presupuestal/reg-asig-presupuestal.component';
import { BdjAsigPresupuestalComponent } from './components/bdj-asig-presupuestal/bdj-asig-presupuestal.component';
import { ControlCombustibleService } from './services/control-combustible.service';
import { BnsPatrimonioService } from './services/bns-patrimonio.service';
import { AuthModule } from '@shared/auth/auth.module';
import { BuscarEmpleadoComponent } from './components/bdj-vehiculos/reg-conductor/buscar-empleado/buscar-empleado.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  entryComponents: [
    RegArtEmergenciaComponent,
    RegConductorComponent,
    RegPrevLubricanteComponent,
    RegRevTecnicaComponent,
    RegSoatComponent,
    RegPrevLubricanteGrpElecComponent,
    RegPrevLubricanteDeslComponent,
    RegKilometrajeComponent,
    VerObservacionComponent,
    RegHrsDeslizadorComponent,
    RegHrsGrpElectrogenoComponent,
    RegSolMantenimientoComponent,
    RegReqServicioComponent,
    BuscarOrdenComponent,
    BuscarSolMantComponent,
    RegSolFonfecgComponent,
    VerDetMantComponent,
    RegReqCombustibleComponent,
    RegBancoComponent,
    RegFondoEcgComponent,
    IptOrdCompraComponent,
    CfgOrdCompraComponent,
    IptOrdServComponent,
    CfgOrdServComponent,
    RegProveedorComponent,
    BuscProveedorComponent,
    RegAsigPresupuestalComponent,
    BuscarEmpleadoComponent,
  ],
  declarations: [
    RegArtEmergenciaComponent,
    RegConductorComponent,
    RegPrevLubricanteComponent,
    RegRevTecnicaComponent,
    RegSoatComponent,
    RegPrevLubricanteGrpElecComponent,
    RegPrevLubricanteDeslComponent,
    RegKilometrajeComponent,
    VerObservacionComponent,
    RegHrsDeslizadorComponent,
    RegHrsGrpElectrogenoComponent,
    RegSolMantenimientoComponent,
    RegReqServicioComponent,
    BuscarOrdenComponent,
    BuscarSolMantComponent,
    RegSolFonfecgComponent,
    VerDetMantComponent,
    RegReqCombustibleComponent,
    RegBancoComponent,
    RegFondoEcgComponent,
    IptOrdCompraComponent,
    CfgOrdCompraComponent,
    IptOrdServComponent,
    CfgOrdServComponent,
    RegProveedorComponent,
    BuscProveedorComponent,
    RegAsigPresupuestalComponent,
    BuscarEmpleadoComponent,


    BdjVehiculosComponent,
    BdjGrpElectrogenoComponent,
    BdjDeslizadoresComponent,
    BdjCtrlKilometrajeComponent,
    BdjHrsGrpElectrogenoComponent,
    BdjHrsDeslizadorComponent,
    BdjReqServiciosComponent,
    BdjSolMantenimientoComponent,
    BdjReqBienesComponent,
    CuadroCtrlDetalladoComponent,
    CuadroCtrlPresupuestalComponent,
    BdjBancosComponent,
    BdjFondoEcgComponent,
    BdjOrdCompraComponent,
    BdjOrdServicioComponent,
    BdjProveedoresComponent,
    BdjAsigPresupuestalComponent,

  ],
  imports: [
    NgxSpinnerModule,
    CommonModule,
    ControlCombustibleRoutingModule,
    SharedModule,
    SharedModulesUaModule,
    AuthModule.forRoot(),
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    ControlCombustibleService,
    BnsPatrimonioService,
  ],
  exports: [
    BuscarEmpleadoComponent,//FOR OTHER MODULE
  ]
})
export class ControlCombustibleModule { }
