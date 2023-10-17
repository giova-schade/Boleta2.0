/**
  @file
  @brief get metadata groups
  @details Obtener la lista de GRUPOS Y ROLES por usuario en session

  @param _user= filter by user
  @param outds= (work.groups) Output dataset to create

**/

%macro get_meta_groups(_user=, outds=work.groups);
%local role_;
  data meta_groups;
    length uri name group groupuri desgroup grouptype $256;
    length id MDUpdate $20;
    n=1;
    call missing(uri, name, group, groupuri, desgroup ,grouptype,id ,MDUpdate);
    nobj=metadata_getnobj("omsobj:Person?@Id contains '.'",n,uri);
    if nobj=0 then put '## No Persons available.';
    else do;
      /*#0*/
      put '## Persons available.';

      do while (nobj > 0); /*#1*/
        rc=metadata_getattr(uri, "Name", Name);
        put uri=;
        put Name=;

        if Name=&_user then do; /* #2*/
          put '## Search grupos user.';
          a=1;
          grpassn=metadata_getnasn(uri,"IdentityGroups",a,groupuri);
          if grpassn in (-3,-4) then do;
            group="No groups";
            output;
          end;
          else do ;/*#3*/
            do while (grpassn > 0);
              _rc=metadata_getattr(groupuri, "Name", group);
              _rc=metadata_getattr(groupuri, "Desc", desgroup);
              _rc=metadata_getattr(groupuri,"GroupType",grouptype);
              a+1;
              output;
              grpassn=metadata_getnasn(uri,"IdentityGroups",a,groupuri);
              put groupuri=;
            end;
          end; /*#3*/
        end; /*#2*/

        n+1;
        nobj=metadata_getnobj("omsobj:Person?@Id contains '.'",n,uri);
      end; /*#1*/
    end;/*#0*/
    keep  name group desgroup grouptype;
  run;

  data _null_;
    set meta_groups;

    if  group eq 'BEADM' then
        do;
            /*Se excluye los Roles y BD Potsgres*/
            call symput('role_' , group);
        end;
  run;

  data &outds;
    role = "&role_";
    Nombre = &_user;
  run;

%mend get_meta_groups;