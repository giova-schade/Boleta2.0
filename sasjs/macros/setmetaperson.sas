/**
  @file
  @brief Choose the username from available variables

**/
%macro setMetaperson();
%put _METAPERSON:[&_METAPERSON];
%put _METAUSER:[&_METAUSER];
%put SYSUSERID:[&SYSUSERID];

%if %length(&_METAPERSON) eq 0 %then %do;
    %if %length(&_METAUSER) eq 0 %then %do;
        %IF %LENGTH (&SYSUSERID) eq  0 %THEN %DO;
            %let _METAPERSON =usuario no encontrado;
        %END;
        %else %do;
            %let _METAPERSON =&SYSUSERID;
        %end;
    %end;
    %else %do;
        %let _METAPERSON =&_METAUSER;
    %end;
%end;
%else %do;
%let _METAPERSON =&_METAUSER;
%end;
%mend setMetaperson;