---
{
  title: "Write Simpler Tests - 5 Suggestions for Better Tests",
  description: "Writing tests is a big skill for any engineer, but we often over-complicate them. Let's simplify our tests for better testing overall!",
  published: '2020-05-26T05:12:03.284Z',
  authors: ['crutchcorn', 'skatcat31'],
  translators: ['alexchadwickp'],
  tags: ['testing', 'jest'],
  license: 'cc-by-nc-sa-4'
}
---

Escribir test es parte del desarrollo, y las habilidades que permiten escribir tests de alta calidad se desvían del conjunto típico de habilidades de programación. Esto no quiere decir que programar y escribir tests sean totalmente distintos, pero cuando estas escribiendo estos tests necesitas llevar una mentalidad distinta. Una de las diferencias mas importantes entre escribir tests y programar, es que tiende a beneficiar a tu aplicación si puedes escribir tests mas simples.

Aquí hemos recopilado 5 métodos para simplificar tus tests, todo esto mientras aseguras que sean más fáciles de escribir, entender y eliminar los fallos de tu aplicación.

Es posible que notes que nuestros ejemplos utilizan varias librería de [the Testing Library suite of libraries](https://testing-library.com/). Esto se debe a que creemos que estas metodologías encajan bien con los tests centrados en los desarrolladores que fomenta la librería.

> Ten en cuenta que Jest (y por entonces, Testing Library) no es exclusivo a
> ninguna herramienta o framework. Este artículo pretende dar consejos generales sobre testing
> 
> Con eso dicho, si estas planeando en incluir Jest y Testing Library en tu aplicación de Angular,
> pero no sabes por donde empezar, [hemos escrito una guía en como hacerlo]

# No incluyas lógica que pertenece a tu aplicación en tus tests {#dont-include-logic}

Tengo una confesión que hacer: me gusta la metaprogramación. Ya sea que trate de mecanografías, librerías complejas, plugins de Babel, es un placer para mi escribir todo esto.

El problema con el que me encuentro es que a veces no es un placer para otra gente tener que leer (o depurar) este tipo de código. Esto es más notable cuando escribo tests: cuando no me aseguro de mantenerlos sencillos, mis tests tienden a sufrir.

Para demonstrar este argumento, vamos a utilizar un componente de ejemplo: Una tabla. Este componente debería tener esta funcionalidad: 
- Paginación opcional
- Cuando la paginación está  desactivada, debería enumerar todos los elementos
- Mostrar una fila de varios conjuntos de datos

Podríamos utilizar un "`for` loop" para asegurarnos de que cada fila contiene cada conjunto de datos. Esto nos permite tener nuestra lógica más o menos centralizada, y por lo tanto podríamos cambiarlo fácilmente.

```javascript
import { screen, getByText } from '@testing-library/dom';
import moment from 'moment';

const rows = [{
    // ... Una colección de objetos que contienen un nombre, número de teléfono, y fecha de nacimiento
}]

rows.forEach((fila, index) => {
    const filaDom = screen.getByTestId(`fila-${index}`);
    expect(getByText(filaDom, fila.nombre)).toBeInTheDocument();
    expect(getByText(filaDom, moment(fila.nacimiento).format(formatDate))).toBeInTheDocument();
    expect(getByText(filaDom, fila.telf)).toBeInTheDocument();
})
```

Aunque este test es fácil de leer, no es inmediatamente claro que contenido queremos ver en la pantalla (screen).

Por ejemplo, ¿cuántos elementos espero que se rendericen?

Yo preferiría ver el siguiente ejemplo:

```javascript
const persona1 = fila[0];
const persona2 = fila[1];
const persona3 = fila[2];

expect(screen.getByText(persona1.nombre)).toBeInTheDocument();
expect(screen.getByText(moment(persona1.nacimiento).format(formatDate))).toBeInTheDocument();
expect(screen.getByText(persona1.telf)).toBeInTheDocument();

expect(screen.getByText(persona2.nombre)).toBeInTheDocument();
expect(screen.getByText(moment(persona2.nacimiento).format(formatDate))).toBeInTheDocument();
expect(screen.getByText(persona2.telf)).toBeInTheDocument();

expect(screen.getByText(persona3.nombre)).toBeInTheDocument();
expect(screen.getByText(moment(persona3.nacimiento).format(formatDate))).toBeInTheDocument();
expect(screen.getByText(persona3.telf)).toBeInTheDocument();
```

Este código es mucho más repetitivo, y no es un ejemplo perfecto, pero refleja la simplicidad que estamos buscando. Nos dice de forma más inmediata que pantalla queremos very, y que información estamos buscando sobre las personas.

Cuando le planteé este punto a un compañero de trabajo, me recordó la expresión "Escribe código para tu audiencia". En este caso, tu audiencia son desarrolladores novatos en tu equipo, intentando averiguar porque esta fallando un test, o ingenieros de calidad que no estén familiarizados con tu lenguaje de programación, o a ti mismo cuando estas en medio de desplegar algo muy importante para producción y tus tests fallan de forma inesperada. Cada una de estas situaciones se benefician de tests más simples de entender.

Además, escribir código más simple tiene otra ventaja: Mensajes de error. Cuando utilizamos el `forEach`, cuando aparece un error, no se sabe que parte de los datos no están siendo renderizados. Solo sabes que hay _algo_ que no se esta renderizando, pero no sabes que datos en particular, son los que faltan. Si borré la última fila por completo, no me dejaría saber que fila esta dando el error. Pero al sacarlos del `forEach`, es inmediatamente claro en que fila particularmente hay un error.

# Integra tus datos de prueba en el código {#hardcode-data}

Comenzamos nuestro ejemplo previamente eliminando los bucles `for`, y este paso siguiente puede ser complicado si no hemos realizado el paso anterior primero. Escribiendo tus datos de prueba directamente en el código (de ahora en adelante denominaremos esto como "hard-coding"), es una de las cosas mas importantes que puedes hacer para simplificar tus tests y para reducir el potencial para errores.

Vamos a ver un ejemplo en el que creamos datos de prueba:

```javascript
const faker = require('faker');

const generatePerson = () => ({
    nombre: faker.name.findName(),
    nacimiento: faker.date.past(),
    telf: faker.phone.phoneNumber(),
});

// Generar lista de 20 personas random
const datos = Array.from({length: 20}, () => generatePerson());
```

Aunque esto nos deja rápidamente cambiar cuantos datos random se generan, hace que nuestros tests sean mucho más difíciles de leer. Vamos a ver 2 ejemplos, para ver cual es más fácil de entender:

```javascript
const persona1 = fila[0];
expect(screen.getByText(persona1.nombre)).toBeInTheDocument();
expect(screen.getByText(moment(persona1.nacimiento).format(formatDate))).toBeInTheDocument();
expect(screen.getByText(persona1.telf)).toBeInTheDocument();
```

Ahora, ¿es más fácil de leer el código de arriba, o el de abajo?

```javascript
expect(screen.getByText('Rafael Nadal')).toBeInTheDocument();
expect(screen.getByText('03/06/1986').toBeInTheDocument());
expect(screen.getByText('+34 787 713 031')).toBeInTheDocument();
```

El de abajo tiene otras ventajas que igual no son claras de forma inmediata. Para empezar, no solo es más fácil entender _exactamente_ que no esta presentándose en la pantalla, pero cuando quitas detalles de implementación, es posible que resalte errores que puede provenir de dicha implementación. Por ejemplo, puedes notar que estábamos usando `moment` en el primer ejemplo. Ahora que estamos hard-coding nuestros datos en el segundo ejemplo, si hay un bug en como mostramos nuestros datos, pues se podrá ver fácilmente, y esto no es posible si estamos usando `moment`.

Eso nos lleva a otro argumento para hacer hard-coding de datos y simplificar nuestros tests en general: Investigar errores es lo peor, y más todavía si estamos haciéndolo en un test. Cuando integras los datos en los tests, el peor bug que puedes encontrarte es un string mal escrito.

Asi que ahora la pregunta es: ¿cómo generamos grandes porciones de datos sin tener que incluirlos de forma manual?

Todavía puede hacerlo programáticamente como lo hicimos antes, simplemente tienes que guardarlo en un archivo separado. Por ejemplo:
```javascript
 const faker = require('faker');
 const fs = require('fs');

 const generatePerson = () => ({
  nombre: faker.name.findName(),
  nacimiento: faker.date.past(),
  numero: faker.phone.phoneNumber(),
});

const data = Array.from({length: 20}, () => generatePerson());

const filas = JSON.stringify(data, null, 2);

fs.writeFileSync('datos_de_prueba.js', `module.exports = ${rows}`);
```

Ahora puedes importarlos de esta manera: `const datosDePrueba = require('./datos_de_prueba.js')` dentro de tu archivo con el test.

# Mantenga los tests enfocados {#seperate-tests}

Cuando estas trabajando en tests, resulta fácil agrupar acciones juntas en un solo test. Por ejemplo, imagina que queremos hacer tests en nuestro componente de tabla para asegurarnos que tienen el siguiente comportamiento:

- Muestra todas las columnas de los datos sobre los usuarios
- Se asegura que un usuario en la segunda pagina no se muestra mientras estamos en la primera

Podríamos hacer esto con un solo test:

```javascript
it('renderiza el contenido apropiadamente', () => {
	// Expect page 1 person to be on screen
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();

	// Expect page 2 person not to be on screen
	expect(screen.getByText('Joe Hardell')).not.toBeInTheDocument();
	expect(screen.getByText('2010/03/10')).not.toBeInTheDocument();
	expect(screen.getByText('783.879.9253')).not.toBeInTheDocument();
})
```

Pero cuando miras a los tests que están fallando o están dando errores, los mensajes que te dan son muy vagos y hacen difícil identificar los errores. También hacen que tus tests se vean mas desordenados.

Alternativamente, sugiero que los separes en 2 tests distintos:

```javascript
it('renderiza todas las columnas', () => {
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();
})

it('no renderiza ninguna persona de pagina 2 en pagina 1', () => {
	expect(screen.getByText('Joe Hardell')).not.toBeInTheDocument();
	expect(screen.getByText('2010/03/10')).not.toBeInTheDocument();
	expect(screen.getByText('783.879.9253')).not.toBeInTheDocument();
})
```

Aunque esto resulte en tests que se ejecutan mas lentamente, ya que duplicamos la cantidad de veces que se renderiza, no debería ser muy notable ya que estos tests deberían ejecutarse en cuestión de milisegundos.

También argumentaría que merece la pena el tiempo añadido a cambio de tests que son mas legibles.

# No dupliques lo que estas probando {#dont-duplicate}

Hay incluso otra ventaja que nos trae separar los tests que todavía no he mencionado: te deja disminuir la cantidad de lógica que tienes en otros tests. Vamos a ver el ejemplo anterior:

```javascript
it('renderiza todas las columnas', () => {
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();
})

it('no renderiza ninguna persona de pagina 2 en pagina 1', () => {
	expect(screen.getByText('Joe Hardell')).not.toBeInTheDocument();
	expect(screen.getByText('2010/03/10')).not.toBeInTheDocument();
	expect(screen.getByText('783.879.9253')).not.toBeInTheDocument();
})
```

Aunque este test al principio parece bien escrito, yo diría que los tests tienen lógica duplicada: Ya sabemos que la tabla debería mostrar todos los contenidos en la pantalla, ¿por qué tenemos que volver a asegurarnos de que _todos_ los elementos en la tabla están escondidos?

Este igual es un mal ejemplo. Quizás quieres demonstrar que todas tus columnas se están escondiendo adecuadamente. Vamos a mirar otro ejemplo.

Digamos que quiero asegurarme de que cuando mi tabla tiene la paginación desactivada, se ven todas las personal en la tabla. Podríamos escribir los tests de 2 maneras:

```javascript
it('mostrar todas las columnas de datos', () => {
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();
})

it('mostrar todos los usuarios', () => {
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();

	expect(screen.getByText('Joe Hardell')).toBeInTheDocument();
	expect(screen.getByText('2010/03/10')).toBeInTheDocument();
	expect(screen.getByText('783.879.9253')).toBeInTheDocument();
})
```

O podríamos escribir este test asi:

```javascript
it('mostrar todas las columnas de datos', () => {
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();
	expect(screen.getByText('2020/01/14')).toBeInTheDocument();
	expect(screen.getByText('964.170.7677')).toBeInTheDocument();
})

it('mostrar todos los usuarios', () => {
	// Que se muestre la primera persona
	expect(screen.getByText('Jadyn Larson')).toBeInTheDocument();

	// Que se muestre la ultima persona
	expect(screen.getByText('Joe Hardell')).toBeInTheDocument();
})
```

En este ejemplo prefiero el segundo test. Es un poco mas cercano a como me aseguraría de que el comportamiento es el adecuado de forma manual, y también reduce el tamaño de mis tests. Ya sabemos que todas las columnas se están mostrando, ¿por qué no nos fiamos de nuestro primer test y separar la lógica que estas probando? Esto hace que encontrar errores sea mas fácil también. Si la columna para el numero de teléfono no se esta mostrando, solo fallara un test, no dos. Esto hace que sea mas fácil identificar que es lo que falla y como arreglarlo.

Al final y al cabo, cuando estas escribiendo tests, una buena regla a seguir es "Deberían ser sencillos, como si fueran instrucciones, y deberían poder entenderse por una persona sin conocimiento tecnológico".

# No incluyas lógica de red en tus tests de renderizado {#seperate-network-logic}

Digamos que en un componente queremos incluir alguna lógica para implementar características de plataformas sociales. Vamos a seguir las mejores practicas y tenemos una aplicación bonito que utiliza GraphQL con ApolloGraphQL para que no tengamos que importar un montón de API's. Ahora que estamos empezando a escribir nuestros tests tenemos _un montón_ de redes simuladas. ¿Por qué necesitamos esto para nuestro renderizado?

```javascript
// ComponenteConectado.spec.tsx
it("renderizados", async () => {
  const { findByText, getByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Component />
    </MockedProvider>
  );

  expect(getByText("Cargando componente...")).toBeInTheDocument();
  waitForElement(() => expect(getByText("Element")).toBeInTheDocument());
  expect(getByText("Nombre")).toBeInTheDocument();
});
```

Tenemos un `MockProvider` que seria nuestra proveedora simulada, `mocks` que son nuestras simulaciones, lógica para los estados de carga, y finalmente tenemos lo que en realidad nos importa en nuestros tests, que es como se renderizan las cosas a las pantallas. Ahora nuestros tests son específicos a esta implementación. ¿Como podríamos hacer para que en caso de que cambie la capa que maneja la transferencia de datos, todavía podemos asegurarnos de que nuestros tests y nuestros componentes todavía funcionan con actualizaciones mínimas?

Afortunadamente, la respuesta a esa pregunta es sencilla. Mirando por encima nuestro componente podemos ver la capa de datos y un poco de lógica:

```javascript
// ComponenteConectado.tsx
export default () => {
  const { data } = userQueryHook();
  const { usuario } = data?.usuario; 
  
  return !usuario
    ? <span>Cargando componente...</span>
    : <><span>Elemento</span><span>{usuario.nombre}</span></>
```

Aquí el componente va a montarse dentro del DOM, y luego va a pedir unos datos sobre el usuario para almacenar en su estado. Esto no es necesariamente algo malo, pero quiere decir que los tests necesitan una manera de probar el componente y la lógica de la capa de red.

No queremos que nuestros tests hagan eso ya que ahora nuestro componente y su test están directamente relacionados a como esta implementado el componente, y nuestro test ahora esta mas cerca de ser un test de integración que un test de unidad en el miramos que se muestra. En vez de esto, lo que tenemos que hacer es quitar la logica para que el componente pueda simplemente renderizarse. Podemos hacer esto de varias maneras, pero el método mas rápido y sencillo es extraer la logica para recolectar datos y colocarla en una capa mas alta, y simplemente recibir los datos como un prop o argumento.

```javascript
// RenderComponenteConectado.tsx
export default ({ Usuario }:{ usuario: TipoUsuario }) => {
  return !usuario
    ? <span>Cargando componente…</span>
    : <><span>Elemento</span><span>{usuario.nombre}</span></>
}
```

```javascript
// ComponenteConectado.tsx
export default () => {
  const { datos } = userQueryHook();
  const { usuarios } = data?.usuario; 

  return <RenderComponenteConectado usuario={ usuario } />
}
```

Ahora los tests para el componente se ven mucho mas sencillos:


```javascript
// ComponenteConectado.spec.tsx
it("se muestra sin datos", async () => {
  const { findByText, getByText } = render(<RenderComponenteConectado />);

  expect(getByText("Loading component...")).toBeInTheDocument();
});

it("se muestra con datos", async () => {
  const { findByText, getByText } = render(<RenderComponenteConectado usuario={ nombre: 'Nombre' } />);

  expect(getByText("Elemento")).toBeInTheDocument();
  expect(getByText("Nombre")).toBeInTheDocument();
});
```

Ahora los tests han sido drásticamente simplificados y podemos escribir tests con simulaciones para nuestra red especifica, separada de nuestros tests de unidades.

Al utilizar grandes cantidades de datos sobre una red que te gustaría simular, asegúrate de [hacer hard-coding esos datos utilizando archivos de simulación](#hardcode-data).

# Conclusion {#conclusion}

Utilizando estos métodos, tus tests pueden ser simplificados, y en muchas ocasiones puede correr mas rápido, y acortar el tamaño de tu test. Aunque puede sonar muy simple, la escritura de tests es una habilidad que se mejora como cualquier otra. La practica fomenta el crecimiento, asi que no te desilusiones cuando tus tests no son tan simples como te gustaría que fueran al principio.

Si tienes alguna pregunta sobre la escritura de tests, o si tienes un test que no estas seguro de como simplificar, únete a [nuestro servido de Discord](https://discord.gg/FMcvc6T). Nos metemos en un montón de debates sobre el desarrollo y la ingeniería software, y a veces hasta hacemos programación por parejas cuando se puede.
