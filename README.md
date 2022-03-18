# Render Manager

El render manager es un bloque que permite dinamismo a nivel grafico para el template donde se implemente.
Gracias a las diferentes opciones de personalización, podemos ajustar la estructura de la pagina, según los componentes que se tengan disponibles para usar.

## Configuración

1. Importe la palicación del render manager, dentro de las dependencias de su manifest, en el Store Theme, asi:

```
"dependencies":{
    "grupocaiopartnerco.render-manager": "0.x"
}
```

2. Agregue el bloque "render-manager-custom", al template donde desea que se visualice, asi:

```
    "render-manager-custom":{
        "children":["rich-text#text-one",
                    "rich-text#text-two"
        ],
        "props":{
            "list":[
                {"key":"rich-text#text-one", "name":"Text one"},
                {"key":"rich-text#text-two", "name":"Text two"}
            ]
        }
    },
    "rich-text#text-one": {
        "props": {
            "textAlignment": "CENTER",
            "textPosition": "CENTER",
            "text": "Visit our [help](https://help.vtex.com/en/faq/what-is-vtex-io) section.\n*Be Bold!*\n**This is italic**",
            "textColor": "c-on-emphasis",
            "font": "t-heading-5",
            "blockClass": "help-message"
        }
    }, 
    "rich-text#text-two": {
        "props": {
            "textAlignment": "CENTER",
            "textPosition": "CENTER",
            "text": "Visit our [help](https://help.vtex.com/en/faq/what-is-vtex-io) section.\n*Be Bold!*\n**This is italic**",
            "textColor": "c-on-emphasis",
            "font": "t-heading-5",
            "blockClass": "help-message"
        }
    }

```


NOTA:

 1. Agregue en children, aquellos componentes que desea tener dispobles para usar a traves del render manager.
 2. En props, agregue una nueva propiedad "list", en donde especifique la interfaz y en nombre de los componentes a usar. 
    - key: Hace referencia a el nombre de la interfaz del bloque que se tendra disponible.
    - Name: Hace referencia al nombre, como el cual se nombrará el componente.


| Nombre props | Tipo | Descripción |
| -- | -- | -- |
| list | List | Hace referencia al objeto que identifica el bloque que estara disponible para usar. Es necesario que la interfaz que se defina aqui, este tambien incluida como children. |



**List**, es un objeto, que recibe los siguientes parametros:


| Nombre props | Tipo | Descripción |
| -- | -- | -- |
| key | String | Hace referencia a la interfaz, esta debe estar incluida dentro de children |
| name | String | Hace referencia al nombre, con el cual el administrador relacionará el componente en especifico |


Desde el site editor, se pueden realizar las siguientes configuraciones:

1. Puede seleccionar de una lista de componentes, cuales desea que sean visibles en el template.
2. Puede determinar cada cuanto mostrar el componente "__fold__", con el fin de aumentar la velocidad de carga de la pagina.

Para cada componente que agregue, puede realizar la siguiente configuración:

| Nombre props | Tipo | Descripción |
| -- | -- | -- |
| Component Name | String | Hace referencia al nombre personalizado que el administrador le asigna al componente |
| Component | String | Hace referencia a una lista, de componentes disponibles y listos para usar. ESta lista es la misma que se envia por props desde el store-theme |
| Show Component | Boolean | Indica si el componente se debe mostrar o no, en el template |
| Background color | String | Hace referencia al color de fondo del contenedor del componente |
| Background image | String | Hace referencia a la imagen de fondo del contenedor del componente. Si se tiene configurado background color y background image, el le da prioridad a la imagen |
| Padding | String | Hace referencia al padding del contenedor del componente. Ejemplo : 10px 10px 10px 10px |
| Margin | String | Hace referencia a la margen del contenedor del componente. Ejemplo : 10px 10px 10px 10px |
| Previus Text | String | Hace referencia a un rich-text, antes del componente a renderizar |
| BlockClass| String | Hace referencia a una clase css custom, que permite identificar el contenedor del componente |
