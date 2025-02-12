[
  {
    mensaje: "SE QUE ESTAS VIAJANDO",
    tipo: "mensaje",
    final_flujo: true,
  },
  {
    mensaje: "¿VAS A DESCANSAR?",
    tipo: "seleccion_botones",
    tipo_entrada: "texto",
    opciones: [
      {
        valor: "1",
        mensaje: "SI",
        proximo_paso: [
          {
            mensaje: "REGISTRAMOS TU RESPUESTA BUEN DESCANSO",
            tipo: "mensaje",
            tipo_entrada: "texto",
            final_flujo: true,
          },
        ],
      },
      {
        valor: "2",
        mensaje: "NO",
        proximo_paso: [
          {
            mensaje: "¿TIENES ALGUN PROBLEMA?",
            tipo: "seleccion_lista",
            tipo_entrada: "texto",
            opciones: [
              {
                valor: "1",
                mensaje: "SI",
                proximo_paso: [
                  {
                    mensaje: "SELECCIONA DE LA LISTA CUAL ES EL PRIBLEMA",
                    tipo: "seleccion_lista",
                    tipo_entrada: "texto",
                    opciones: [
                      {
                        valor: "1",
                        mensaje: "PROBLEMA CON EL MOTRO",
                        proximo_paso: [
                          {
                            mensaje: "",
                            tipo: "seleccion_botones",
                            tipo_entrada: "numero",
                            opciones: [
                              {
                                valor: "1",
                                mensaje: "CARBURADOR",
                                proximo_paso: [],
                                final_flujo: true,
                              },
                              {
                                valor: "2",
                                mensaje: "CORREA DEL TIEMPO",
                                proximo_paso: [],
                                final_flujo: true,
                              },
                              {
                                valor: "3",
                                mensaje: "VENTILADOR",
                                proximo_paso: [],
                                final_flujo: true,
                              },
                            ],
                          },
                        ],
                      },
                      {
                        valor: "2",
                        mensaje: "PROBLEMA CON LOS FRENOS",
                        proximo_paso: [],
                        final_flujo: true,
                      },
                      {
                        valor: "3",
                        mensaje: "PROBLEMA ELECTRICO",
                        proximo_paso: [],
                        final_flujo: true,
                      },
                    ],
                  },
                ],
              },
              {
                valor: "2",
                mensaje: "NO",
                proximo_paso: [
                  {
                    mensaje: "ENTONCES QUE TENGAS UN BUEN DESCANSO",
                    tipo: "mensaje",
                    tipo_entrada: "texto",
                    final_flujo: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
][
  ({
    mensaje: "SE QUE ESTAS VIAJANDO",
    tipo: "mensaje",
  },
  {
    mensaje: "¿VAS A DESCANSAR?",
    tipo: "seleccion_botones",
    tipo_entrada: "texto",
    opciones: [
      {
        valor: "1",
        mensaje: "SI",
        proximo_paso: [
          {
            mensaje: "REGISTRAMOS TU RESPUESTA BUEN DESCANSO",
            tipo: "mensaje",
            tipo_entrada: "texto",
          },
        ],
      },
      {
        valor: "2",
        mensaje: "NO",
        proximo_paso: [
          {
            mensaje: "¿TIENES ALGUN PROBLEMA?",
            tipo: "seleccion_lista",
            tipo_entrada: "texto",
            opciones: [
              {
                valor: "1",
                mensaje: "SI",
                proximo_paso: [
                  {
                    mensaje: "SELECCIONA DE LA LISTA CUAL ES EL PRIBLEMA",
                    tipo: "seleccion_lista",
                    tipo_entrada: "texto",
                    opciones: [
                      {
                        valor: "1",
                        mensaje: "PROBLEMA CON EL MOTRO",
                        proximo_paso: [],
                      },
                      {
                        valor: "2",
                        mensaje: "PROBLEMA CON LOS FRENOS",
                        proximo_paso: [],
                      },
                      {
                        valor: "3",
                        mensaje: "PROBLEMA ELECTRICO",
                        proximo_paso: [],
                      },
                    ],
                  },
                ],
              },
              {
                valor: "2",
                mensaje: "NO",
                proximo_paso: [
                  {
                    mensaje: "ENTONCES QUE TENGAS UN BUEN DESCANSO",
                    tipo: "mensaje",
                    tipo_entrada: "texto",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  })
];


