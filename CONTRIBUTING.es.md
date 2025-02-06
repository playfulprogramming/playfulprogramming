Como comunidad le damos la bienvenida a cualquiera que desee escribir y enviar publicaciones al blog de Playful Programming. En este documento revisaremos los pasos necesarios para crear una nueva publicación, y después enviarla a PP como un *pull request* o solicitud para incorporar cambios.

> [!NOTE]
> Para un tutorial más general sobre cómo contribuir a un proyecto con GitHub porfavor revisar la guía ["Primeras contribuciones"](https://github.com/firstcontributions/first-contributions/blob/main/translations/README.mx.md) antes de seguir leyendo esta página.

Algunos puntos a tomar en cuenta cuando escribas tu artículo:
- ¡Sé incluyente! En PP apoyamos a los desarrolladores de todos los niveles de experiencia - no excluyamos a los novatos ni desanimemos a los lectores que desean aprender algo nuevo.
- Busca proporcionar información relevante y verdadera - ¡Te recomendamos citar las fuentes de tu trabajo!
- Mantén tu contenido imparcial; es decir, no hagas anuncios de productos o servicios sin ninguna razón.

Si en algún momento te sientes bloqueado o tienes alguna duda que quieras resolver, no dudes en [abrir un reporte de problema en GitHub](https://github.com/playfulprogramming/playfulprogramming/issues/new) o bien [comunícate con nosotros en Discord](https://discord.gg/FMcvc6T). ¡Estaremos encantados de ayudarte!

---

Contenido:
1. [Crear un perfil de autor](#crear-un-perfil-de-autor)
2. [Escribir una nueva publicación](#escribir-una-nueva-publicación)
3. [Traducir una publicación del blog](#traducir-una-publicación-del-blog)
4. [Enviar una pull request](#enviar-una-pull-request)

# Crear un perfil de autor

Antes de crear una nueva publicación, deberás añadir información acerca de ti. Para lograr eso, crea una nueva carpeta en [`content/`](./content/) con tu nombre de usuario, y agrega un archivo `index.md` dentro de ésta; por ejemplo: `content/eric/index.md`.

Veamos un ejemplo de cómo se vería tu archivo `index.md`:

```js
---
{
  // "name" será tu nombre a mostrar, como quieras 
  // que se vea en tus publicaciones
  name: "Eric el Programador",

  // "firstName" y "lastName" son necesarios para
  // las etiquetas de OpenGraph - llena estos campos con los datos
  // que consideres apropiados
  firstName: "Eric",
  lastName: "el Programador",

  // "description" es una biografia corta que se mostrará en tu página de perfil
  description: "Programador Haskell, escritor de fanfictions, un unicornio omnisciente.",

  // Tus nombres de usuario en redes sociales. Puedes incluir cuentas de "twitter", "github", "gitlab",
  // "linkedIn", "twitch", "dribbble", "mastodon", "threads", "youtube",
  // "bluesky", y "cohost", además de un "website" que puede ser un enlace a lo que quieras!
  socials: {
    mastodon: "https://hachyderm.io/@playfulprogramming",
    github: "playfulprogramming",
    website: "https://playfulprogramming.com/"
  },

  // Los "pronombres" son opcionales, pero recomendamos que los incluyas en tu perfil
  pronouns: "they/them",

  // "profileImg" es el valor de una imagen que debe estar en la misma ubicación de este archivo
  // - de preferencia con formato PNG/JPEG y al menos 512px de resolución
  profileImg: "./profile.png",

  // El campo "roles" reflejará cómo vas a contribuir al sitio - si vas a
  // crear una publicación, solo definelo como "author", pero existen más roles
  // ¡Hay roles para programadores y traductores también!
  roles: ["author"]
}
---
```

> ¿No quieres mostrar tu foto real en el sitio? ¡Está bien! Tenemos [bastantes emoticones de unicornio personalizados que puedes usar como imagen de perfil](https://github.com/playfulprogramming/design-assets/tree/main/emotes). ¡Son adorables, ve a verlos! 🤩

Una vez que tengas creado tu perfil, puedes ir al siguiente paso...

# Escribir una nueva publicación

Todas las publicaciones en Playful Programming están dentro de una carpeta: `content/{username}/posts/` - estructuramos esto con una subcarpeta para cada publicación, que contiene un archivo markdown llamado `index.md`. El nombre de la carpeta con la publicación coincidirá con su URL dentro del sitio.

> **¿Eres nuevo con Markdown?**
>
> ¿Revisa el documento [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) para ver ejemplos de cómo dar formato a distintos tipos de contenido en este archivo!

Cuando escribas tu publicación, necesitarás incluir metadatos en el *frontmatter* en la parte superior del archivo:

```
---
{
  title: "Mi primera publicación en el blog",
  description: "¡Ésta es mi primera publicación en el sitio de Playful Programming!",
  published: '2023-04-11',
  tags: ["meta"],
  license: 'cc-by-4'
}
---

¡Hola! ¡Ésta es mi primera publicación! (TODO: escribir más texto aquí)
```

> **Nota**: El título que definas en el campo "title" siempre se verá en la parte superior de tu publicación. No necesitas iniciar tu publicación con otro encabezado - de lo contrario ¡tu publicación tendrá dos títulos!

<details>
  <summary><strong>Propiedades opcionales</strong></summary>

  Existen algunas propiedades de sobra que son possibles incluir *como opcion* en el frontmatter de tu publicación, pero que no son necesarias:

  - `authors: ["autor1", "autor2"]` se puede usar para especificar de forma manual los ID's de los autores de una publicación en caso de que la publicación tenga varios autores.
  - `edited: "2023-10-21"` sirve para especificar la fecha en la que hiciste la "última actualización" de tu publicación en caso de que realices modificaciones.
  - `collection: "Mi genial serie de artículos"` tratará a un grupo de publicaciones como una serie en caso de que todas tengan el mismo texto `collection` configurado.
  - `order: 0` reordenará las publicaciones de una colección de acuerdo con el valor que proporciones. Esto no tendrá efecto a menos que la publicación se encuentre dentro de una colección.
  - `originalLink: "https://example.com"` especifica un enlace externo que sirve como fuente para tu publicación. ¡Es importante especificar este valor si estás republicando algo que tengas escrito en otro blog!

</details>

## Licencias

Proporcionar una licencia ayuda a explicar lo que los lectores pueden hacer con tu trabajo - ya sea que puedan usarlo como material para un curso o reusarlo en otras formas. Visita [el sitio de Creative Commons](https://creativecommons.org/about/cclicenses/) para obtener una descripción general de lo que se permite hacer dentro de los distintos tipos de licencias.

Actualmente, estas son las licencias de creative commons que se permiten como valores dentro de la propiedad "license":

- [`'cc-by-4'`](http://creativecommons.org/licenses/by/4.0/)
- [`'cc-by-nc-sa-4'`](http://creativecommons.org/licenses/by-nc-sa/4.0/)
- [`'cc-by-nc-nd-4'`](https://creativecommons.org/licenses/by-nc-nd/4.0/)
- [`'publicdomain-zero-1'`](https://creativecommons.org/publicdomain/zero/1.0/)

También puedes omitir la propiedad "license". En este caso, tu publicación quedará bajo la licencia [MPL 2.0](https://github.com/playfulprogramming/playfulprogramming/blob/main/LICENSE.md) del repositorio.

## Enlaces incrustados

Las publicaciones pueden incrustar sus propias etiquetas `<iframe>` si es necesario - éstas mostrarán una vista previa de "haz clic para ejecutar" y no afectarán el tiempo de carga de la página.

También puedes incrustar algunos servicios de terceros simplemente pegando el enlace en tu publicación, como videos de YouTube o de Twitch, publicaciones de Twitter - y cualquier opción soportada por [oembed.com](https://oembed.com).

## Imágenes y videos

Si añadiste enlaces a imágenes o videos, necesitarás guardar esos archivos en la misma carpeta que tu publicación y cambiar tu documento markdown para que haga referencia a éstos de forma local:

```markdown
![Ferris, la adorable mascota crustácea de Rust](./ferris.png)
```

> ¡Asegúrate de incluir un texto alt descriptivo! Toma en cuenta qué información agregan esas imágenes a tu publicación, y qué contexto podría ser importante para los lectores con capacidades visuales diferentes.

Los vídeos también se pueden incrustar con la siguiente sintaxis:

```html
<video src="./ios_vs_android.mp4" title="Una comparación de cómo se aplica el espaciado de texto en iOS y Android"></video>
```

> Cuando sea posible, los elementos `<video>` deberán elegirse por sobre los archivos `.gif` o otras imágenes animadas en tus publicaciones. Esto es por motivos de accesibilidad - los vídeos dan más control a los usuarios acerca de cuándo y cómo es que la animación se reproduce.

# Traducir una publicación del blog

Si quires agregar una traducción, primero asegúrate de crear un [Archivo de datos de autor](#crear-un-perfil-de-autor) con el rol de `"translator"`, ¡Así podrás recibir crédito por tu trabajo en el sitio!

Para crear un archivo de traduccción para una publicación, copia su archivo `index.md` y renómbralo a `index.(lenguaje).md`, donde `(lenguaje)` es el idioma al que traduces la publicación. Por ejemplo, una traducción al `fr` (francés) podría ser nombrada `index.fr.md`. El contenido dentro de este archivo puede ser traducido a su idioma respectivo.

> Si es necesario traducir cualquiera de las imágenes usadas en la publicación, estas deberán ser nombradas de forma similar - por ejemplo, una traducción de `dom_tree.svg` deberá ser nombrada `dom_tree.fr.svg`.
>
> Cualquier enlace a esas imágenes deberá ser actualizado en el archivo `index.fr.md` de la publicación para que apunte a la imagen traducida.

Como referencia, los códigos que corresponden a cada idioma, los puedes consultar en el archivo [`/content/data/languages.json`](./content/data/languages.json) - si el idioma que quieres usar no se encuentra tal vez sea necesario que lo agregues.

## Encontrar un código de idioma

Cada código de idioma dentro de [`/content/data/languages.json`](./content/data/languages.json) está formado por dos letras en minúscula. Si incluye una región, agrega un guion seguido de otras dos letras en minúscula. Por ejemplo, el código para el francés es `fr` - para referirse al dialecto del francés que se habla en Canadá, el código será `fr-ca`.

> Por favor usa `-` en lugar de `_` en los formatos ISO de la región del idioma. En lugar de `fr_ca`, deberá ser `fr-ca`.

Consulta la lista [Wikipedia: List of ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) para conocer los identificadores que usarás en este formato.

# Enviar una Pull Request

Una vez que hayas hecho todos los cambios, [crea una Pull Request](https://docs.github.com/es/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) para agregar tu publicación al sitio.

- Abre un [nueva Pull Request](https://github.com/playfulprogramming/playfulprogramming/compare) desde tu *fork* (bifurcación).
- Revisa que todos tus archivos estén dentro del Pull Request, y que estos estén siendo combinados a la rama principal o `main`.
- Crea el PR y espera a que quien mantiene el sitio lo revise.
- Una vez combinada (*merged*), ¡tu publicación será visible en el sitio!

¡Nos pondremos en contacto contigo si tenemos alguna duda o retroalimentación cuando revisemos tu publicación!
