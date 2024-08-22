Como comunidad le damos la bienvenida a cualquiera que desee escribir y enviar entradas al blog de Playful Programming. ¡Vamos! En este documento revisaremos los pasos necesarios para crear una nueva publicación, y después enviarla a PP como un *pull request*.

> [!NOTA]
> Para un tutorial más general sobre cómo contribuir a un proyecto con GitHub podrías revisar la guía [ Primeras contribuciones](https://github.com/firstcontributions/first-contributions/blob/main/translations/README.mx.md) antes de seguir leyendo esta página.

Algunos puntos a tomar en cuenta cuando escribas tu artículo:
- ¡Sé incluyente! En PP apoyamos a los desarrolladores de todos los niveles de experiencia - no excluyamos a los novatos ni desanimemos a los lectores que desean aprender algo nuevo.
- Busca proporcionar información relevante y verdadera - ¡Te recomendamos citar las fuentes de tu trabajo!
- Mantén tu contenido imparcial; es decir, no hagas anuncios de productos o servicios sin ninguna razón.

Si en algún momento te sientes bloqueado o tienes alguna duda que quieras resolver, no dudes en [abrir un reporte de problema en GitHub](https://github.com/playfulprogramming/playfulprogramming/issues/new) o bien [comunícate con nosotros en Discord](https://discord.gg/FMcvc6T). ¡Estaremos encantados de ayudarte!

---

Contenido:
1. [Crear un perfil de autor](#crear-un-perfil-de-autor)
2. [Escribir una nueva entrada](#escribir-una-nueva-entrada)
3. [Traducir una entrada del blog](#traducir_una-entrada-del-blog)
4. [Enviar una pull request](#submitting-a-pull-request)

# Crear un perfil de autor

Antes de crear una nueva entrada, deberás añadir información acerca de ti. Para lograr eso, crea una nueva carpeta en [`content/`](./content/) con tu nombre de usuario, y agrega un archivo `index.md` dentro de ésta; por ejemplo: `content/eric/index.md`.

Veamos un ejemplo de cómo se vería tu archivo `index.md`:

```js
---
{
  // "name" será tu nombre a mostrar, como quieras 
  // que se vea en tus entradas
  name: "Eric el Programador",

  // "firstName" y "lastName" son necesarios para
  // las etiquetas de OpenGraph - llena estos campos con los datos
  // que consideres apropiados
  firstName: "Eric",
  lastName: "el Programador",

  // "description" es una biografá corta que se mostrará en tu página de perfil
  description: "Programador Haskell, escritor de fanfictions, un unicornio omnisciente.",

  // Tus usuarios de redes sociales pueden incluir "twitter", "github", "gitlab",
  // "linkedIn", "twitch", "dribbble", "mastodon", "threads", "youtube",
  // y "cohost", además de un "website" ¡Puede ser lo que quieras!
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
  // crear una entrada, solo definelo como "author", pero existen más roles
  // ¡Hay roles para programadores y traductores también!
  roles: ["author"]
}
---
```

>¿No quieres mostrar tu foto real en el sitio? ¡Está bien! Tenemos [bastantes emoticones de unicornio personalizados que puedes usar como imagen de perfil](https://github.com/playfulprogramming/design-assets/tree/main/emotes). ¡Son adorables, ve a verlos! 🤩

Una vez que tengas creado tu perfil, puedes ir al siguiente paso...

# Escribir una nueva entrada

Todas las entradas en Playful Programming están dentro de una carpeta: `content/{username}/posts/` - estructuramos esto con una subcarpeta para cada entrada, que contiene un archivo markdown llamado `index.md`. El nombre de la carpeta con la entrada coincidirá con su URL dentro del sitio.

> **¿Estás familiarizado/a con Markdown?**
>
> ¿Revisa el documento [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) para ver ejemplos de cómo formatear distintos tipos de contenido en este archivo!

Cuando escribas tu entrada, necesitarás incluir metadatos en el *frontmatter* en la parte superior del archivo:

```
---
{
  title: "Mi primera entrada en el blog",
  description: "¡Ésta es mi primera entrada en el sitio de Playful Programming!",
  published: '2023-04-11',
  tags: ["meta"],
  license: 'cc-by-4'
}
---

¡Hola! ¡Ésta es mi primera entrada! (TODO: escribir más texto aquí)
```

> **Nota**: El título que definas en el campo "title" siempre se verá en la parte superior de tu entrada. No necesitas iniciar tu entrada con otro encabezado - de lo contrario ¡tu entrada tendrá dos títulos!

<details>
  <summary><strong>Propiedades opcionales</strong></summary>

  Existen algunas propiedades extra que *podrías* incluir en el frontmatter de tu entrada, pero no son necesarias:

  - `authors: ["autor1", "autor2"]` se puede usar para especificar de forma manual los ID's de los autores de una entrada, esto cuando la publicación tenga más de un autor.
  - `edited: "2023-10-21"` sirve para especificar la fecha en la hiciste la "última actuaización" de tu entrada en caso de que realices modificaciones.
  - `collection: "Mi genial serie de artículos"` tratará a un grupo de publicaciones como una serie en caso de que todas tengan la misma cadena `collection` configurada.
  - `order: 0` reordenará las entradas de una colección de acuerdo con el valor que proporciones. Esto no tendrá efecto a menos que la entrada se encuentre dentro de una colección.
  - `originalLink: "https://example.com"` especifica una URL externa que sirva como fuente para tu entrada. ¡Es importante especificar este valor si estás republicando algo que tengas escrito en otro blog!

</details>

## Licencias

Proporcionar una licencia ayuda a explicar lo que los lectores pueden hacer con su trabajo - ya sea que puedan usarlo como material para un curso, o reusarlo en otras formas. Visita [el sitio de Creative Commons](https://creativecommons.org/about/cclicenses/) para obtener una visión general de lo que se permite hacer dentro de los distintos tipos de licencias.

Actualmente, estas son las licencias de creative commons que se permiten como valores dentro de la propiedad "license":

- [`'cc-by-4'`](http://creativecommons.org/licenses/by/4.0/)
- [`'cc-by-nc-sa-4'`](http://creativecommons.org/licenses/by-nc-sa/4.0/)
- [`'cc-by-nc-nd-4'`](https://creativecommons.org/licenses/by-nc-nd/4.0/)
- [`'publicdomain-zero-1'`](https://creativecommons.org/publicdomain/zero/1.0/)

También puedes omitir la propiedad "license". En este caso, tu entrada quedará bajo la licencia [MPL 2.0](https://github.com/playfulprogramming/playfulprogramming/blob/main/LICENSE.md) del repositorio.

## Enlaces incrustados

Las entradas pueden incristar sus propias etiquetas `<iframe>` si es necesario - éstas mostrarán una vista previa de "haz clic para ejecutar" y no afectarán el tiempo de carga de la página.

También puedes incrustar algunos servicios de terceros simplemente pegando el enlace en tu entrada, como vídeos de YouTube o de Twitch, publicaciones de Twitter - y cualquier cosas compatible con [oembed.com](https://oembed.com).

## Imágenes y vídeos

Si metiste enlaces a imágenes o vídeos necesitarás guardar esos archivos en la misma carpeta que tu entrada y cambiar tu documento markdown para que haga referencia a éstos de forma local:

```markdown
![Ferris, la adorable mascota crustácea de Rust](./ferris.png)
```

> ¡Asegúrate de incluir un texto alt descriptivo! Toma en cuenta qué información agregan esas imágenes a tu entrada, y qué contexto podría ser importante para los lectores con capacidades visuales diferentes.

Los vídeos también se pueden incrustar con la siguiente sintaxis:

```html
<video src="./ios_vs_android.mp4" title="Una comparación de cómo se aplica el espaciado de texto en iOS y Android"></video>
```

> Cuando sea posible, los elementos `<video>` deberán elegirse por sobre los archivos `.gif` u otras imágenes animadas en tus entradas. Esto es por motivos de accesibilidad - los vídeos dan más control a los usuarios acerca de cuándo y cómo es que la animación se reproduce.