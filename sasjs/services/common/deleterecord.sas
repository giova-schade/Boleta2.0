/**
  @file
  @brief Delete the records according to GRP_CODIGO value

  <h4> Service Inputs </h4>

  <h5> work.from_ng </h5>

  |GRP_CODIGO:$32.|
  |---|
  |`SOMEVALUE `|


  <h4> SAS Macros </h4>
  @li mp_abort.sas
  @li insertevent.sas
  @li deleterecord.sas
  @li messagebe.sas

**/


/* get data from frontend */
%webout(FETCH)

/* extract variable from input table */
%let GRP_CODIGO=0;
data _null_;
  set work.from_ng;
  call symputx('GRP_CODIGO',GRP_CODIGO);
run;

/* abort if variable not found */
%mp_abort(iftrue= (&GRP_CODIGO=0)
  ,mac=&_program
  ,msg=%str(Debe ingresar un código de segmento)
)

/* insert the event */
%InsertEvent(GRP_CODIGO="&GRP_CODIGO",
  LOG_EVENTO="El código &GRP_CODIGO ha sido eliminado",
  LOG_USUARIO="&_METAPERSON",
  LOG_TIPO_EVENTO="005"
)

/* delete the records */
%DeleteRecord(&GRP_CODIGO)

/* return work.response from viewrecord macro */
%webout(OPEN)
%webout(obj,response)
%webout(CLOSE)
