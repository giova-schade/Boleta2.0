/**
  @file
  @brief <Your brief here>

  <h4> SAS Macros </h4>
  @li comparojson.sas
  @li cargaestructura.sas
  @li increasesversion.sas

**/



%macro UpdateRecord;
%put actualizo registro;

%put -----------> %length(&GRP_VIGENCIA_INICIO);

data _null_;
    p_fecha=datetime();
    call symputx('fecha_proc',p_fecha);
run;

%let change=0;
%if %length(&GRP_ESQUEMA_VALIDO.) ne 0 %then
    %do;


        proc contents data=BESASGC.BE_GRUPO_CONTROL out=variables noprint;
        run;

        data _null_;
            set variables (where=(NAME='GRP_ESQUEMA_VALIDO'));
            CALL SYMPUT("LARGO_ESQUEMA", LENGTH);
        run;

        PROC SQL;
            DROP TABLE variables;
        QUIT;

        %IF %length(&GRP_ESQUEMA_VALIDO.) NE 0 %THEN
            %DO;
                %let ESQUEMA_VALIDO_CHANGE=0;
                     %put [&GRP_ESQUEMA_VALIDO];
                %comparoJson(GRP_ESQUEMA_VALIDO="&GRP_ESQUEMA_VALIDO",GRP_CODIGO=&GRP_CODIGO);
                      %put ESQUEMA_VALIDO_CHANGE:[&ESQUEMA_VALIDO_CHANGE];
                %if &ESQUEMA_VALIDO_CHANGE ne 0 %then %do;
                %let change=1;
                    %validoSchema(json="&GRP_ESQUEMA_VALIDO");
                            %put ErrorEsquema:[&ErrorEsquema];
                    %if %length(&ErrorEsquema) eq 0 %then
                        %do;
                                       %let change=1;
                            libname CFGJSON JSON  fileref =jsonFile automap=replace;

                            %cargaEstrucutra(_programa=&GRP_CODIGO);
                             %increasesVersion(GRP_CODIGO=&GRP_CODIGO);
                             %increasesVersionValida(GRP_CODIGO=&GRP_CODIGO);
                            proc sql noprint;
                                update BESASGC.BE_GRUPO_CONTROL set GRP_ESQUEMA_VALIDO = "&GRP_ESQUEMA_VALIDO",
                                    GRP_DATE_MODIFICADO = &fecha_proc ,
                                    GRP_USER_MODIFICADO = "&_METAPERSON"
                                where GRP_CODIGO = "&GRP_CODIGO";
                            quit;
                        %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
                                    LOG_EVENTO="Esquema actualizado versión &N_GRP_VERSION.",
                                    LOG_USUARIO="&_METAPERSON",
                                    LOG_TIPO_EVENTO="004");
                        %end;
                        %else %do;
                                   %MESSAGEBE("El esquema esta incorrecto!");
                                    %SalidaWeb(Tabla=RESULT);
                         %end;
                %end;
            %END;
        %ELSE
            %DO;
                %MESSAGEBE("El esquema mayor a  &LARGO_ESQUEMA debe quitar los espacio o acortar el esquema!");
                %SalidaWeb(Tabla=RESULT);
            %END;
    %end;

%if %length(&GRP_PERIOCIDAD.) ne 0 %then
    %do;
        %let GRP_PERIOCIDAD_CHANGE=0;
        data _null_;
            set BESASGC.BE_GRUPO_CONTROL (where=(GRP_CODIGO="&GRP_CODIGO"));
            length periocidadO $30
                   periocidadD $30;
            periodin="&GRP_PERIOCIDAD";
            if periodin eq 0 then do;
                periocidadO = 'No definida';
            end;
            else if periodin eq 1 then do ;
                periocidadO = 'diaria';
            end;
            else if periodin eq 2 then do;
                periocidadO = 'semanal';
            end;
            else if periodin eq 3 then do;
                periocidadO = 'mensual';
            end;
            if GRP_PERIOCIDAD eq 0 then do;
                periocidadD = 'No definida';
            end;
            else if GRP_PERIOCIDAD eq 1 then do ;
                periocidadD = 'diaria';
            end;
            else if GRP_PERIOCIDAD eq 2 then do;
                periocidadD = 'semanal';
            end;
            else if GRP_PERIOCIDAD eq 3 then do;
                periocidadD = 'mensual';
            end;
            if periodin ne GRP_PERIOCIDAD then
                do;
                    call symput('GRP_PERIOCIDAD_CHANGE' , 1 );
                    call symput('GRP_PER_ORIGEN' ,  periocidadO);
                    call symput('GRP_PER_DESTINO' ,  periocidadD);
                end;
        run;

        %if &GRP_PERIOCIDAD_CHANGE EQ 1 %then %do;
        %let change=1;
            proc sql noprint;
                update BESASGC.BE_GRUPO_CONTROL set GRP_PERIOCIDAD = &GRP_PERIOCIDAD. ,
                    GRP_DATE_MODIFICADO = &fecha_proc ,
                    GRP_USER_MODIFICADO = "&_METAPERSON"
                where GRP_CODIGO = "&GRP_CODIGO";
            quit;
            %MueveArchivo(pathOrigen=&GRP_PER_ORIGEN,pathdestino=&GRP_PER_DESTINO,GRP_CODIGO=&GRP_CODIGO);

            %if "&mueve" eq "ok" %then %do;
                %let mensaje ="Periodo Actualizado se mueve el arhivo a la ruta &GRP_PER_DESTINO";
            %end;
            %else %Do;
                %let mensaje ="Periodo Actualizado, el codigo &GRP_CODIGO no se encontró en la ruta &GRP_PER_ORIGEN";
            %end;
            %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
            LOG_EVENTO=&mensaje,
            LOG_USUARIO="&_METAPERSON",
            LOG_TIPO_EVENTO="004");


        %end;
    %end;

