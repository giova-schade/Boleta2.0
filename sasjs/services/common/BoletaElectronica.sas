/**
  @file
  @brief primary SAS service
  @details This single service returns many different responses depending on
  the parameters

  <h4> SAS Macros </h4>
  @li main.sas
  @li mf_uid.sas
  @li mp_abort.sas
  @li setmetaperson.sas
  @li validategroup.sas

**/

%webout(FETCH)

%let dtlog = aeslog_%mf_uid();

%put ---------------> &GRP_CODIGO;
%global GRP_ESQUEMA_VALIDO GRP_PERIOCIDAD GRP_ESTADO GRP_CODIGO ACTION
  ErrorEsquema mueve GRP_PER_ORIGEN GRP_PER_DESTINO GRP_VIGENCIA_INICIO
  GRP_VIGENCIA_FIN grpexist groupname   NEW_GRP_VERSION FechaLogs UsuarioLogs
  SegmentoLogs     p_user p_tabla role_ ESQUEMA_VALIDO_CHANGE
  log FECHALOGS_MAX FECHALOGS_MIN N_GRP_VERSION;


%let p_tabla=users_list;
%let p_user="&_METAPERSON";
%let groupname="BEADM";

/*%let GRP_ESQUEMA_VALIDO = ;
%let GRP_PERIOCIDAD = 1;
%let GRP_ESTADO= 0;
%let GRP_CODIGO =grpctl_01;
%let ACTION =NewRecord;
*/

%validateGroup(username="&_METAPERSON", groupname=&groupname)

%mp_abort(iftrue= (&grpexist ne  0)
  ,mac=&_program
  ,msg=%str(&_METAPERSON, Usted no tiene permiso para ver este contenido.)
)


%setMetaperson;
%include "/sasdatad/apps/be/nominas/utils/libnames.sas";
%main(GRP_CODIGO=&GRP_CODIGO);
