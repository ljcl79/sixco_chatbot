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

[
  {
      "mensaje": "Bienvenido a Grifo Creativo atención cliente. ☺",
      "tipo": "mensaje",
      "final_flujo": false
  },
  {
      "mensaje": "Soy cliente ",
      "tipo": "seleccion_lista",
      "tipo_entrada": "numero",
      "opciones": [
          {
              "valor": "1",
              "mensaje": "Soy Cliente",
              "proximo_paso": [
                  {
                      "mensaje": "Por favor indicar nombre de cliente.",
                      "tipo": "mensaje",
                      "tipo_entrada": "texto",
                      "final_flujo": false
                  },
                  {
                      "mensaje": "¿Es una incidencia/consulta o solicitud para un desarrollo nuevo?",
                      "tipo": "seleccion_lista",
                      "tipo_entrada": "numero",
                      "opciones": [
                          {
                              "valor": "1",
                              "mensaje": "Incidencia/Consulta",
                              "proximo_paso": [
                                  {
                                      "mensaje": "Por favor describa  la situación (por ejemplo, donde se localiza el inconveniente, nombre del módulo, etc). y cuál es la problemática. Puede incluir audio, video o imagen, siempre para incidencias, se solicita captura de pantalla para ver el detalle.",
                                      "tipo": "mensaje",
                                      "tipo_entrada": "texto",
                                      "final_flujo": false
                                  },
                                  {
                                      "mensaje": "Mandar email a soporte@grifocreativo.com notificando que ingreso un nuevo ticket.",
                                      "tipo": "accion",
                                      "tipo_entrada": "insertar_ticket",
                                      "final_flujo": false
                                  },
                                  {
                                      "mensaje": "Tu pedido fue ingresado correctamente,  el Equipo de Soporte se pondrá en contacto con usted a la brevedad. Muchas gracias ",
                                      "tipo": "mensaje",
                                      "tipo_entrada": "texto",
                                      "final_flujo": true
                                  }
                              ]
                          },
                          {
                              "valor": "2",
                              "mensaje": "Solicitud desarrollo nuevo",
                              "proximo_paso": [
                                  {
                                      "mensaje": "Gracias el Equipo de Desarrollo se pondrá en contacto con usted para hacer el relevamiento.",
                                      "tipo": "mensaje",
                                      "tipo_entrada": "texto",
                                      "final_flujo": false
                                  },
                                  {
                                      "mensaje": "En un futuro podríamos dar un calendario de opciones para armar una reunión con nosotros. ",
                                      "tipo": "mensaje",
                                      "tipo_entrada": "texto",
                                      "final_flujo": true
                                  }
                              ]
                          }
                      ],
                      "final_flujo": false
                  }
              ]
          },
          {
              "valor": "2",
              "mensaje": "No soy Cliente",
              "proximo_paso": [
                  {
                      "mensaje": "Gracias por confiar en nosotros, desde Grifo Creativo ponemos siempre nuestro mejor empeño para brindarles la mejor solución a nuestros clientes. Dejanos tus datos y nos pondremos en contacto muy pronto!",
                      "tipo": "mensaje",
                      "tipo_entrada": "texto",
                      "final_flujo": false
                  },
                  {
                      "mensaje": "enviar email a ltramontini@grifocreativo.com y dtramontini@grifocreativo.com",
                      "tipo": "accion",
                      "tipo_entrada": "crear_oportunidad",
                      "final_flujo": true
                  }
              ]
          }
      ],
      "final_flujo": false
  }
]