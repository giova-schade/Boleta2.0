/**
  @file appinit.sas
  @brief Initialisation service - runs on app startup
  @details  This is always the first service called when the app is opened.

  <h4> SAS Macros </h4>
  @li mf_getuser.sas
  @li get_meta_groups.sas

**/

%get_meta_groups(_user="%mf_getuser()",outds=work.groups)

%webout(OPEN)
%webout(OBJ,groups)
%webout(CLOSE)