%if %length(&GRP_ESTADO.) ne 0 %then
    %do;
        %let ESTADO_CHANGE=0;
        data _null_;
            set BESASGC.BE_GRUPO_CONTROL (where=(GRP_CODIGO="&GRP_CODIGO"));
            periodoin="&GRP_ESTADO";

            if periodoin ne GRP_ESTADO then
                do;
                    call symput('ESTADO_CHANGE' , 1 );
                end;
        run;
        %put ESTADO_CHANGE &ESTADO_CHANGE;
        %IF &ESTADO_CHANGE EQ 1 %THEN %DO;
            %let change=1;
            proc sql noprint;
                update BESASGC.BE_GRUPO_CONTROL set GRP_ESTADO = &GRP_ESTADO.,
                    GRP_DATE_MODIFICADO = &fecha_proc ,
                    GRP_USER_MODIFICADO = "&_METAPERSON"
                where GRP_CODIGO = "&GRP_CODIGO";
            quit;
            %if &GRP_ESTADO. eq 0 %then %do;
                %let estado_str = desactivado;
            %end;
            %else %do;
                %let estado_str = activado ;
            %end;
            %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
            LOG_EVENTO="Estado Actualizado a &estado_str.",
            LOG_USUARIO="&_METAPERSON",
            LOG_TIPO_EVENTO="004");
        %END;

    %end;
