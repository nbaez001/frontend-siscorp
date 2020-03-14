import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ControlPatrimonioRoutingModule } from './control-patrimonio-routing.module';
import { AltaBienesComponent } from './components/alta-bienes/alta-bienes.component';
import { SharedModule } from '@shared/shared.module';
import { SharedModulesUaModule } from '../shared-module-ua.module';
import { MAT_DATE_LOCALE } from '@angular/material';
import { RegAdqIndividualComponent } from './components/alta-bienes/reg-adq-individual/reg-adq-individual.component';
import { RegAdqMasivoComponent } from './components/alta-bienes/reg-adq-masivo/reg-adq-masivo.component';
import { BusBienCatalogoComponent } from './components/alta-bienes/reg-adq-individual/bus-bien-catalogo/bus-bien-catalogo.component';
import { RegIndvBnsSbrtsComponent } from './components/bdj-bns-sobrantes/reg-indv-bns-sbrts/reg-indv-bns-sbrts.component';
import { RegMasivBnsSbrtsComponent } from './components/bdj-bns-sobrantes/reg-masiv-bns-sbrts/reg-masiv-bns-sbrts.component';
import { BdjBnsSobrantesComponent } from './components/bdj-bns-sobrantes/bdj-bns-sobrantes.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BdjBnsPatrimonialesComponent } from './components/bdj-bns-patrimoniales/bdj-bns-patrimoniales.component';
import { BdjBajaBienesComponent } from './components/bdj-baja-bienes/bdj-baja-bienes.component';
import { AltaBnsSobrComponent } from './components/bdj-bns-sobrantes/alta-bns-sobr/alta-bns-sobr.component';
import { RegBajaBienesComponent } from './components/bdj-baja-bienes/reg-baja-bienes/reg-baja-bienes.component';
import { BuscarBnsPatrimonComponent } from './components/bdj-baja-bienes/reg-baja-bienes/buscar-bns-patrimon/buscar-bns-patrimon.component';
import { VerBajaBienesComponent } from './components/bdj-baja-bienes/reg-baja-bienes/ver-baja-bienes/ver-baja-bienes.component';
import { VerDetAdqComponent } from './components/alta-bienes/ver-det-adq/ver-det-adq.component';
import { AuthModule } from '@shared/auth/auth.module';
import { BnsPatrimonialesService } from './services/bns-patrimoniales.service';
import { BdjAsigBienesComponent } from './components/bdj-asig-bienes/bdj-asig-bienes.component';
import { BdjEtrgRcpBienesComponent } from './components/bdj-etrg-rcp-bienes/bdj-etrg-rcp-bienes.component';
import { BdjReportBienesComponent } from './components/bdj-report-bienes/bdj-report-bienes.component';
import { RegAsigBienesComponent } from './components/bdj-asig-bienes/reg-asig-bienes/reg-asig-bienes.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BnsPatrimonioService } from '../control-combustible/services/bns-patrimonio.service';
import { BuscarEmpleadoComponent } from './components/bdj-asig-bienes/buscar-empleado/buscar-empleado.component';
import { BdjAutorizSldaRtnoComponent } from './components/bdj-autoriz-slda-rtno/bdj-autoriz-slda-rtno.component';
import { RegSldaRtnoComponent } from './components/bdj-autoriz-slda-rtno/reg-slda-rtno/reg-slda-rtno.component';
import { BdjDesplBienesComponent } from './components/bdj-despl-bienes/bdj-despl-bienes.component';
import { RegEtrgRcpBienesComponent } from './components/bdj-etrg-rcp-bienes/reg-etrg-rcp-bienes/reg-etrg-rcp-bienes.component';
import { BdjAutorizIngSldaBtComponent } from './components/bdj-autoriz-ing-slda-bt/bdj-autoriz-ing-slda-bt.component';
import { RegAutorizIngSldaBtComponent } from './components/bdj-autoriz-ing-slda-bt/reg-autoriz-ing-slda-bt/reg-autoriz-ing-slda-bt.component';

@NgModule({
  entryComponents: [
    RegAdqIndividualComponent,
    RegAdqMasivoComponent,
    BusBienCatalogoComponent,
    RegIndvBnsSbrtsComponent,
    RegMasivBnsSbrtsComponent,
    AltaBnsSobrComponent,
    RegBajaBienesComponent,
    BuscarBnsPatrimonComponent,
    VerBajaBienesComponent,
    VerDetAdqComponent,
    RegAsigBienesComponent,
    BuscarEmpleadoComponent,
    RegSldaRtnoComponent,
    RegEtrgRcpBienesComponent,
    RegAutorizIngSldaBtComponent,
  ],
  declarations: [
    RegAdqIndividualComponent,
    RegAdqMasivoComponent,
    BusBienCatalogoComponent,
    RegIndvBnsSbrtsComponent,
    RegMasivBnsSbrtsComponent,
    AltaBnsSobrComponent,
    RegBajaBienesComponent,
    BuscarBnsPatrimonComponent,
    VerBajaBienesComponent,
    VerDetAdqComponent,
    RegAsigBienesComponent,
    BuscarEmpleadoComponent,
    RegSldaRtnoComponent,
    RegEtrgRcpBienesComponent,
    RegAutorizIngSldaBtComponent,

    AltaBienesComponent,
    BdjBnsSobrantesComponent,
    BdjBnsPatrimonialesComponent,
    BdjBajaBienesComponent,
    BdjAsigBienesComponent,
    BdjEtrgRcpBienesComponent,
    BdjReportBienesComponent,
    BdjAutorizSldaRtnoComponent,
    BdjDesplBienesComponent,
    BdjAutorizIngSldaBtComponent,
  ],
  imports: [
    NgxSpinnerModule,
    CommonModule,
    ControlPatrimonioRoutingModule,
    SharedModule,
    SharedModulesUaModule,
    AuthModule.forRoot(),
    TableModule,//ELIMINAR
    DropdownModule,//ELIMINAR
    CalendarModule,//ELIMINAR
    AutoCompleteModule,//ELIMINAR
    ChipsModule,//ELIMINAR
  ],
  providers: [
    DatePipe,
    DecimalPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    BnsPatrimonialesService,
    BnsPatrimonioService, //SERVICE OF CONTROL COMBUSTIBLE MODULE
  ]
})
export class ControlPatrimonioModule { }
