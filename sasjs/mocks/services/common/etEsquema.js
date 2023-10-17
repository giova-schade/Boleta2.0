_webout = `{
    "fields": [
        {
            "metadata": {},
            "name": "rut",
            "nullable": false,
            "type": "long"
        },
        {
            "metadata": {},
            "name": "dv",
            "nullable": false,
            "type": "string"
        },
        {
            "metadata": {},
            "name": "razon_social",
            "nullable": false,
            "type": "string"
        },
        {
            "metadata": {},
            "name": "correo",
            "nullable": false,
            "type": "string"
        },
        {
            "metadata": {},
            "name": "fecha",
            "nullable": false,
            "type": "timestamp"
        },
        {
            "metadata": {},
            "name": "segmento",
            "nullable": false,
            "type": "string"
        },
        {
            "name": "parametros",
            "type": {
                "elementType": {
                    "fields": [
                        {
                            "metadata": {},
                            "name": "DR",
                            "nullable": false,
                            "type": "string"
                        },
                        {
                            "metadata": {},
                            "name": "tamanio",
                            "nullable": false,
                            "type": "string"
                        },
                        {
                            "metadata": {},
                            "name": "comuna",
                            "nullable": false,
                            "type": "string"
                        },
                        {
                            "metadata": {},
                            "name": "inferior_hora_inicio",
                            "nullable": false,
                            "type": "string"
                        },
                        {
                            "metadata": {},
                            "name": "inferior_hora_cierre",
                            "nullable": false,
                            "type": "string"
                        },
                        {
                            "metadata": {},
                            "name": "superior_hora_inicio",
                            "nullable": false,
                            "type": "string"
                        },
                        {
                            "metadata": {},
                            "name": "superior_hora_cierre",
                            "nullable": false,
                            "type": "string"
                        },
                        {
                            "metadata": {},
                            "name": "valor_defecto_1",
                            "nullable": false,
                            "type": "string"
                        },
                        {
                            "metadata": {},
                            "name": "valor_defecto_2",
                            "nullable": false,
                            "type": "string"
                        }
                    ],
                    "type": "struct"
                },
                "type": "array"
            }
        }
    ],
    "type": "struct"
}`