%let ESTADO_CHANGE=0;
        data _null_;
            set BESASGC.BE_GRUPO_CONTROL (where=(GRP_CODIGO="&GRP_CODIGO"));
            periodoin="&GRP_NOMBRE";

            if periodoin ne GRP_NOMBRE then
                do;
                    call symput('ESTADO_CHANGE' , 1 );
                end;
        run;
        %put ESTADO_CHANGE &ESTADO_CHANGE;
        %IF &ESTADO_CHANGE EQ 1 %THEN %DO;
            %let change=1;
            proc sql noprint;
                update BESASGC.BE_GRUPO_CONTROL set GRP_NOMBRE = "&GRP_NOMBRE.",
                    GRP_DATE_MODIFICADO = &fecha_proc ,
                    GRP_USER_MODIFICADO = "&_METAPERSON"
                where GRP_CODIGO = "&GRP_CODIGO";
            quit;
            %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
            LOG_EVENTO="Nombre Actualizado ",
            LOG_USUARIO="&_METAPERSON",
            LOG_TIPO_EVENTO="004");
        %END;

        %let ESTADO_CHANGE=0;
        data _null_;
            set BESASGC.BE_GRUPO_CONTROL (where=(GRP_CODIGO="&GRP_CODIGO"));
            periodoin="&GRP_DESCRIPCION";

            if periodoin ne GRP_DESCRIPCION then
                do;
                    call symput('ESTADO_CHANGE' , 1 );
                end;
        run;
        %put ESTADO_CHANGE &ESTADO_CHANGE;
        %IF &ESTADO_CHANGE EQ 1 %THEN %DO;
            %let change=1;
            proc sql noprint;
                update BESASGC.BE_GRUPO_CONTROL set GRP_DESCRIPCION = "&GRP_DESCRIPCION.",
                    GRP_DATE_MODIFICADO = &fecha_proc ,
                    GRP_USER_MODIFICADO = "&_METAPERSON"
                where GRP_CODIGO = "&GRP_CODIGO";
            quit;
            %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
            LOG_EVENTO="Descripción Actualizada ",
            LOG_USUARIO="&_METAPERSON",
            LOG_TIPO_EVENTO="004");
        %END;



        %let ESTADO_CHANGE=0;
        data _null_;
            set BESASGC.BE_GRUPO_CONTROL (where=(GRP_CODIGO="&GRP_CODIGO"));
            periodoin="&GRP_AREA_NEGOCIO";

            if periodoin ne GRP_AREA_NEGOCIO then
                do;
                    call symput('ESTADO_CHANGE' , 1 );
                end;
        run;
        %put ESTADO_CHANGE &ESTADO_CHANGE;
        %IF &ESTADO_CHANGE EQ 1 %THEN %DO;
            %let change=1;
            proc sql noprint;
                update BESASGC.BE_GRUPO_CONTROL set GRP_AREA_NEGOCIO = &GRP_AREA_NEGOCIO.,
                    GRP_DATE_MODIFICADO = &fecha_proc ,
                    GRP_USER_MODIFICADO = "&_METAPERSON"
                where GRP_CODIGO = "&GRP_CODIGO";
            quit;
            %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
            LOG_EVENTO="Área de negocio Actualizado ",
            LOG_USUARIO="&_METAPERSON",
            LOG_TIPO_EVENTO="004");
        %END;


        %let ESTADO_CHANGE=0;
        data _null_;
            set BESASGC.BE_GRUPO_CONTROL (where=(GRP_CODIGO="&GRP_CODIGO"));
            periodoin=input("&GRP_VIGENCIA_INICIO  0:00:00", datetime20.);

            if periodoin ne GRP_VIGENCIA_INICIO then
                do;
                    call symput('ESTADO_CHANGE' , 1 );
                end;
        run;
        %put ESTADO_CHANGE &ESTADO_CHANGE;
        %IF &ESTADO_CHANGE EQ 1 %THEN %DO;
            %let change=1;

            proc sql noprint;
                update BESASGC.BE_GRUPO_CONTROL set GRP_VIGENCIA_INICIO = input("&GRP_VIGENCIA_INICIO  0:00:00", datetime20.),
                    GRP_DATE_MODIFICADO = &fecha_proc ,
                    GRP_USER_MODIFICADO = "&_METAPERSON"
                where GRP_CODIGO = "&GRP_CODIGO";
            quit;
            %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
            LOG_EVENTO="Vigencia de Inicio Actualizado",
            LOG_USUARIO="&_METAPERSON",
            LOG_TIPO_EVENTO="004");
        %END;
        %let ESTADO_CHANGE=0;
        data _null_;
            set BESASGC.BE_GRUPO_CONTROL (where=(GRP_CODIGO="&GRP_CODIGO"));
            periodoin=input("&GRP_VIGENCIA_FIN  0:00:00", datetime20.);;

            if periodoin ne GRP_VIGENCIA_FIN then
                do;
                    call symput('ESTADO_CHANGE' , 1 );
                end;
        run;
        %put ESTADO_CHANGE &ESTADO_CHANGE;
        %IF &ESTADO_CHANGE EQ 1 %THEN %DO;
            %let change=1;
            proc sql noprint;
                update BESASGC.BE_GRUPO_CONTROL set GRP_VIGENCIA_FIN = input("&GRP_VIGENCIA_FIN  0:00:00", datetime20.),
                    GRP_DATE_MODIFICADO = &fecha_proc ,
                    GRP_USER_MODIFICADO = "&_METAPERSON"
                where GRP_CODIGO = "&GRP_CODIGO";
            quit;
            %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
            LOG_EVENTO="Vigencia fin Actualizado",
            LOG_USUARIO="&_METAPERSON",
            LOG_TIPO_EVENTO="004");
        %END;

%if %length(&GRP_HABILITADO.) ne 0 %then
    %do;
       %let ESTADO_CHANGE=0;
        data _null_;
            set BESASGC.BE_GRUPO_CONTROL (where=(GRP_CODIGO="&GRP_CODIGO"));
            GRP_HABILITADO_=&GRP_HABILITADO.;
            if GRP_HABILITADO ne GRP_HABILITADO_ then
                do;
                    call symput('ESTADO_CHANGE' , 1 );
                end;
        run;
        %IF &ESTADO_CHANGE EQ 1 %THEN %DO;
            %let change=1;
            proc sql noprint;
                update BESASGC.BE_GRUPO_CONTROL set GRP_HABILITADO = &GRP_HABILITADO.,
                    GRP_DATE_MODIFICADO = &fecha_proc ,
                    GRP_USER_MODIFICADO = "&_METAPERSON"
                where GRP_CODIGO = "&GRP_CODIGO";
            quit;
            %if &GRP_HABILITADO. eq 0 %then %do;
                %let estado_str = Desactivado;
            %end;
            %else %do;
                %let estado_str = Activado ;
            %end;
            %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
            LOG_EVENTO="Estado Actualizado a &estado_str",
            LOG_USUARIO="&_METAPERSON",
            LOG_TIPO_EVENTO="004");
        %end;
%end;

%IF &change EQ 1 %THEN %DO;

    %ViewRecord(tabla=BE_GRUPO_CONTROL,reg=&GRP_CODIGO);
%END;
%ELSE %DO;
    %MESSAGEBE("No hay cambios realizados");
    %SalidaWeb(Tabla=RESULT);
%END;



%mend UpdateRecord;